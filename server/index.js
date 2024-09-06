const express = require("express");
const app = express();
const pool = require("./db");
const cors = require('cors')
const corsOptions = {
    origin: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));




app.use(express.json())

//routes 

//groups

app.get("/api/list-groups", async (req,res)=>{
    try {
       const groups = await pool.query("SELECT * FROM groups"); 
       res.status(200).send(groups.rows);
    } catch (error) {
      res.sendStatus(500).send(error);  
    }
});

app.get("/api/list-group-members/:id", async(req,res) =>{
    const {id} = req.params;
    try {
       const groupMembers = await pool.query("SELECT u.name FROM group_members gm JOIN users u on gm.user_id = u.user_id WHERE gm.group_id = $1",[id]); 
       res.status(200).send(groupMembers.rows);
    } catch (error) {
        res.sendStatus(500).send(error);
    }
});

app.post("/api/create-group", async(req,res) =>{
    const {name} = req.body;
    try {
       const createGroup = await pool.query("INSERT INTO GROUPS(group_name) VALUES($1)",[name]);
       res.status(200).send({message:"Group created successfully",id:createGroup.rows[0].group_id});
    } catch (error) {
        res.sendStatus(500).send(error);
    }
});

const expenseRouter = require('./routes/expenses');
app.use('/api/expenses', expenseRouter);

const userRouter = require('./routes/users');
app.use('/api/users', userRouter);

const groupRouter = require('./routes/groups');
app.use('/api/groups', groupRouter);

app.listen(5000,() => {
    console.log("server started!");
});




