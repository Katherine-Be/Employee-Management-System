
//  create database if it does not exist otherwise connect to it
const pool = require('../config/dbConfig');
const mysql = require('mysql2/promise');
require('dotenv').config();

const db_name =  process.env.DATABASE;

//<----create database---->
async function createDB() {
  try {
    // pool.query(`DROP DATABASE IF EXISTS ${db_name}`);  //  when testing, uncomment this line to drop the database
    // console.log(`Database dropped if it exists`);

    // Create database if it does not exist
    pool.query(`CREATE DATABASE IF NOT EXISTS ${db_name}`);
    console.log(`Database created or already exists`);

    // Create department table
    pool.query(`CREATE TABLE IF NOT EXISTS ${db_name}.department (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(30))`, (err) => {
      if(err) {
        console.log(err)
      }
    });
    console.log(`Department table created or already exists`);

    // Create role table
    pool.query(`CREATE TABLE IF NOT EXISTS ${db_name}.role (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(30), salary DECIMAL, department_id INT, FOREIGN KEY (department_id) REFERENCES department(id))`, (err) => {
      if(err) {
        console.log(err)
      }
    });
    console.log(`Role table created or already exists`);

    // Create employee table
    pool.query(`CREATE TABLE IF NOT EXISTS ${db_name}.employee (id INT AUTO_INCREMENT PRIMARY KEY, first_name VARCHAR(30), last_name VARCHAR(30), role_id INT, manager_id INT, FOREIGN KEY (role_id) REFERENCES role(id), FOREIGN KEY (manager_id) REFERENCES employee(id))`, (err) => {
      if(err) {
        console.log(err)
      }
    });
    console.log(`Employee table created or already exists`);

    
//<----reestablish db connection using the db name since it has now been created---->
      return await new Promise((resolve, reject) => {
        pool.getConnection(function (err, con) {
          if (err instanceof Error) {
            console.log(err);
            return;
          } else {
              console.log('Connected to database');
              con.changeUser({database : db_name}, function(err) {
                if (err) {
                  console.log(err);
                  return;
                } else {
                  console.log('Using database:', db_name);
                  con.release() // release connection
                  resolve()
                }
              })
          }
        })
    })
  } catch (error) {
    console.error(`An error occurred:`, error.message);
  }
}


  module.exports = {createDB};