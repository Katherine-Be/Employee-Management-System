const inquirer = require('inquirer');
const pool = require('./config/dbConfig');
const mysql = require('mysql2');
var userAction = "";
require ("console.table");
require('dotenv').config();

const db_name =  process.env.DATABASE;

//<---- return to menu prompt ---->
function returnToMenu () {
    inquirer.prompt([
        {
            type: 'list',
            message: "Return to main menu?",
            choices: [
                'Yes',
                'No'],
            name: 'returnResponse'
        }
    ])    
    .then((answer) => {
        if (answer.returnResponse === "Yes") {
            init();
        } else {
            console.log("Goodbye");
            process.exit(1);
        }
    })
};

//<---- start app and initial menu prompts ---->
function init() {
    userAction = inquirer.prompt([
        // prompt format:
        // {
        // allowed user input type,
        // question/prompt displayed in console for user, 
        // object name to reference user's answer
        // },
        {
            type: 'rawlist',
            message: "What do you want to do?",
            choices: [
                'view departments',
                'view roles',
                'view employees',
                new inquirer.Separator('-- or add a(n):'),
                'add department',
                'add role',
                'add employee',
                new inquirer.Separator('-- or update an:'),
                'update employee',
                'exit'
                ],
            pageSize: 10,
            name: 'userAction'            
        }
    ])
    .then((answer) => {
        console.log("prompt answered")
        userAction=answer.userAction;

        switch (answer.userAction) {
            case "view departments":
                viewDepartments();
                break;
            case "view roles":
                viewRoles();
                break;
            case "view employees":
                viewEmployees();
                break;
            case "add department":
                addDepartment();
                break;
            case "add role":
                addRole();
                break;
            case "add employee":
                addEmployee();
                break;
            case "update employee":
                updateEmployee();
                break;
            case "exit":
                console.log("Goodbye");
                process.exit(1);
                break;
        }
        return userAction;
    })
    .catch((error) => {
        if (error.isTtyError) {
            console.log("Prompt couldn't be rendered in the current environment");
        } else {
        console.log(error);
        }
    });
    return userAction;
};


//<----- userAction VIEW functions ----->
function viewDepartments() {
    pool.query("SELECT * FROM " + db_name + ".department", function (err, result) {
            if (err) throw err;
            console.table(result);
            returnToMenu();
            }
        );
};

function viewRoles() {
    pool.query("SELECT * FROM " + db_name + ".role", function (err, result) {
          if (err) throw err;
          console.table(result);
          returnToMenu();
        });
};

function viewEmployees() {
    pool.query("SELECT * FROM " + db_name + ".employee", function (err, result) {
          if (err) throw err;
          console.table(result);
          returnToMenu();
        });
};


//<----- userAction ADD functions ----->
function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            message: "New department name:",
            name: 'departmentName'
        }
    ])
    .then(async (answer) => {
            var sql = "INSERT INTO " + db_name + ".department (name) VALUES ('" + answer.departmentName + "')";
            await new Promise((resolve, reject) => {
                pool.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log("Department added");
                pool.query("SELECT * FROM " + db_name + ".department", function (err, result) {
                    if (err) throw err;
                    console.table(result);
                returnToMenu();
                });
                resolve();
            })
    })
})
};

function addRole() {
    pool.query("SELECT id as value, name FROM " + db_name + ".department", function (err, result1) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: 'input',
                message: "New role title:",
                name: 'roleTitle'
            },
            {
                type: 'input',
                message: "New role salary:",
                name: 'roleSalary'
            },
            {
                type: 'list',
                message: "New role department:",
                choices: result1,
                name: 'roleDepartmentId'
            }
        ])
    
    
        .then (async (answer) => {
                const sql = "INSERT INTO " + db_name + ".role (title, salary, department_id) VALUES ('" + answer.roleTitle + "', '" + answer.roleSalary + "', '" + answer.roleDepartmentId + "')";
                await new Promise((resolve, reject) => {
                    pool.query(sql, function (err, result) {
                  if (err) throw err;
                  console.log("Role added");
                pool.query("SELECT * FROM " + db_name + ".role", function (err, result) {
                    if (err) throw err;
                    console.table(result);
                returnToMenu();
                });
                resolve();
                });
                });
        });
    });
};

