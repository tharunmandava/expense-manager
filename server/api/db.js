// const Pool = require("pg").Pool;

// const pool = new Pool({
//     user: "rue",
//     password: "123",
//     host: "localhost",
//     port: 5432,
//     database: "test",
// });

// module.exports = pool;

// const Pool = require("pg").Pool;
// require('dotenv').config()

// const pool = new Pool({
//     user: process.env.POSTGRES_USER,
//     password: process.env.POSTGRES_PASSWORD,
//     host: process.env.POSTGRES_HOST,
//     port: 5432,
//     database: process.env.POSTGRES_DATABASE,
// });

// module.exports = pool;


const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  connectionString: "postgres://default:ZV7H4wTbdRPK@ep-snowy-mouse-a1ow1b91-pooler.ap-southeast-1.aws.neon.tech:5432/verceldb?sslmode=require?sslmode=require",
})