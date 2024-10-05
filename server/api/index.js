require('dotenv').config()

const express = require("express");
const app = express();
const pool = require("./db");
const cors = require('cors')
const corsOptions = {
    origin: "process.env.CORS_ORIGIN",
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

app.use(express.json())

app.get('/', (req,res) => res.send("Express on Vercel"));

const expenseRouter = require('./routes/expenses');
app.use('/api/expenses', expenseRouter);

const groupRouter = require('./routes/groups');
app.use('/api/groups', groupRouter);

app.listen(process.env.PORT,() => {
    console.log("server started!");
});


//error handling

app.use((err,req,res,next) => {
    console.log(err.stack);
    res.status(500).send("someting broke :/");
})

module.exports = app;




