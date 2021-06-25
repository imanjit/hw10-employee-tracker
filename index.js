const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost", 
    user: "root",
    password: "",
    database: "employees"
});

connection.connect();

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
}