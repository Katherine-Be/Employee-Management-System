var mysql = require('mysql');

var con = mysql.createConnection({
    host: process.env.LOCALHOST,
    user: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

//  create database if it does not exist otherwise connect to it


//  Create department table
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected for department table!");
    var sql = "CREATE TABLE department (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(30))";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Department table created");
    });
  });

//  Create role table
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected for role table!");
    var sql = "CREATE TABLE role (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(30), salary DECIMAL, department_id INT, FOREIGN KEY (department_id) REFERENCES department(id))";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Department table created");
    });
  });

//  Create employee table
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected for employee table!");
    var sql = "CREATE TABLE employee (id INT AUTO_INCREMENT PRIMARY KEY, first name VARCHAR(30), last name VARCHAR (30), role_id INT, manager_id INT, FOREIGN KEY (role_id) REFERENCES role(id)";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Department table created");
    });
  });