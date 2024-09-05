const express = require('express');
const router = express.Router();
const pool = require('../db');
const cors = require('cors');
const corsOptions = {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
};

router.use(cors(corsOptions));

router.get('/list-all', async (req, res) => {
    try {
        const data = await pool.query("SELECT * FROM groups");
        res.status(200).send(data.rows);
    } catch (error) {
        console.log("error getting list-groups", error);
    }
});

router.get('/:id', async (req,res) => {
    const {id} = req.params;
    try {
        const data = await pool.query("SELECT * FROM groups WHERE group_id = $1", id); 
        res.status(200).send(data.rows[0]);
    } catch (error) {
       res.sendStatus(500).send(error); 
    }
});

module.exports = router;