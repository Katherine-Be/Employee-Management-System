const mysql = require('mysql2');
const pool = require('./src/config/dbConfig');
const { createDB } = require('./src/models/dbModel');
const { init } = require('./src/cli');

// Start the application
console.log("Starting the application...");

// function startApp (){
//     createDB();
//     init();
// }

async function startApp() {
    try {
        await createDB();
        init();
    } catch (error) {
        console.error("Error starting the application:", error);
    }
}
startApp();