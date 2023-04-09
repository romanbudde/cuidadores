const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
require('dotenv').config()

const { Client } = require('pg');
const client = new Client();
// await client.connect();


// middleware
app.use(cors());
app.use(express.json());

// Routes
// create - un cuidador
app.post('/cuidadores', async(req, res) => {
    try {
        console.log('---- backend ----');
        console.log(req.body);
        const { description, email, userType } = req.body;
        // const { email } = req.body.email;
        // const { userType } = req.body.userType;
        const newCuidador = await pool.query(
            "INSERT INTO users (description, mail, type) VALUES($1, $2, $3) RETURNING *", 
            [description, email, userType]
        );

        // res.json(req.body);
        res.json(newCuidador.rows[0]);
    }
    catch (error) {
        console.error(error.message);
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
        const {description} = req.body;
        const updateUser = await pool.query(
            "UPDATE users SET description = $1 WHERE id = $2", 
            [description, id]
        );

        if(updateUser.rowCount > 0){
            res.json(updateUser);
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
            "DELETE FROM users WHERE id = $1",
            [id]
        );

        if(deleteUser.rowCount > 0){
            res.json('User with ID ' + id + ' has been deleted successfully.');
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
