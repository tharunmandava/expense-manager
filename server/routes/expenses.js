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
router.get('/by-group/:id', async (req, res) => {
    const { id } = req.params;
    try {
       await pool.query("BEGIN"); 

       const listExpenseQuery = `SELECT e.expense_id,e.title,e.amount,e.expense_date,e.description,gm.user_name AS paid_by,
                                 e.group_id FROM expenses e JOIN group_members gm ON e.paid_by = gm.user_id WHERE e.group_id = $1`;

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
       const participantsQuery = `SELECT user_id,amount FROM expense_participants where expense_id = $1`;

       const {rows : res1} = await pool.query(participantsQuery,[id]);

       const { rows : res2} = await pool.query(expenseQuery,[id]);
       const expense = res2[0];
       const expense_participants = res1;

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
router.post('/', async (req, res) => {
    const { amount,paid_by,group_id,participantAmounts } = req.body;

    try {

        await pool.query("BEGIN");
        const createExpenseQuery =`INSERT INTO expenses(paid_by,amount,group_id) VALUES ($1,$2,$3) RETURNING expense_id`;
        
        const { rows } = await pool.query(createExpenseQuery,[paid_by,amount,group_id])
        const expense_id = rows[0].expense_id;

        for(const user_id in participantAmounts){
            const participantAmount = participantAmounts[user_id];
            
            const insertParticipantQuery = `INSERT INTO expense_participants(expense_id,user_id,amount) VALUES ($1,$2,$3)`;

            await pool.query(insertParticipantQuery,[expense_id,user_id,participantAmount]);
        } 

        await pool.query('COMMIT');
        res.status(201).json({message:"Expense created successfully",id:expense_id});

    } catch (error) {
        await pool.query('ROLLBACK');    
        res.status(500).send('Error creating expense');
    }
});

//updating expense
router.put('/:id', async (req,res) => {
    const {id} = req.params;

    const {title,amount,description, participants} = req.body;

    try {

        await client.query('BEGIN');

        const expenseUpdateQuery = `UPDATE expenses SET title = $1, amount = $2, description = $3 WHERE expense_id = $4 RETURNING *`;
        
        const result = await pool.query(expenseUpdateQuery,[title,amount,description,id]);

        if(result.rowCount === 0){
            await pool.query('ROLLBACK');
            return res.status(404).json({message: "expense not found"});
        }

        if(Array.isArray(participants)){
            const deleteExpenseParticipantsQuery = `DELETE FROM expense_participants WHERE expense_id = $1`; 
            await pool.query(deleteExpenseParticipantsQuery,[id]);
        }

        const newExpenseParticipantsQuery = `INSERT INTO expense_participants (expense_id,user_id,amount) VALUES ($1,$2,$3)`

        const participantQueries = participants.map(participant => 
            pool.query(newExpenseParticipantsQuery,[expense_id,participant.user_id, participant.amount])
        );
        
        await Promise.all(participantQueries);
        res.status(200).json({message:'expense updated successfully', expense : result.rows[0]});

    } catch (error) {
        await pool.query('ROLLBACK');
        res.status(500).json({message: 'error updating expense'});
        
    }
})

module.exports = router;
