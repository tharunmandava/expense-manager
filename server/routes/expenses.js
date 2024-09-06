const express = require('express');
const router = express.Router();
const pool = require('../db');

//list all of the expenses
router.get('/', async (req, res) => {
    try {
        const data = await pool.query("SELECT * FROM expenses");
        res.status(200).send(data.rows);
    } catch (error) {
        console.log("error getting list-expenses", error);
    }
});

//list all of the expenses paid by a user
router.get('/list-by-user/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const data = await pool.query("SELECT expense_id, amount, expense_date FROM expenses WHERE paid_by = $1", [id]);
        res.status(200).send(data.rows);
    } catch (error) {
    }
});

//get a specific expense
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const data = await pool.query("SELECT * FROM expenses WHERE expense_id = $1", [id]);
        const data2 = await pool.query("SELECT ep.expense_id, u.name AS user_name FROM expense_participants ep JOIN users u ON ep.user_id = u.user_id WHERE ep.expense_id = $1;", [id]);
        const user_names = data2.rows.map(row => row.user_name);
        const obj = {
            transaction: data.rows[0],
            participants: user_names     
        };
        res.status(200).send(obj);
    } catch (error) {
        res.status(500).send(error);
    }
});

//create an expense
router.post('/create-expense', async (req, res) => {
    const {amount,paid_by,group_id,participants} = req.body;
    try {
        await pool.query("BEGIN");

        const insertExpenseQuery = `INSERT INTO expenses(amount, paid_by, group_id) VALUES ($1, $2, $3) RETURNING expense_id`;
        const { rows } = await pool.query(insertExpenseQuery, [amount, paid_by, group_id]);
        const expense_id = rows[0].expense_id;
    
        const values = participants.map((_, index) => `($1, $${index + 2})`).join(', ');
        const params = [expense_id, ...participants]; 
    
        const insertParticipantsQuery = `INSERT INTO expense_participants (expense_id, user_id) VALUES ${values}`;
    
        await pool.query(insertParticipantsQuery, params);
    
        await pool.query("COMMIT"); 

       res.status(201).json({message:"Expense created successfully",id:expense_id});

    } catch (error) {
        await pool.query('ROLLBACK');    
        console.log("theres an error!",error);
        res.status(500).send('Error creating expense');
    }
});


module.exports = router;