const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");

const connection = mysql.createConnection({
    host: "localhost", 
    user: "root",
    password: "password",
    database: "employees"
});

connection.connect(prompts());

const prompts = () => {
    inquirer.prompt({
        name: "action",
        type: "choice",
        message: "What would you like to do?",
        choices: [
            "View employees",
            "View departments",
            "View roles",
            "Add employee",
            "Add department",
            "Add role",
            "Update employee role",
            "Remove employee",
            "Quit"
        ]
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
