const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
const bcrypt = require('bcrypt');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mercadopago = require('mercadopago');
const ngrok = require('ngrok');
const nodemailer = require("nodemailer");

// const { ngrok_url } = require('./new-dev-im-testing.js')
const ngrok_url = process.env.NGROK_URL;
const localtunnel_url = process.env.LOCALTUNNEL_URL;

require('dotenv').config();

const { Client } = require('pg');
const client = new Client();

const passport = require('passport');
const LocalStrategy = require('passport-local');

const flash = require('express-flash');
const session = require('express-session');
const { lt_url } = require('./new-dev-localtunnel');
const { render } = require('ejs');

const MERCADOPAGO_TEST_TOKEN = process.env.MERCADOPAGO_TEST_TOKEN; 
const port = process.env.PORT; 
const ngrok_auth_token = process.env.NGROK_TOKEN; 

// setting GMT -3 Timezone.
process.env.TZ = 'America/Sao_Paulo';

// middleware
app.use(cors({
    origin: "*"
}))
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
    origin: "*"
}))

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: 'smtp.gmail.com',
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: 'cuidadoresproject@gmail.com',
      pass: 'taudydogztjaaxsl'
    }
});

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

// Initialize ngrok (for mercadopago's webhook, which requires a https url, meaning it can't be localhost)

// (async function() {
//     const url = await ngrok.connect({ authtoken: ngrok_auth_token });
//     const api = ngrok.getApi();
    
//     const tunnels = await api.listTunnels();
//     console.log('At index.js, tunnels: ', tunnels);

//     global.ngrok_url = ngrok_url;
//     console.log('At index.js, ngrok url: ', ngrok_url);
// })();

