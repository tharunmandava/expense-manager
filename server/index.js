const express = require("express");
const app = express();
const pool = require("./db");


const cors = require("cors");
const corsOptions = {
    origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));

app.use(express.json())

//routes 

//users
app.get("/api/list-users", async(req,res) =>{
    try {
        const data = await pool.query("SELECT * FROM users");
        res.status(200).send(data.rows);
    } catch (error) {
       console.log("error getting list-users",error); 
    }
});

app.get("/api/user/:id", async(req,res) =>{
    const {id} = req.params;
    try {
       const data = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);
       res.status(200).send(data.rows[0]);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post("/api/create-user", async(req,res) =>{
    try {
        const insert = await pool.query("INSERT INTO users(name) VALUES($1) RETURNING user_id",[req.body.name]);
        res.status(200).send({message:"User created successfully",id:insert.rows[0].user_id}); //returns the id of the user after creation
    } catch (error) {
        console.log(error);        
        res.sendStatus(500);
    }
})

//expenses
app.get("/api/list-expenses", async(req,res) =>{
    try {
       const data = await pool.query("SELECT * FROM expenses"); 
       res.status(200).send(data.rows);
    } catch (error) {
       console.log("error getting list-expenses",error); 
    }
});

//list expenses paid by user
app.get("/api/list-expenses-by-user/:id", async(req,res) =>{
    const {id} = req.params;
    try {
        const data = await pool.query("SELECT expense_id, amount, expense_date FROM expenses WHERE paid_by = $1", [id]);
        res.status(200).send(data.rows);
    } catch (error) {
        
    }
});


//detailed info about an expense
app.get("/api/expense/:id", async(req,res) =>{
    const {id} = req.params;
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

app.post("/api/create-expense", async(req,res) =>{
    const { paid_by, amount } = req.body;
    try {
        const result = await pool.query("INSERT INTO expenses(paid_by,amount) VALUES($1, $2) RETURNING expense_id", [paid_by, amount]);
        res.status(200).send({message:"Expense created successfully",id:result.rows[0].expense_id});
    } catch (error) {
       console.log(error);
       res.sendStatus(500); 
    }
})


app.listen(5000,() => {
    console.log("server started!");
});




