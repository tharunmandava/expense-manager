const express = require("express");
const app = express();
const pool = require("./db");
const cors = require('cors')
const corsOptions = {
    origin: true,
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

app.use(express.json())

const expenseRouter = require('./routes/expenses');
app.use('/api/expenses', expenseRouter);

const groupRouter = require('./routes/groups');
app.use('/api/groups', groupRouter);

app.listen(5000,() => {
    console.log("server started!");
});