console.log('At index.js, NGROK_URL is: ', ngrok_url);
console.log('At index.js, LT_URL is: ', localtunnel_url);


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
        const { description, password, email, userType, firstname, lastname, dni, telefono, hourly_rate, address } = req.body;
        
        const userEmailExists = await pool.query(
            "SELECT * FROM users WHERE mail = $1",
            [email]
        );

        const userDniExists = await pool.query(
            "SELECT * FROM users WHERE dni = $1",
            [dni]
        );

        console.log('userDniexists: ', userDniExists);
        console.log('userDniexists condition: ', userDniExists.rows > 0);
        console.log('userEmailExists: ', userEmailExists);
        console.log('userEmailExists condition: ', userEmailExists.rows.length > 0);

        if(userDniExists.rows.length > 0) {
            return res.status(401).json({ error: 'Ups, el dni ya está registrado con otro usuario.' });
        } 
        if(userEmailExists.rows.length > 0) {
            return res.status(401).json({ error: 'Ups, el email ya está registrado con otro usuario.' });
        } 

        console.log('---- current date ----');
        const created_at = new Date();
        console.log(created_at);

        console.log(password);
        const hashedPassword = await bcrypt.hash(password, 10);

        let newCuidador;

        if(hourly_rate === '') {
            newCuidador = await pool.query(
                "INSERT INTO users (description, mail, password, type, created_at, enabled, name, last_name, dni, telefono, address) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *", 
                [description, email, hashedPassword, userType, created_at, 1, firstname, lastname, dni, telefono, address]
            );
            
        }
        else {
            newCuidador = await pool.query(
                "INSERT INTO users (description, mail, password, type, created_at, enabled, name, last_name, dni, telefono, address, hourly_rate) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *", 
                [description, email, hashedPassword, userType, created_at, 1, firstname, lastname, dni, telefono, address, hourly_rate]
            );
        }


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
        const { email, password, dni, telefono, firstname, lastname, address} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const created_at = new Date();


        const userEmailExists = await pool.query(
            "SELECT * FROM users WHERE mail = $1",
            [email]
        );

        const userDniExists = await pool.query(
            "SELECT * FROM users WHERE dni = $1",
            [dni]
        );

        if(userDniExists.rows > 0) {
            return res.status(401).json({ error: 'Ups, el dni ya está registrado con otro usuario.' });
        } 
        if(userEmailExists.rows > 0) {
            return res.status(401).json({ error: 'Ups, el email ya está registrado con otro usuario.' });
        } 
        
        const newUser = await pool.query(
            "INSERT INTO users (mail, password, dni, telefono, type, created_at, enabled, name, last_name, address) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *", 
            [email, hashedPassword, dni, telefono, '0', created_at, 1, firstname, lastname, address]
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

// get all - cuidadores
app.get("/fetch-cuidadores", async(req, res) => {
    try {
        console.log('------- at fetch-cuidadores endpoint')
        const allCuidadores = await pool.query("SELECT * from users WHERE type = '1'")
        console.log('------- CUIDADORES: ', allCuidadores)
        res.json(allCuidadores.rows);
    }
    catch (error) {
        console.error(error.message);
    }
});

// get all - cuidadores
app.get("/fetch-clientes", async(req, res) => {
    try {
        console.log('------- at fetch-clientes endpoint')
        const allClientes = await pool.query("SELECT * from users WHERE type = '0'")
        console.log('------- clientes: ', allClientes)
        res.json(allClientes.rows);
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


// get caregiver_reviews for a customer by the customer's id
app.get("/caregiver_review", async(req, res) => {
    try {
        const { customer_id } = req.query;
        const reviews = await pool.query("SELECT * from caregiver_score WHERE customer_id = $1", [customer_id])
        res.json(reviews.rows);
    }
    catch (error) {
        console.error(error.message);
    }
});

// add review for a caregiver and update users average_review_score
app.post("/caregiver_review", async(req, res) => {
    try {
		const { observation, caregiver_id, contract_id, customer_id, review_score } = req.body;
		console.log('observation: ', observation);
		console.log('caregiver_id: ', caregiver_id);
		console.log('contract_id: ', contract_id);
		console.log('review_score: ', review_score);

        const caregiver = await pool.query("SELECT * FROM users WHERE type = '1' AND enabled = true AND id = $1", [caregiver_id]);
		if(caregiver.rows[0].id > 0) {
			let query = "INSERT INTO caregiver_score (caregiver_id, customer_id, contract_id, score, observation, created_at) VALUES($1, $2, $3, $4, $5, $6) RETURNING *";
	
			const created_at = new Date();
			const modified_at = new Date();
	
			const allCuidadores = await pool.query(query, [caregiver_id, customer_id, contract_id, review_score, observation, created_at ]);
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

// get users by different parametres
app.get("/users", async(req, res) => {
    try {
        let { user_email, user_firstname, user_lastname, status, type } = req.query;

        // bring from users table those that have similarities with client email or caregiver email
        let users;

        let query = "SELECT * FROM users";
        // Array to store the conditions
        let conditions = [];
        let values = [];

        // Check if client_email is provided
        if (user_email ) {
            // conditions.push(`( customer_id = ANY($${values.length + 1}) OR caregiver_id = ANY($${values.length + 1}) )`);
            conditions.push(`(mail LIKE '%' || $1 || '%')`);
            values.push(user_email);
        }

        // Check if status is provided
        if (status && status !== 'all') {
            if(status === 'enabled') {
                conditions.push(`(enabled = $${values.length + 1})`);
                values.push(true);
            }
            if(status === 'disabled'){
                conditions.push(`(enabled = $${values.length + 1})`);
                values.push(false);
            }
        }

        // Check if type is provided
        if (type && type !== 'all') {
            conditions.push(`(type = $${values.length + 1})`);
            values.push(type);
        }

        if (user_firstname) {
            // conditions.push(`( customer_id = ANY($${values.length + 1}) OR caregiver_id = ANY($${values.length + 1}) )`);
            conditions.push(`(name LIKE '%' || $${values.length + 1} || '%')`);
            values.push(user_firstname);
        }

        if (user_lastname) {
            // conditions.push(`( customer_id = ANY($${values.length + 1}) OR caregiver_id = ANY($${values.length + 1}) )`);
            conditions.push(`(last_name LIKE '%' || $${values.length + 1} || '%')`);
            values.push(user_lastname);
        }

        // Join the conditions with AND
        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }
        
        console.log('query: ', query);
        console.log('values: ', values);
        users = await pool.query(query, values);
        
        // console.log('contracts: ', contracts.rows);
        
        console.log('user email: ', user_email);
        console.log('user firstname: ', user_firstname);
        console.log('user lastname: ', user_lastname);
        console.log('status: ', status);
        res.json(users.rows);
    }
    catch (error) {
        console.error(error.message);
    }
});

// get a contract by user id
app.get("/contract", async(req, res) => {
    try {
        const { user_id } = req.query;

        let contracts;

        contracts = await pool.query("SELECT * from contract WHERE caregiver_id = $1 OR customer_id = $1", [user_id]);

        console.log('contracts: ', contracts);
        res.json(contracts.rows);
    }
    catch (error) {
        console.error(error.message);
    }
});

// get a contract by user id
app.get("/payment_methods", async(req, res) => {
    try {
        let payment_methods;

        payment_methods = await pool.query("SELECT * from payment_methods");

        console.log('payment_methods: ', payment_methods);
        res.json({
            "payment_methods": payment_methods.rows
        });
    }
    catch (error) {
        console.error(error.message);
    }
});

// get mercadopago config's access token
app.get("/mercadopago_access_token", async(req, res) => {
    try {
        console.log('---------------- MP ACCESS TOKENNNNNNN --------------------')
        let mercadopago_config;

        mercadopago_config = await pool.query("SELECT * from mercadopago_config WHERE config_name = 'access_token'");

        console.log('mercadopago_config: ', mercadopago_config);
        res.json({
            "access_token": mercadopago_config.rows[0].config_value
        });
    }
    catch (error) {
        console.error(error.message);
    }
});

// get mercadopago config's access token
app.put("/mercadopago_access_token", async(req, res) => {
    try {
        console.log('---------------- UPDATE - MP ACCESS TOKENNNNNNN --------------------')
        let mercadopago_config;

        const { access_token } = req.body;

        mercadopago_config = await pool.query("UPDATE mercadopago_config SET config_value = $1  WHERE config_name = 'access_token' RETURNING *", [access_token]);

        console.log('mercadopago_config: ', mercadopago_config);
        res.json({
            "access_token": mercadopago_config.rows[0].config_value
        });
    }
    catch (error) {
        console.error(error.message);
    }
});

// get contracts by different parametres
app.get("/contracts", async(req, res) => {
    try {
        let { client_email, caregiver_email, start_date, end_date, status } = req.query;

        // bring from users table those that have similarities with client email or caregiver email
        let users;
		// users = await pool.query("SELECT * FROM users WHERE mail LIKE $1 OR mail LIKE $2", [client_email, caregiver_email]);

        if(client_email === '' && caregiver_email === '') {
            users = await pool.query
                ("SELECT * FROM users WHERE (type = '0' OR 'type' = '1')"
            );
        }

        if(client_email !== '' && caregiver_email !== '') {
            users = await pool.query
                ("SELECT * FROM users WHERE (mail LIKE '%' || $1 || '%' OR mail LIKE '%' || $2 || '%') AND (type = '0' OR 'type' = '1')", 
                [client_email, caregiver_email]
            );
        }
        else {
            if(client_email !== '') {
                users = await pool.query
                    ("SELECT * FROM users WHERE (mail LIKE '%' || $1 || '%') AND (type = '0')", 
                    [client_email]
                );
            }
            if(caregiver_email !== ''){
                users = await pool.query
                    ("SELECT * FROM users WHERE (mail LIKE '%' || $1 || '%') AND (type = '1')", 
                    [caregiver_email]
                );
            }
        }


        // console.log('client_email:', client_email.trim());
        console.log('caregiver email:', caregiver_email);
        console.log('matching users: ');
        console.log(users.rows);

        // res.json(users.rows);

        let userIdsArray = users.rows.map(user => user.id);

        let contracts;

        let query = "SELECT * FROM contract";
        // Array to store the conditions
        let conditions = [];
        let values = [];

        // Check if client_email is provided
        if (client_email || caregiver_email) {
            conditions.push(`( customer_id = ANY($${values.length + 1}) OR caregiver_id = ANY($${values.length + 1}) )`);
            values.push(userIdsArray);
        }

        // Check if start_date is provided
        if (start_date) {
            // conditions.push(`(date >= $${values.length + 1})`);
            conditions.push(`( TO_DATE(date, 'DD/MM/YYYY') >= TO_DATE($${values.length + 1}, 'DD/MM/YYYY') )`);
            values.push(start_date);
        }

        // Check if end_date is provided
        if (end_date) {
            conditions.push(`( TO_DATE(date, 'DD/MM/YYYY') <= TO_DATE($${values.length + 1}, 'DD/MM/YYYY') )`);
            values.push(end_date);
        }

        // Check if status is provided
        if (status && status !== 'all') {
            conditions.push(`(status = $${values.length + 1})`);
            values.push(status);
        }

        // Join the conditions with AND
        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }
        
        console.log('query: ', query);
        console.log('values: ', values);
        contracts = await pool.query(query, values);
        
        // console.log('contracts: ', contracts.rows);
        
        console.log('client email: ', client_email);
        console.log('caregiver email: ', caregiver_email);
        console.log('startDate: ', start_date);
        console.log('endDate: ', end_date);
        res.json(contracts.rows);
    }
    catch (error) {
        console.error(error.message);
    }
});

// update a contract by its id
app.put("/contract/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const { status } = req.body;
        const modified_at = new Date();
        const update_contract = await pool.query(
            "UPDATE contract SET status = $1 WHERE id = $2 RETURNING *", 
            [status, id]
        );

        if(update_contract.rowCount > 0){
            res.status(200).json(update_contract.rows[0]);
        }
        else {
            res.json('Oops! No contract with given ID (' + id + ') has been found.');
        }
    }
    catch (error) {
        console.error(error.message);
    }
});

app.post("/contract_creation_email", async (req, res) => {
    console.log('------------------------------- SENDING CONTRACT CREATION EMAIL')
    
    const { cuidador, cliente, contract, horarios } = req.body;

    console.log('cuidador: ', cuidador);
    console.log('cliente: ', cliente);
    console.log('contract: ', contract);
    console.log('horarios: ', horarios);

    email_html = `
        <div style="text-align: center;">
            <h3>Hola! Tienes un nuevo contrato para el día ${contract.date}.</h1>
        </div>
        <p><strong>Número de contrato: </strong>${contract.id} </p>
        <p><strong>Email del cuidador: </strong>${cuidador.mail} </p>
        <p><strong>Nombre del cuidador: </strong>${cuidador.name} ${cuidador.last_name}</p>
        <p><strong>Dni del cuidador: </strong>${cuidador.dni}</p>
        <p><strong>Email del cliente: </strong>${cliente.mail} </p>
        <p><strong>Nombre del cliente: </strong>${cliente.name} ${cliente.last_name}</p>
        <p><strong>Dni del cliente: </strong>${cliente.dni}</p>
        <p><strong>Horarios: </strong>${horarios}</p>
        <p><strong>Método de pago: </strong>${contract.payment_method_id === 1 ? 'Mercado Pago' : 'Efectivo'}</p>
        <p><strong>Monto total del contrato: </strong>$${contract.amount}</p>
    `;

    const mailOptions = {
        from: 'cuidadoresproject@gmail.com', // Replace with your email address
        to: `${cuidador.mail}, ${cliente.mail}, roman_budde@hotmail.com`, // Replace with the recipient's email address
        subject: `Cuidadores - Nuevo contrato día ${contract.date}, Nº ${contract.id}`, // Replace with the email subject
        html: email_html, // Replace with your HTML content
    };
    const email_sent = await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });

    console.log('Email sent: ', email_sent);
    return res.json({
        "email_sent": email_sent
    })
});

// listening for mercadopagos webhook
app.post("/webhook", async (req, res) => {
    console.log('----------------------------------------------------------------------------------------------------------------')
    console.log('----------------------------------------------------------------------------------------------------------------')
    console.log('----------------------------------------------------------------------------------------------------------------')
    console.log('----------------------------------------------------------------------------------------------------------------')
    console.log('at /webhook start.')
    
    const payment = req.query;
    console.log(req.query);

    if (payment.type === "payment") {

        const data = await mercadopago.payment.findById(payment["data.id"]);
        console.log('payment[data.id]: ', data);
        // I can store in the DB whatever data in need from this payment data.
        const payment_data = data.body;
        const contract = await pool.query('SELECT * FROM contract WHERE id = $1', [ payment_data.external_reference ]);
        const contract_data = contract.rows[0];

        if(payment_data.status === 'approved'){
            console.log('El pago ha sido aprobado con exito!');

            // set contract status to active
            const update_contract_status = await pool.query(
                "UPDATE contract SET status = $1 WHERE id = $2 RETURNING *", 
                ['active', payment_data.external_reference]
            );

            // Remove availabilities from caregiver_availability table
            const previousAvailabilities = await pool.query("SELECT * FROM caregiver_availability WHERE caregiver_id = $1", [contract_data.caregiver_id]);
    
            console.log('caregiver availabilities for date: ', contract_data.date);
            console.log(previousAvailabilities.rows[0].dates[contract_data.date]);

            if(previousAvailabilities.rows[0].dates[contract_data.date].length > 0) {
                let allAvailabilities = previousAvailabilities.rows[0].dates;
                let availabilitiesForDate = previousAvailabilities.rows[0].dates[contract_data.date];
                let filteredAvailabilities = availabilitiesForDate.filter(time => !contract_data.horarios.includes(time));

                console.log('filteredAvailabilities: ');
                console.log(filteredAvailabilities);
                allAvailabilities[contract_data.date] = filteredAvailabilities;

                console.log('allAvailabilities entero y updateado: ');
                console.log(allAvailabilities);

                const newAvailabilities = await pool.query("UPDATE caregiver_availability SET dates = $1 WHERE caregiver_id = $2 RETURNING *", [allAvailabilities, contract_data.caregiver_id]);
            } else {
                // return error because times for that date are NOT available.
                return res.status(401).json({ error: 'Error: alguno de los horarios no esta disponible para la fecha elegida.' });
            }
        }
        if(payment_data.status === 'rejected'){
            console.log('El pago ha sido rechazado por algun motivo.');

            // set contract status to cancelled
            const update_contract_status = await pool.query(
                "UPDATE contract SET status = $1 WHERE id = $2 RETURNING *", 
                ['cancelled', payment_data.external_reference]
            );
            
            // si el pago es rechazado, tengo que liberar las horas del caregiver.

            // get contract by payment_data.external_reference.
            
            console.log('--------------- contract_data corresponding to the payment: ', contract_data);
            
            
            // basing off of the fetched contract's date and time, add it back to caregiver availability
            //     const previousAvailabilities = await pool.query("SELECT * FROM caregiver_availability WHERE caregiver_id = $1", [contract_data.caregiver_id]);
            //     console.log('------------ horarios VIEJOS para el dia del contrato: ',  previousAvailabilities.rows[0].dates[contract_data.date]);
                
            //     // add the times to the end of the array, then sort the entire array (it sorts it cronologically).
            //     let allAvailabilities = previousAvailabilities.rows[0].dates;
            //     let availabilitiesForDate = previousAvailabilities.rows[0].dates[contract_data.date];
            //     availabilitiesForDate = availabilitiesForDate.concat(contract_data.horarios).sort();
            //     console.log('---- horarios del contrato: ', contract_data.horarios);

            //     console.log('availabilitiesForDate (updated): ');
            //     console.log(availabilitiesForDate);
            //     allAvailabilities[contract_data.date] = availabilitiesForDate;

            //     console.log('allAvailabilities entero y updateado: ');
            //     console.log(allAvailabilities);
        
            //     // update caregiver availabilities
            //     const newAvailabilities = await pool.query("UPDATE caregiver_availability SET dates = $1 WHERE caregiver_id = $2 RETURNING *", [allAvailabilities, contract_data.caregiver_id]);
        
            //     console.log('------ nuevas availabilities updateadas: ', newAvailabilities.rows[0]);
        }

        const update_contract = await pool.query(
            "UPDATE contract SET payment_status = $1 WHERE id = $2 RETURNING *", 
            [payment_data.status, payment_data.external_reference]
        );
        
        if(update_contract.rowCount > 0){
            res.status(200).json(update_contract.rows[0]);
        }
    }
})

// mercado pago initializing payment

app.post("/create-contract", async(req, res) => {
    try{
        // console.log('ngrok url at create-contract: ', ngrok_url);
        // const ngrok_url = await ngrok.connect({
        //     proto: 'http',
        //     addr: port
        // });
        console.log('ngrok url at create-contract endpoint asd: ', ngrok_url);
        console.log('ngrok url at create-contract endpoint + /webhook: ', ngrok_url + '/webhook');
        console.log('localtunnel url at create-contract endpoint asd: ', localtunnel_url);
        console.log('localtunnel url at create-contract endpoint + /webhook: ', localtunnel_url + '/webhook');

        const { title, unit_price, quantity, external_reference } = req.body;

        mercadopago_config = await pool.query("SELECT * FROM mercadopago_config  WHERE config_name = 'access_token'");

        console.log('---------- MP Config: ', mercadopago_config);

        let mp_access_token = '';
        if(mercadopago_config.rows[0].id > 0) {
            mp_access_token = mercadopago_config.rows[0].config_value;
        }

        mercadopago.configure({
            // cuenta testing - vendedor
            access_token: mp_access_token
        });
    
        const result = await mercadopago.preferences.create({
            items: [
                { 
                    title: "Contrato-0001111",
                    unit_price: unit_price,
                    currency_id: "ARS",
                    quantity: 1
                },
            ],
            auto_return: "all",
            external_reference: external_reference.toString(),
            back_urls: {
                success: "https://charming-genie-43c782.netlify.app/success",
                failure: "https://charming-genie-43c782.netlify.app/failure",
                pending: "https://charming-genie-43c782.netlify.app/pending"
            },
            // expires: false, 
            // external_reference: "MPNew_0002",
            notification_url:  "https://cuidadores-server.onrender.com" + "/webhook"
        });

        console.log('result: ', result);
        res.status(200).json(result)
    }
    catch(error){
        console.log('error: ', error);
    }
});

// create a contract
app.post("/contract", async(req, res) => {
    try {
		const { caregiver_id, customer_id, date, horarios, payment_method } = req.body;
		console.log('customer_id: ', customer_id);
		console.log('caregiver_id: ', caregiver_id);
		console.log('date: ', date);
		console.log('horarios: ', horarios);
		console.log('horarios.length: ', horarios.length);
		// console.log('------------- payment_method: ', payment_method);

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
            // update: si el metodo de pago es MP, las availabilities no las updateo ahora, sino que lo updateo en la respuesta del webhook
            if(payment_method !== 1) {
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

			let query = "INSERT INTO contract (customer_id, caregiver_id, created_at, modified_at, amount, horarios, date, status, payment_method_id, payment_status) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";

            let status = '';
            // if payment is via mercado pago, we do not set the contract as active right away, but rather wait for mercadopago's response
            if(payment_method === 1){
                status = 'inactive';
            }
            if(payment_method === 2){
                status = 'active';
            }

            console.log('horarios json encoded: ');
            console.log(JSON.stringify(horarios));

            let horarios_json = JSON.stringify(horarios);
	
			const newContract = await pool.query(query, [customer_id, caregiver_id, created_at, modified_at, amount, horarios_json, date, status, payment_method, 'pending' ]);
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

// caregiver: "delete" a single time (half hour period) from a caregiver's availability on a certain day. 
app.post("/caregiver_delete_single_time", async (req, res) => {
    try {
		const { date, timeToDelete, caregiver_id } = req.body;
		console.log('date');
		console.log(date);
		console.log('time');
		console.log(timeToDelete);

		const previousAvailabilities = await pool.query("SELECT * FROM caregiver_availability WHERE caregiver_id = $1", [caregiver_id]);

		console.log('previousAvailabilities: ');
		console.log(previousAvailabilities.rows[0]);

        // check that the caregiver does not have an active contract at the time being deleted.
        const caregiverExistingContracts = await pool.query("SELECT * FROM contract WHERE caregiver_id = $1 AND status = 'active' AND date = $2",
        [caregiver_id, date]);
        console.log('caregiverExistingContracts: ');
        console.log(caregiverExistingContracts.rows);
        if(caregiverExistingContracts.rows.length > 0) {
            for (let i = 0; i < caregiverExistingContracts.rows.length; i++) {
                const contract = caregiverExistingContracts.rows[i];
                if (contract.horarios.length > 0){
                    
                    let existingContractHorarios = contract.horarios;
                    console.log("existingContractHorarios:");
                    console.log(existingContractHorarios);
    
                    if (existingContractHorarios.some(time => time === timeToDelete)){
                        // then, the client already has a contract for that date in one or more of the selected times.
                        return res.status(401).json({ error: 'Error al eliminar disponibilidad: existe un contrato activo para ese horario.' });
                    }
                }
            }
        }

        console.log('previous availabilities en el dia a eliminar el time: ', previousAvailabilities.rows[0].dates[date]);

        let newAvailabilities = previousAvailabilities.rows[0].dates;
        newAvailabilities[date] = newAvailabilities[date].filter(time => time !== timeToDelete);
        console.log("availabilities filtradas sin el horario a eliminar: ", newAvailabilities[date]);

		newAvailabilitiesResponse = await pool.query("UPDATE caregiver_availability SET dates = $1 WHERE caregiver_id = $2 RETURNING *", [newAvailabilities, caregiver_id]);

		res.status(200).json({
			"newAvailabilities": newAvailabilitiesResponse.rows[0]
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
        const { description, email, firstname, lastname, dni, telefono, userType, enabled, hourlyRate, address } = req.body;
        const modified_at = new Date();
        const updateUser = await pool.query(
            "UPDATE users SET description = $1, mail = $2, name = $3, last_name = $4, dni = $5, telefono = $6, type = $7,  modified_at = $8, enabled = $9, hourly_rate = $10, address = $11 WHERE id = $12 RETURNING *", 
            [description, email, firstname, lastname, dni, telefono, userType, modified_at, enabled, hourlyRate, address, id]
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

app.listen(port, () => {
    console.log('server started on port: ', port);
    // startNgrokTunnel();
});

// const startNgrokTunnel = async () => {
//     try {
//         console.log('At beginning of startNgrokTunnel');
//         ngrok.authtoken(ngrok_auth_token);
//         await ngrok.kill();
//         await ngrok.disconnect();
//         console.log('After ngrok.kill()');

        
//         const url = await ngrok.connect({
//             addr: port,
//             authtoken: ngrok_auth_token,
//             proto: "http"
//         });
//         console.log('new url: ', url);

        
//         // const url = await ngrok.connect({ authtoken: ngrok_auth_token });
//         // const api = ngrok.getApi();
//         // const tunnels = await api.listTunnels();
//         // console.log('tunnels after deleting existing tunnel: ', tunnels);
        
        
//         // if (tunnels.tunnels.length > 0) {
//         //     // There is already an active ngrok tunnel
//         //     const tunnel = tunnels.tunnels[0];
//         //     console.log(`Existing ngrok tunnel found: ${tunnel.public_url}`);
//         //     console.log("Open the ngrok dashboard at: https://localhost:4040\n");
            
//         //     await api.stopTunnel(tunnel.name);
//         //     const tunnels_updated = await api.listTunnels();
//         //     console.log('tunnels after deleting existing tunnel: ', tunnels_updated);

//         //     const url = await ngrok.connect({
//         //         addr: port,
//         //         authtoken: ngrok_auth_token,
//         //         proto: "http"
//         //     });
//         //     console.log(`Ngrok tunnel created: ${url}`);
//         //     global.ngrok_url = url;
//         // }

//     } catch (error) {
//         console.error('Error creating ngrok tunnel:', error);
//         process.exit(1);
//     }
// }