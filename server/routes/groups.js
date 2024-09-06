const express = require('express');
const router = express.Router();
const pool = require('../db');


//list all of the groups
router.get('/', async (req, res) => {
    try {
        const data = await pool.query("SELECT * FROM groups");
        res.status(200).send(data.rows);
    } catch (error) {
        console.log("error getting list-groups", error);
    }
});

//get a specific group
router.get('/:id', async (req,res) => {
    const {id} = req.params;
    try {
        const data = await pool.query("SELECT * FROM groups WHERE group_id = $1", [id]); 
        res.status(200).send(data.rows[0]);
    } catch (error) {
       res.sendStatus(500).send(error); 
    }
});

//create a group

router.post('/create-group', async (req, res) => {
    const {name,members} = req.body;
    try {
        await pool.query("BEGIN");
        const insertGroupQuery = `INSERT INTO groups(group_name) VALUES ($1) RETURNING group_id`;
        const { rows } = await pool.query(insertGroupQuery, [name]);
        const group_id = rows[0].group_id;
        const values = members.map((_,index) => `($1, $${index + 2})`).join(', ');
        const params = [group_id, ...members];
        const insertParticipantsQuery = `INSERT INTO group_members (group_id, user_id) VALUES ${values}`;
        await pool.query(insertParticipantsQuery, params);
        await pool.query("COMMIT");
        res.status(201).json({message:"Group created successfully",id:group_id});
        

    } catch (error) {
        await pool.query('ROLLBACK');
        console.log("theres an error!",error);
        res.status(500).send('Error creating group');
        
    }
});


module.exports = router;