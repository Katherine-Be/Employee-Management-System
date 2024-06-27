//  start appuserAction prompt
const inquirer = require('inquirer');
// const mysql = require('mysql2');
const pool = require('./config/dbConfig');
const mysql = require('mysql2');
var userAction = "";
require ("console.table");


function returnToMenu () {
    inquirer.prompt([
        {
            type: 'list',
            message: "Return to main menu?",
            choices: [
                'Yes'],
            name: 'returnResponse'
        }
    ])    
    .then((answer) => {
        if (answer.returnResponse === "Yes") {
            init();
        } 
    })
};

    
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
            message: "View all:",
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
            case "view rmployees":
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


//<-----userAction RETURN functions----->


// function returnToMenu (userAction) {
//     inquirer.prompt([
//         {
//             type: 'list',
//             message: "Return to main menu?",
//             choices: [
//                 'Yes',
//                 'No, go back to editing resource'
//             ],
//             name: 'returnResponse'
//         }
//     ])
//     .then((answer) => {
//         if (answer.returnResponse === "Yes") {
//             init();
//         } else{
//             switch (userAction) {
//                 case "add department":
//                     break;                    
//                 case "add role":
//                     addRole();
//                     break;
//                 case "add employee":
//                     addEmployee();
//                     break;
//                 case "update employee":
//                     updateEmployee();
//                     break;
//             }
//         }})
//     .catch((error) => {
//         if (error.isTtyError) {
//             console.log("Prompt couldn't be rendered in the current environment");
//         } else {
//         console.log(error);
//     }})
// };

//<-----userAction VIEW functions----->
//show departments table organized as table in the CLI

function viewDepartments() {
    pool.query("SELECT * FROM department", function (err, result) {
            if (err) throw err;
            console.table(result);
            returnToMenu();
            }
        );
};

function viewRoles() {
    pool.query("SELECT * FROM role", function (err, result) {
          if (err) throw err;
          console.table(result);
          returnToMenu();
        });
};

function viewEmployees() {
    pool.query("SELECT * FROM employee", function (err, result) {
          if (err) throw err;
          console.table(result);
          returnToMenu();
        });
};

//<-----userAction ADD functions----->

//add department and show updated department list

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            message: "New department name:",
            name: 'departmentName'
        }
    ])
    .then(async (answer) => {
            var sql = "INSERT INTO department (name) VALUES ('" + answer.departmentName + "')";
            await new Promise((resolve, reject) => {
                pool.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log("Department added");
                pool.query("SELECT * FROM department", function (err, result) {
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
    pool.query("SELECT id as value, name FROM department", function (err, result1) {
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
                message: "New role department ID:",
                choices: result1,
                //later populate current departments as choices
                name: 'roleDepartmentId'
            }
        ])
    
    
        .then (async (answer) => {
                const sql = "INSERT INTO role (title, salary, department_id) VALUES ('" + answer.roleTitle + "', '" + answer.roleSalary + "', '" + answer.roleDepartmentId + "')";
                await new Promise((resolve, reject) => {
                    pool.query(sql, function (err, result) {
                  if (err) throw err;
                  console.log("Role added");
                pool.query("SELECT * FROM role", function (err, result) {
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
    await new Promise((resolve,reject) => {
        pool.query("SELECT id as value, title FROM role", function (err, result2) {
        if (err) throw err;
        resolve();
        // pool.query("SELECT id as value, first_name FROM employee", function (err, result2) {
        //     if (err) throw err;
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
                    choices: result2,
                    //later populate current roles as choices
                    name: 'employeeRoleID'
                },
                // {
                //     type: 'input',
                //     message: result2,
                //     //later populate current employees as choices
                //     name: 'employeeManagerID'
                // }
            ])

            .then (async (answer) => {
                const sql = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('" + answer.employeeFirstName + "', '" + answer.employeeLastName + "', '" + answer.employeeRoleID + "', '" + answer.employeeManagerID + "')";
                await new Promise((resolve, reject) => {
                    pool.query(sql, function (err, result) {
                        if (err) throw err;
                        console.log("Employee added");
                    pool.query("SELECT * FROM employee", function (err, result) {
                        if (err) throw err;
                        console.table(result);
                    returnToMenu();
                    });
                    resolve();
                    })
                })
            });
       
        });
    });
}
// })};


//<-----userAction UPDATE functions----->
function updateEmployee() {

    inquirer.prompt([
        {
            type: 'input',
            message: "Employee ID to update:",
            name: 'employeeID'
        },
        {
            type: 'input',
            message: "New role ID:",
            //later populate current roles as choices
            name: 'employeeRoleID'
        },
        {
            type: 'input',
            message: "New manager ID:",
            //later populate current employees as choices
            name: 'employeeManagerID'
        }
    ])

    .then((answer) => {

        var sql = "UPDATE employee SET role_id = '" + answer.employeeRoleID + "', manager_id = '" + answer.employeeManagerID + "' WHERE id = '" + answer.employeeID + "'";
        pool.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Employee updated");
        });
        pool.query("SELECT * FROM employee", function (err, result) {
            if (err) throw err;
            console.log(result);
        });
        });
        init();

};






module.exports = { init };