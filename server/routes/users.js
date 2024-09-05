const express = require('express');
const router = express.Router();
const pool = require('../db');
const cors = require('cors');
const corsOptions = {
    origin: ["http://localhost:5173"],
};

router.use(cors(corsOptions));

router.get('/list-all', async (req, res) => {
    try {
        const data = await pool.query("SELECT * FROM users");
        res.status(200).send(data.rows);
    } catch (error) {
        console.log("error getting list-users", error);
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const data = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);
        res.status(200).send(data.rows[0]);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/create', async (req, res) => {
    try {
        const insert = await pool.query("INSERT INTO users(name) VALUES($1) RETURNING user_id", [req.body.name]);
        res.status(200).send({ message: "User created successfully", id: insert.rows[0].user_id }); //returns the id of the user after creation
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

module.exports = router;