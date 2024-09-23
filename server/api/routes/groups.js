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
        res.send("ur inside groups!");
    } catch (error) {
        console.log("error getting list-groups", error);
    }
});

router.get('/get-all',async(req,res) => {
    try {
        const {rows} = await pool.query(`SELECT * FROM groups`); 

        res.send(200).json({rows});
    } catch (error) {
        res.send(500).json({message : "error occured", error : error}); 
    }
})

router.get('/users/:id', async (req, res) => {
    const {id} = req.params;
    try {

        const getUsers = `SELECT user_id,user_name FROM group_members WHERE group_id = $1`;

        const { rows } = await pool.query(getUsers,[id]);

        const result = rows;

       res.status(200).send(result);

    } catch (error) {
        res.status(500).json({message: 'error getting data', error: error});
    }
});



//get a specific group
router.get('/:id', async (req,res) => {
    const {id} = req.params;
    try {
        const data = await pool.query("SELECT * FROM groups WHERE group_id = $1", [id]); 
        res.status(200).send(data.rows[0]);
    } catch (error) {
       res.sendStatus(500).json({message : "coudnt get group", error : error}); 
    }
});

//create a group
router.post('/', async (req, res) => {
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

router.get('/balances/:id', async  (req,res) =>{
    const {id} = req.params;
    try {
        const getBalances = `SELECT
                                gm.user_id,
                                gm.user_name,
                                COALESCE(SUM(ep.amount), 0) AS total_amount
                            FROM
                                group_members gm
                            LEFT JOIN
                                expense_participants ep ON gm.user_id = ep.user_id
                            LEFT JOIN
                                expenses e ON ep.expense_id = e.expense_id
                            WHERE
                                e.group_id = $1 
                            GROUP BY
                                gm.user_id, gm.user_name
                            ORDER BY
                                gm.user_name;`

        const {rows} = await pool.query(getBalances,[id]);
        res.status(200).send(rows);
    } catch (error) {
        res.status(500).JSON({message: 'theres an error getting balances', error: error});
    }
});

//delete group
router.delete('/:id', async (req,res) => {
    const {id} = req.params;
    try {
       await pool.query("BEGIN"); 
       const deleteGroupQuery = `DELETE FROM GROUPS WHERE group_id = $1`;
       
       await pool.query(deleteGroupQuery,[id]);

       await pool.query("COMMIT");

       res.status(201).json({message: 'group deleted successfully!'})
    } catch (error) {
       await pool.query('ROLLBACK'); 
       res.status(500).json({message: 'error deleting group'});
    }
});

//updating a group 
router.put('/:id', async (req,res) => {
    const {id} = req.params;

    const {group_name,group_currency,group_description} = req.body;

    try {
        
        const updateGroupQuery = ` UPDATE groups SET group_name = $1, group_currency = $2, group_description = $3 WHERE group_id = $4`;

        const result = await pool.query(updateGroupQuery, [group_name,group_currency,group_description,id]);

        if(result.rowCount === 0){
            return res.status(404).json({message : 'Group not found'});
        }

        res.status(200).json({message : "group information updated", group : result.rows[0]});

    } catch (error) {
        console.log('error occured', error);
        res.status(500).json({message : "error updating group", error : error});       
    };
});


module.exports = router;
