var inquirer = require('inquirer');
// var fs = require('fs');


//  start appuserAction prompt
function init() {
    inquirer.prompt([
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
                'Departments',
                'Roles',
                'Employees',
                new inquirer.Separator('-- or add a(n):'),
                'Department',
                'Role',
                'Employee',
                new inquirer.Separator('-- or update an:'),
                'Employee'
                ],
            pageSize: 9,
            name: 'userAction'            
        }
    ])
    .then((answer) => {
        console.log("prompt answered")
        userAction(answer);

        switch (answer.userAction) {
            case "Departments":
                viewDepartments();
                break;
            case "Roles":
                viewRoles();
                break;
            case "Employees":
                viewEmployees();
                break;
            case "Department":
                addDepartment();
                break;
            case "Role":
                addRole();
                break;
            case "Employee":
                addEmployee();
                break;
            case "Employee":
                updateEmployee();
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
};

//<-----userAction VIEW functions----->
function viewDepartments() {
    con.connect(function(err) {
        if (err) throw err;
        con.query("SELECT * FROM department", function (err, result) {
          if (err) throw err;
          console.log(result);
        });
      });
};

function viewRoles() {
    con.connect(function(err) {
        if (err) throw err;
        con.query("SELECT * FROM role", function (err, result) {
          if (err) throw err;
          console.log(result);
        });
      });
};

function viewEmployees() {
    con.connect(function(err) {
        if (err) throw err;
        con.query("SELECT * FROM employee", function (err, result) {
          if (err) throw err;
          console.log(result);
        });
      });
}







init();