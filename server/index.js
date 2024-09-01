const express = require("express");
const app = express();
const pool = require("./db");


const cors = require("cors");
const corsOptions = {
    origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));


app.get("/api", async(req,res) =>{
    try {
        const list = await pool.query("SELECT * FROM users");
        res.json(list.rows);
    } catch (error) {
       console.log("error getting list",error); 
    }
});

app.listen(5000,() => {
    console.log("server started!");
});



