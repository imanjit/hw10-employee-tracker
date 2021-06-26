const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306, 
    user: "root",
    password: "sqlpassword",
    database: "employees"
});

connection.connect((err) => {
    if (err) throw (err);
    prompts();
});

const prompts = () => {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View employees",
            "View departments",
            "View roles",
            "Add employee",
            "Add department",
            "Add role",
            "Update employee role",
            "Quit"
        ]
    }).then((ans) => {
        switch(ans.action) {
            case "View employees":
                viewEmployees();
                break;
            case "View departments":
                viewDepartments();
                break;
            case "View roles":
                viewRoles;
                break;
            default:
                break;
        }
    })
};

const viewEmployees = () => {
    let query = "SELECT * FROM employee";
    connection.query(query, (req, res) => {
        let employeeCount = res.length
        console.log(`${employeeCount} employees found`);
        console.table("Employees:", res);
        prompts();
    })
};

const viewDepartments = () => {
    let query = "SELECT * FROM department";
    connection.query(query, (req, res) => {
        console.table("Departments:", res);
        prompts();
    })
};
 
const viewRoles = () => {
    let query = "SELECT * FROM role";
    connection.query(query, (req, res) => {
        console.table("Roles:", res);
        prompts();
    })
}; 
