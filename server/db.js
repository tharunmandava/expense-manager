const Pool = require("pg").Pool;

const pool = new Pool({
    user: "rue",
    password: "123",
    host: "localhost",
    port: 5432,
    database: "test",
});

module.exports = pool;