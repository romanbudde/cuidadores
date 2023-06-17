const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
const bcrypt = require('bcrypt');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const { Client } = require('pg');
const client = new Client();

const passport = require('passport');
const LocalStrategy = require('passport-local');

const flash = require('express-flash')
const session = require('express-session')

// setting GMT -3 Timezone.
process.env.TZ = 'America/Sao_Paulo';

// middleware
app.use(cors());
app.use(express.json());
app.use(flash())

app.use(bodyParser.json());

// initialize PassportJS and enable session support
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(router);

app.use(cors({
    origin: "http://localhost:3000"
}))

passport.use(new LocalStrategy(
	{usernameField:"email", passwordField:"password"},
    async function(email, password, done) {
        // Authenticate the user
        console.log('--- AT login localStrategy ---');
        const { rows } = await pool.query(
            'SELECT * FROM users WHERE mail = $1',
            [email]
        );
        const user = rows[0];
        if (!user) {
            console.log('email no registrado');
            return done(null, false, { message: 'Email no registrado.' });
        }

        const match = await bcrypt.compare(password, user.password)
        .then((isMatch) => {
            if (isMatch) {
                console.log('matchhhhheeesss!!');
                return done(null, user);
                // return res.status(200).json({
                //     message: "logged in successfully!",
                //     user: {
                //         id: user.id,
                //         email: user.email
                //     }
                // });
            }
            else {
                console.log('DOES NOT MATCH!!');
                return done(null, false, { message: 'Contraseña incorrecta.' });
            }
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(async function(id, done) {
    // Retrieve user information from database
    try {
        const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        done(null, user.rows[0]);
    }
    catch (error) {
        done (err)
    }
});

// Routes

// login cuidador
app.post('/login', passport.authenticate('local'), (req, res) => {
	console.log(req.user);
    console.log('Login has been authenticated!');

	// generate the JWT that we're gonna send back as a response to the client.
	const payload = { userId: req.user.id };
	const secretKey = process.env.JWT_SECRET;
	// Generate token
	const token = jwt.sign(payload, secretKey);
	console.log("JWT Token: ", token);

	// send token back to the client
	res.json({
		"auth_token": token,
		"user_id": req.user.id,
		"user_type": req.user.type

	});


});

// create - un cuidador
app.post('/cuidadores', async(req, res) => {
    try {
        console.log('---- backend ----');
        console.log(req.body);
        const { description, password, email, userType, firstname, lastname } = req.body;
        
        console.log('---- current date ----');
        const created_at = new Date();
        console.log(created_at);

        console.log(password);
        const hashedPassword = await bcrypt.hash(password, 10);

        const newCuidador = await pool.query(
            "INSERT INTO users (description, mail, password, type, created_at, enabled, name, last_name) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *", 
            [description, email, hashedPassword, userType, created_at, 1, firstname, lastname]
        );

        // res.json(req.body);
        res.json(newCuidador.rows[0]);
    }
    catch (error) {
        console.error(error.message);
    }
});

// user login
// app.post('/login', async(req, res) => {
//     try {
//         console.log('---- backend (login route) ----');
//         console.log(req.body);
//         const { email, password } = req.body;
//         // const hashedPassword = await bcrypt.hash(password, 10);

//         const { rows } = await pool.query(
//             'SELECT * FROM users WHERE mail = $1',
//             [email]
//         );
//         const user = rows[0];
//         // res.json({"user": user});

//         if(!user){
//             return res.status(401).json({ error: 'Email no registrado.' });
//         }

//         // Compare the password with the hashed password in the database
//         const hashedPassword = await bcrypt.hash(password, 10);
//         console.log('hashed password: ', hashedPassword);
//         console.log('users password: ', user.password);
//         console.log('passed password: ', password);
//         // console.log('hashedPassword: ', hashedPassword);
//         const match = await bcrypt.compare(password, user.password)
//             .then((isMatch) => {
//                 if (isMatch) {
//                     console.log('matchhhhheeesss!!');
//                     // return done(null, user);
//                     return res.status(200).json({
//                         message: "logged in successfully!",
//                         user: {
//                             id: user.id,
//                             email: user.email
//                         }
//                     });
//                 }
//                 else {
//                     console.log('DOES NOT MATCH!!');
//                     return res.status(401).json({ error: 'Contraseña incorrecta.' });
//                 }
//             });

//     }
//     catch (error) {
//         console.error(error.message);
//         return res.status(500).json({ error: error.message });
//     }
// });

// user register
app.post('/register', async(req, res) => {
    try {
        console.log('---- backend (register route) ----');
        console.log(req.body);
        const { email, password, firstname, lastname} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const created_at = new Date();


        const userExists = await pool.query(
            "SELECT * FROM users WHERE mail = $1",
            [email]
        );

        if(userExists.rows > 0) {
            return res.status(401).json({ error: 'Ups, el email ya está registrado con otro usuario.' });
        } 
        else {
            const newUser = await pool.query(
                "INSERT INTO users (mail, password, type, created_at, enabled, name, last_name) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *", 
                [email, hashedPassword, '0', created_at, 1, firstname, lastname]
            );
    
            // Generate token
            const payload = { userEmail: email };
            const secretKey = process.env.JWT_SECRET;

            const token = jwt.sign(payload, secretKey);
            console.log("JWT Token: ", token);

            // send token back to the client
            
            res.json({
                "user": newUser.rows[0],
                "token": token
            });
        }

        // res.json(req.body);
        res.json(userExists.rows[0]);
    }
    catch (error) {
        console.error(error.message);
        res.json(error.message);
    }
});

// get all - cuidadores
app.get("/cuidadores", async(req, res) => {
    try {
        const allCuidadores = await pool.query("SELECT * from users")
        res.json(allCuidadores.rows);
    }
    catch (error) {
        console.error(error.message);
    }
});

// get all - user types
app.get("/user_types", async(req, res) => {
    try {
        const userTypes = await pool.query("SELECT * from user_type")
        res.json(userTypes.rows);
    }
    catch (error) {
        console.error(error.message);
    }
});

// filtrar cuidadores (desde el lado del usuario)
app.post("/search_cuidadores", async(req, res) => {
    try {
		const { min_rate, max_rate, lowest_score_acceptable } = req.body;
		console.log(min_rate);
		console.log(max_rate);
		console.log(lowest_score_acceptable);
		
		const values = [];
		values.push(lowest_score_acceptable);

		let query = "SELECT * FROM users WHERE type = '1' AND enabled = true AND average_review_score >= $1";


		if (min_rate && max_rate) {
			query += " AND hourly_rate BETWEEN $2 AND $3";
			values.push(min_rate);
			values.push(max_rate);
		} else if (min_rate) {
			query += " AND hourly_rate >= $2";
			values.push(min_rate);
		} else if (max_rate) {
			query += " AND hourly_rate <= $2";
			values.push(max_rate);
		}

        const allCuidadores = await pool.query(query, values);
		// console.log(allCuidadores);
        res.json(allCuidadores.rows);
    }
    catch (error) {
        console.error(error.message);
    }
});

// add review for a caregiver and update users average_review_score
app.post("/caregiver_review", async(req, res) => {
    try {
		const { observation, caregiver_id, customer_id, review_score } = req.body;
		console.log('observation: ', observation);
		console.log('caregiver_id: ', caregiver_id);
		console.log('review_score: ', review_score);

        const caregiver = await pool.query("SELECT * FROM users WHERE type = '1' AND enabled = true AND id = $1", [caregiver_id]);
		if(caregiver.rows[0].id > 0) {
			let query = "INSERT INTO caregiver_score (caregiver_id, customer_id, score, observation, created_at) VALUES($1, $2, $3, $4, $5) RETURNING *";
	
			const created_at = new Date();
			const modified_at = new Date();
	
			const allCuidadores = await pool.query(query, [caregiver_id, customer_id, review_score, observation, created_at ]);
			// console.log(allCuidadores);
			res.json(allCuidadores.rows[0]);
	
			// check that the review has been created (it has an id greater than 0)
			// update users table with newer score average
			if(allCuidadores.rows[0].id > 0){
				const allScores = await pool.query("SELECT * FROM caregiver_score WHERE caregiver_id = $1", [caregiver_id]);
	
				// get new average
				let scores_amount = 0;
				let scores_accumulated = 0;
				let score_average = 0;
	
				if(allScores.rows.length > 0) {
					allScores.rows.forEach( review => {
						console.log("review.score: ", review.score);
						scores_accumulated = scores_accumulated + parseFloat(review.score);
						scores_amount++;
					});
					score_average = scores_accumulated / scores_amount;
					score_average = score_average.toFixed(2);
				} else {
					score_average = review_score;
				}
	
				console.log('scores_accumulated: ', scores_accumulated);
				console.log('scores_amount: ', scores_amount);
				console.log('scores_average: ', score_average);
	
				if(score_average){
					const updateCuidadorScore = await pool.query("UPDATE users SET average_review_score = $1, modified_at = $2 WHERE id = $3 RETURNING *", [score_average, modified_at, caregiver_id]);
				}
			}
		}
    }
    catch (error) {
        console.error(error.message);
    }
});

// get a contract by user id
app.get("/contract", async(req, res) => {
    try {
        const { customer_id } = req.query;
        const contracts = await pool.query("SELECT * from contract WHERE customer_id = $1", [customer_id]);
        res.json(contracts.rows);
    }
    catch (error) {
        console.error(error.message);
    }
});

// create a contract
app.post("/contract", async(req, res) => {
    try {
		const { caregiver_id, customer_id, date, horarios } = req.body;
		console.log('customer_id: ', customer_id);
		console.log('caregiver_id: ', caregiver_id);
		console.log('date: ', date);
		console.log('horarios: ', horarios);
		console.log('horarios.length: ', horarios.length);

        const caregiverQuery = await pool.query("SELECT * FROM users WHERE type = '1' AND enabled = true AND id = $1", [caregiver_id]);
        const clientQuery = await pool.query("SELECT * FROM users WHERE type = '0' AND enabled = true AND id = $1", [customer_id]);
        const created_at = new Date();
        const modified_at = new Date();

        
        
		if(caregiverQuery.rows[0].id > 0 && clientQuery.rows[0].id > 0) {
            
            const caregiver = caregiverQuery.rows[0];
            const client = clientQuery.rows[0];
            // calculate the total amount of the contract using cuidador's rate and the amount of horarios.
            let amount = horarios.length * caregiver.hourly_rate;
    
            console.log('total amount: ', amount);

            // si hay cliente y cuidador, tengo que traer las availabilities del cuidador, removerle aquellas en 'horarios', y volver a guardarlas en la DB.

            const previousAvailabilities = await pool.query("SELECT * FROM caregiver_availability WHERE caregiver_id = $1", [caregiver_id]);

            console.log('caregiver availabilities for date: ', date);
            console.log(previousAvailabilities.rows[0].dates[date]);

            if(previousAvailabilities.rows[0].dates[date].length > 0) {
                let allAvailabilities = previousAvailabilities.rows[0].dates;
                let availabilitiesForDate = previousAvailabilities.rows[0].dates[date];
                let filteredAvailabilities = availabilitiesForDate.filter(time => !horarios.includes(time));

                console.log('filteredAvailabilities: ');
                console.log(filteredAvailabilities);
                allAvailabilities[date] = filteredAvailabilities;

                console.log('allAvailabilities entero y updateado: ');
                console.log(allAvailabilities);

                const newAvailabilities = await pool.query("UPDATE caregiver_availability SET dates = $1 WHERE caregiver_id = $2 RETURNING *", [allAvailabilities, caregiver_id]);
            } else {
                // return error because times for that date are NOT available.
                return res.status(401).json({ error: 'Error: alguno de los horarios no esta disponible para la fecha elegida.' });
            }

            // check that the client does not have an active contract for any of the horarios in the new contract.
            const clientExistingContracts = await pool.query("SELECT * FROM contract WHERE customer_id = $1 AND status = 'active' AND date = $2",
            [customer_id, date]);
            console.log('clientExistingContracts: ');
            console.log(clientExistingContracts.rows);
            if(clientExistingContracts.rows.length > 0) {
                for (let i = 0; i < clientExistingContracts.rows.length; i++) {
                    const contract = clientExistingContracts.rows[i];
                    if (contract.horarios.length > 0){
                        
                        let existingContractHorarios = contract.horarios;
                        console.log("existingContractHorarios:");
                        console.log(existingContractHorarios);
                        console.log("horarios: ");
                        console.log(horarios);
        
                        if (existingContractHorarios.some(time => horarios.includes(time))){
                            // then, the client already has a contract for that date in one or more of the selected times.
                            return res.status(401).json({ error: 'Ya tienes otro contrato existente para ese día en alguno de esos horarios.' });
                        }
                    }
                }
            }


            // create contract now that we have the caregiver availabilities updated, and we've checked that the client does NOT have a contract
            // for any of those times already.

			let query = "INSERT INTO contract (customer_id, caregiver_id, created_at, modified_at, amount, horarios, date, status) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *";

            console.log('horarios json encoded: ');
            console.log(JSON.stringify(horarios));

            let horarios_json = JSON.stringify(horarios);
	
			const newContract = await pool.query(query, [customer_id, caregiver_id, created_at, modified_at, amount, horarios_json, date, 'active' ]);
			// console.log(allCuidadores);
			res.json(newContract.rows[0]);

            console.log(' SUCCESS -------- CREATED NEW CONTRACT!');
	
			// check that the contract has been created (it has an id greater than 0)
			// if(newContract.rows[0].id > 0){
				
			// }
		}
    }
    catch (error) {
        console.error(error.message);
    }
});

// update available dates json for a specific caregiver
app.post("/caregiver_update_available_dates", async (req, res) => {
    try {
		const { dates, caregiver_id } = req.body;
		console.log('dates');
		console.log(dates);

		const previousAvailabilities = await pool.query("SELECT * FROM caregiver_availability WHERE caregiver_id = $1", [caregiver_id]);

		console.log('previousAvailabilities: ');
		// console.log(previousAvailabilities.rows[0]);

		let newAvailabilities;
        
		if(!previousAvailabilities.rows[0]){
			newAvailabilities = await pool.query("INSERT INTO caregiver_availability (dates, caregiver_id) VALUES ($1, $2) RETURNING *", [dates, caregiver_id]);
		}
		else {
			newAvailabilities = await pool.query("UPDATE caregiver_availability SET dates = $1 WHERE caregiver_id = $2 RETURNING *", [dates, caregiver_id]);
		}

		res.json({
			"newAvailabilities": newAvailabilities.rows[0]
		});
    }
    catch (error) {
        console.error(error.message);
    }
});

// get available dates json for a specific caregiver
app.get("/caregiver_get_available_dates", async (req, res) => {
    try {
		const { caregiver_id } = req.query;
		// console.log('dates');
		console.log(req.params);

		const availabilities = await pool.query("SELECT * FROM caregiver_availability WHERE caregiver_id = $1", [caregiver_id]);

		res.json({
			"availabilities": availabilities.rows[0]
		});
    }
    catch (error) {
        console.error(error.message);
    }
});

// get (by id) individual - cuidador
app.get("/cuidadores/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

        res.json(user.rows[0]);
    }
    catch (error) {
        console.error(error.message);
    }
});

// update individual - cuidador
app.put("/cuidadores/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const { description, email, firstname, lastname, userType, enabled, hourlyRate } = req.body;
        const modified_at = new Date();
        const updateUser = await pool.query(
            "UPDATE users SET description = $1, mail = $2, name = $3, last_name = $4, type = $5,  modified_at = $6, enabled = $7, hourly_rate = $8 WHERE id = $9 RETURNING *", 
            [description, email, firstname, lastname, userType, modified_at, enabled, hourlyRate, id]
        );

        if(updateUser.rowCount > 0){
            res.json(updateUser.rows[0]);
            // res.json('asd');
        }
        else {
            res.json('Oops! No user with given ID (' + id + ') has been found.');
        }
    }
    catch (error) {
        console.error(error.message);
    }
});

// delete (by id) individual - cuidador
app.delete("/cuidadores/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const deleteUser = await pool.query(
            "UPDATE users SET enabled = false WHERE id = $1", 
            // "DELETE FROM users WHERE id = $1",
            [id]
        );

        if(deleteUser.rowCount > 0){
            res.json(deleteUser);
        }
        else {
            res.json('Oops! No user with given ID (' + id + ') has been found.');
        }
    }
    catch (error) {
        console.error(error.message);
    }
});

const port = process.env.PORT; 

app.listen(port, () => {
    console.log('server started on port 5000.');
});
