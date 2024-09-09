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

//list all of the expenses from a group
router.get('/list-by-group/:id', async (req, res) => {
    const { id } = req.params;
    try {
       await pool.query("BEGIN"); 

       const listExpenseQuery = `SELECT * FROM expenses WHERE group_id = $1`;

       const {rows} = await pool.query(listExpenseQuery,[id]);

       res.status(200).json(rows);

    } catch (error) {
       res.status(500).json({message: 'error getting expenses', error: error});
    }
    
});

//get a specific expense
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
       await pool.query("BEGIN"); 

       const expenseQuery = `SELECT * FROM expenses WHERE expense_id = $1`;
       const participantsQuery = `SELECT * FROM expense_participants where expense_id = $1`;

       const {rows : res1} = await pool.query(participantsQuery,[id]);

       const { rows : res2} = await pool.query(expenseQuery,[id]);
       const expense = res2[0];
       expense_participants = res1[0];

       res.status(200).send({expense,expense_participants});


    } catch (error) {
       res.status(500).json({message: 'error getting expense', error: error});
    }
    
});

//deleting an expense
router.delete('/:id', async (req,res) => {
    const { id } = req.params;
    try {
        await pool.query("BEGIN");

        const deleteParticipantsQuery = "DELETE FROM expense_participants WHERE expense_id = $1";

        await pool.query(deleteParticipantsQuery, [id]);
        
        const result = await pool.query("DELETE FROM expenses WHERE expense_id = $1",[id]);

        if(result.rowCount === 0){
            await pool.query("ROLLBACK");
            return res.status(404).json({error : 'expense not found'});
        }

        await pool.query("COMMIT");

        res.status(200).json({message:"expense deleted successfully"});
    } catch (error) {
       res.status(500).json({error: 'Failed to delete expense'}); 
    }
})

//create an expense
router.post('/create', async (req, res) => {
    const {amount,paid_by,group_id,participants} = req.body;

    if (typeof amount !== 'number' || typeof paid_by !== 'number' || typeof group_id !== 'string' || !Array.isArray(participants)){
        return res.status(400).json({error : 'invalid input!'});
    }

    try {

        await pool.query("BEGIN");
        const createExpenseQuery =`INSERT INTO expenses(paid_by,amount,group_id) VALUES ($1,$2,$3) RETURNING expense_id`;
        
        const { rows } = await pool.query(createExpenseQuery,[paid_by,amount,group_id])
        const expense_id = rows[0].expense_id;

        for(let i = 0; i < participants.length;i++){
            const participant = participants[i]; 
            const inserParticipantQuery = `INSERT INTO expense_participants(expense_id,user_id) VALUES ($1,$2)`;

            await pool.query(inserParticipantQuery,[expense_id,participant]);
        };

        await pool.query('COMMIT');
        res.status(201).json({message:"Expense created successfully",id:expense_id});

    } catch (error) {
        await pool.query('ROLLBACK');    
        res.status(500).send('Error creating expense');
    }
});


module.exports = router;