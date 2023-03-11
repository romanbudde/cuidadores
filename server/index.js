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
            "INSERT INTO users (description) VALUES($1)", 
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

// get individual - cuidador

app.listen(5000, () => {
    console.log('server started on port 5000.');
});
