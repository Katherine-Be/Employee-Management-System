const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.LOCALHOST,
    user: process.env.USER_NAME,
    password: process.env.PASSWORD,
    // database: process.env.DATABASE,
    waitForConnections: true, 
    connectionLimit: 10,
    queueLimit: 3
});

module.exports = pool;

// con.connect(err => {
//     if (err) {
//         console.error('Error connecting to the database:', err);
//         // Optionally: retry connection, exit process, etc.
//         // Example: process.exit(1);
//     } else {
//         console.log("Connected to the database at config!");
//     }
// });




// const con = mysql.createPool({
//     host: process.env.LOCALHOST,
//     user: process.env.USER_NAME,
//     password: process.env.PASSWORD,
//     database: process.env.DATABASE
// });


// // pool.getConnection(function (err, con) {
// //     if (err instanceof Error) {
// //       console.log(err);
// //       return;
// //     } else {
// //         console.log('Connected to database');
// //     }
// //     // connection.release();
// // });
// module.exports = con;

// const mysql = require('mysql2');

// const con = mysql.createConnection({
//     host: process.env.LOCAL_HOST,
//     user: process.env.USER_NAME,
//     password: process.env.PASSWORD,
//     database: process.env.DATABASE
// });

// con.connect(err => {
//     if (err) {
//         console.error('Error connecting to the database:', err);
//         // Optionally: retry connection, exit process, etc.
//         // Example: process.exit(1);
//     } else {
//         console.log("Connected to the database!");
//     }
// });