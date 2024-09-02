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

//get list from users
app.get("/listusers", async(req,res) =>{
    try {
        const data = await pool.query("SELECT * FROM users");
        res.status(200).send(data.rows);
    } catch (error) {
       console.log("error getting list-users",error); 
    }
});

//insert into table users
app.post("/createuser", async(req,res) =>{
    try {
        await pool.query("INSERT INTO users(name) VALUES($1)",[req.body.name]);
        res.status(200).send({message:"user created"});
   
    } catch (error) {
        console.log(error);        
        res.sendStatus(500);
    }
})

//list expenses
app.get("/listexpenses", async(req,res) =>{
    try {
       const data = await pool.query("SELECT * FROM expenses"); 
       res.status(200).send(data.rows);
    } catch (error) {
       console.log("error getting list-expenses",error); 
    }
})

app.post("/createexpense", async(req,res) =>{
    try {
        
    } catch (error) {
        
    }
})
    


app.listen(5000,() => {
    console.log("server started!");
});



