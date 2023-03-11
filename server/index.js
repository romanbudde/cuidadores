const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

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
        const { description } = req.body;
        const newCuidador = await pool.query(
            "INSERT INTO users (description) VALUES($1) RETURNING *", 
            [description]
         );

        console.log(req.body);
        // res.json(req.body);
        res.json(newCuidador);
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

// get individual - cuidador
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

app.put("/cuidadores/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const {description} = req.body;
        const updateUser = await pool.query(
            "UPDATE users SET description = $1 WHERE id = $2", 
            [description, id]
        );

        res.json("User was updated successfully.")
    }
    catch (error) {
        console.error(error.message);
    }
});


app.listen(5000, () => {
    console.log('server started on port 5000.');
});
