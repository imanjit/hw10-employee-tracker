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
            case "Add employee":
                addEmployee();
                break;
            case "Add department":
                addDepartment();
                break;
            case "Add role":
                addRole();
                break;
            case "Quit": 
                quitApp();
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

const addDepartment = () => {
    inquirer.prompt([
        {
            name: "newDept",
            type: "input",
            message: "Name of department?"
        }
    ]).then((ans) => {
        connection.query(
            "INSERT INTO department SET ?",
            {
                name: ans.newDept
            });
            let query = "SELECT * FROM department";
            connection.query(query, (req, res) => {
                console.log("Department added")
                console.table("Departments:", res);
                prompts();
            })
    })
};

const addRole = () => {
    connection.query("SELECT * FROM department", (req, res) => {
        inquirer.prompt([
            {
                name: "new_role",
                type: "input",
                message: "What is the new role?"
            },
            {
                name: "salary",
                type: "input",
                message: "Salary of this role?"
            },
            {
                name: "department",
                type: "list",
                choices: () => {
                    let dept = []
                    for (let i = 0; i < res.length; i++) {
                        dept.push(res[i].name);
                    }
                    return dept;
                },
            }
        ]).then((ans) => {
            let deptId;
            for (let a = 0; a < res.length; a++) {
                if (res[a].name == ans.department) {
                    deptId = res[a].id;
                }
            }
            connection.query(
                "INSERT INTO role SET ?",
                {
                    title: ans.new_role,
                    salary: ans.salary,
                    deptId: deptId,
                },
                (req, res) => {
                    console.log("Role added");
                    console.table("Roles:", res);
                    prompts();
                })
        })
    })
};

const quitApp = () => {
    connection.end();
};