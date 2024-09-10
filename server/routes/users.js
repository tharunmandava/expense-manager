const express = require('express');
const router = express.Router();
const pool = require('../db');



router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);
        const result = rows[0];
        res.status(200).send(rows);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;