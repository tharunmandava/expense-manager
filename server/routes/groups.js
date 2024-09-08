const express = require('express');
const router = express.Router();
const pool = require('../db');
const crypto = require('crypto');

genUUID = () => {
    const buffer = crypto.randomBytes(16);
    const base64 = buffer.toString('base64');
    const urlEncoded = base64
        .replace(/\+/g, '-') 
        .replace(/\//g, '_') 
        .replace(/=+$/, ''); 

    return urlEncoded;
}

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
    const {group_name,group_currency,group_description,members} = req.body;
    const group_id = genUUID();

    if (!group_name || !members || !Array.isArray(members)) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    try {
        await pool.query("BEGIN");

        const insertGroupQuery = `INSERT INTO groups(group_id, group_name, group_currency, group_description) VALUES ($1, $2, $3, $4)`;

        await pool.query(insertGroupQuery, [group_id, group_name, group_currency, group_description]);

        for(const member of members){
            const insertMemberQuery = `INSERT INTO group_members (group_id, user_name) VALUES ($1, $2)`;
            await pool.query(insertMemberQuery, [group_id, member]);
        };

        await pool.query("COMMIT");

        res.status(201).json({ message: "Group created successfully", id: group_id });
        
    } catch (error) {
        await pool.query('ROLLBACK');
        console.log("theres an error!",error);
        res.status(500).send('Error creating group');
    }
});


module.exports = router;