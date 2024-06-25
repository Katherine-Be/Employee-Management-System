
//  create database if it does not exist otherwise connect to it
const pool = require('../config/dbConfig');
const mysql = require('mysql2/promise');


async function createDB() {
  try {
    // Create database if it does not exist
    pool.query("CREATE DATABASE IF NOT EXISTS ems_db");
    console.log("Database created or already exists");

    // Create department table
    pool.query("CREATE TABLE IF NOT EXISTS department (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(30))");
    console.log("Department table created or already exists");

    // Create role table
    pool.query("CREATE TABLE IF NOT EXISTS role (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(30), salary DECIMAL, department_id INT, FOREIGN KEY (department_id) REFERENCES department(id))");
    console.log("Role table created or already exists");

  } catch (error) {
    console.error("An error occurred:", error.message);
  }
}


  module.exports = {createDB};