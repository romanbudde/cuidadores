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
	res.json(token);


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
    
            // res.json(req.body);
            res.json(newUser.rows[0]);
        }

        // res.json(req.body);
        res.json(userExists.rows[0]);
    }
    catch (error) {
        console.error(error.message);
        res.json('Usuario y/o contraseña incorrectos.')
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
        const { description, email, firstname, lastname, userType, enabled } = req.body;
        const modified_at = new Date();
        const updateUser = await pool.query(
            "UPDATE users SET description = $1, mail = $2, name = $3, last_name = $4, type = $5,  modified_at = $6, enabled = $7 WHERE id = $8 RETURNING *", 
            [description, email, firstname, lastname, userType, modified_at, enabled, id]
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
