const mysql = require('mysql2');
require('dotenv').config();

//  create pool connection
const pool = mysql.createPool({
    host: process.env.LOCALHOST,
    user: process.env.USER_NAME,
    password: process.env.PASSWORD,
    // database: process.env.DATABASE, // do not include db name since db is has not been created yet.
    waitForConnections: true, 
    connectionLimit: 10,
    queueLimit: 3
});

module.exports = pool;

