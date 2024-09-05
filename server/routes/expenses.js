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
        const data = await pool.query("SELECT * FROM expenses");
        res.status(200).send(data.rows);
    } catch (error) {
        console.log("error getting list-expenses", error);
    }
});

router.get('/list-by-user/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const data = await pool.query("SELECT expense_id, amount, expense_date FROM expenses WHERE paid_by = $1", [id]);
        res.status(200).send(data.rows);
    } catch (error) {
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const data = await pool.query("SELECT * FROM expenses WHERE expense_id = $1", [id]);
        const data2 = await pool.query("SELECT ep.expense_id, u.name AS user_name FROM expense_participants ep JOIN users u ON ep.user_id = u.user_id WHERE ep.expense_id = $1;", [id]);
        const user_names = data2.rows.map(row => row.user_name);
        const obj = {
            transaction: data.rows[0],
            participants: user_names     // Array of users
        };
        res.status(200).send(obj);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;