async function addEmployee() {
    Promise.all([
        new Promise((resolve, reject) => {
            pool.query("SELECT id as value, title FROM " + db_name + ".role", function (err, result2) {
                if (err) throw err;
                const roleChoices = result2.map(role => ({
                    name: role.title,
                    value: role.value
                }));
                resolve(roleChoices);
            });
        }),
        new Promise ((resolve, reject) => {
            pool.query("SELECT id as value, first_name, last_name FROM " + db_name + ".employee", function (err, result3) {
                // if (err) throw err;
                const managerChoices = result3.map(manager => ({
                    name: manager.first_name + " " + manager.last_name,
                    value: manager.value
                }));
                resolve(managerChoices);
            });
        })
    ])

    .then(([roleChoices, managerChoices]) => {
        if (managerChoices.length === 0) {
            managerChoices = [{name: "none", value: null}];
        }
        inquirer.prompt([
                {
                    type: 'input',
                    message: "New employee first name:",
                    name: 'employeeFirstName'
                },
                {
                    type: 'input',
                    message: "New employee last name:",
                    name: 'employeeLastName'
                },
                {
                    type: 'list',
                    message: "New employee role",
                    choices: roleChoices,
                    name: 'employeeRoleID'
                },
                {
                    type: 'list',
                    message: "New employee manager",
                    choices: managerChoices,
                    name: 'employeeManagerID'
                }
        ])
        
        .then (async (answer) => {
            console.log(answer);
            if (answer.employeeManagerID == null) {
                sql = "INSERT INTO " + db_name + ".employee (first_name, last_name, role_id) VALUES ('" + answer.employeeFirstName + "', '" + answer.employeeLastName + "', '" + answer.employeeRoleID + "')";
            } else {sql = "INSERT INTO " + db_name + ".employee (first_name, last_name, role_id, manager_id) VALUES ('" + answer.employeeFirstName + "', '" + answer.employeeLastName + "', '" + answer.employeeRoleID + "', '" + answer.employeeManagerID + "')";
            };
                await new Promise((resolve, reject) => {
                pool.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log("Employee added");
                pool.query("SELECT * FROM " + db_name + ".employee", function (err, result) {
                    if (err) throw err;
                    console.table(result);
                returnToMenu();
                });
                resolve();
                })
            })
        });       
    });
}


//<----- userAction UPDATE functions ----->
async function updateEmployee() {
    Promise.all([
        new Promise ((resolve, reject) => {
            pool.query("SELECT id as value, first_name, last_name FROM " + db_name + ".employee", function (err, result3) {
                // if (err) throw err;
                const employeeChoices = result3.map(employee => ({
                    name: employee.first_name + " " + employee.last_name,
                    value: employee.value
                }));
                resolve(employeeChoices);
            });
        }),
        new Promise ((resolve, reject) => {
        pool.query("SELECT id as value, title FROM " + db_name + ".role", function (err, result4) {
                if (err) throw err;
                const roleChoices = result4.map(role => ({
                    name: role.title,
                    value: role.value
                }));
                resolve(roleChoices);
            });
        })
        //  manager choices //does not select just managers, but selects all employees
        // new Promise ((resolve, reject) => {
        //     pool.query("SELECT id as value, first_name, last_name FROM " + db_name + ".employee WHERE EXISTS (SELECT role_id FROM " + db_name + ".role WHERE role.title = 'manager')", function (err, result5) {
        //         if (err) throw err;
        //         const managerChoices = result5.map(manager => ({
        //             name: manager.first_name + " " + manager.last_name,
        //             value: manager.value
        //         }));
        //         resolve(managerChoices);
        //     });
        // })
    ])

    .then(([employeeChoices, roleChoices]) => {
        console.log(employeeChoices, roleChoices);
    inquirer.prompt([
        {
            type: 'list',
            message: "Employee to update:",
            choices: employeeChoices,
            name: 'employee'
        },
        {
            type: 'list',
            message: "New role:",
            choices: roleChoices,
            name: 'employeeRole'
        },
        {
            type: 'list',
            message: "New manager:",
            choices: employeeChoices,
            name: 'employeeManager'
        }
    ])

    .then ((answer) => {

        const sql = "UPDATE " + db_name + ".employee SET role_id = '" + answer.employeeRole + "', manager_id = '" + answer.employeeManager + "' WHERE id = '" + answer.employee + "'";
        new Promise((resolve, reject) => {
            pool.query(sql, function (err, result) {
                if (err) throw err;
                console.log("Employee updated");
                pool.query("SELECT * FROM " + db_name + ".employee", function (err, result) {
                if (err) throw err;
                console.table(result);
                returnToMenu();
                });
            resolve();
            });
        })
    })
})}






module.exports = { init };