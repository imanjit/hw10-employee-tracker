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
    if (err) throw err;
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
                viewRoles();
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
    connection.query(query, (err, res) => {
        if (err) throw err;
        let employeeCount = res.length
        console.log(`${employeeCount} employees found`);
        console.table("Employees:", res);
        prompts();
    })
};

const viewDepartments = () => {
    let query = "SELECT * FROM department";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table("Departments:", res);
        prompts();
    })
};
 
const viewRoles = () => {
    let query = "SELECT * FROM role";
    connection.query(query, (err, res) => {
        if (err) throw err
        console.table("Roles:", res);
        prompts();
    })
};

const addEmployee = () => {
    connection.query("SELECT * FROM role", (err, res) => {
        if (err) throw err
        inquirer.prompt([
            {
                name: "first_name",
                type: "input",
                message: "Employee's first name?"
            },
            {
                name: "last_name",
                type: "input",
                message: "Employee's last name?"
            },
            {
                name: "manager_id",
                type: "input",
                message: "Employee's manager's ID?"
            },
            {
                name: "role",
                type: "list",
                message: "Employee's role?",
                choices: () => {
                    let roleArr = [];
                    for (let i = 0; i < res.length; i++) {
                        roleArr.push(res[i].title);
                    }
                    return roleArr;
                },
            }
        ]).then((ans) => {
            let role_id;
            for (let a = 0; a < res.length; a++) {
                if (res[a].name == ans.role) {
                    role_id = res[a].id;
                }
            }
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: ans.first_name,
                    last_name: ans.last_name,
                    manager_id: ans.manager_id,
                    role_id: role_id,
                },
                (err) => {
                    if (err) throw err;
                    console.log("Employee added");
                    prompts();
                })
        })
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
            connection.query(query, (err, res) => {
                if (err) throw err
                console.log("Department added")
                console.table("Departments:", res);
                prompts();
            })
    })
};

const addRole = () => {
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err
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
                message: "Department of this role?",
                choices: () => {
                    let dept = []
                    for (let i = 0; i < res.length; i++) {
                        dept.push(res[i].name);
                    }
                    return dept;
                },
            }
        ]).then((ans) => {
            let department_id;
            for (let a = 0; a < res.length; a++) {
                if (res[a].name == ans.department) {
                    department_id = res[a].id;
                }
            }
            connection.query(
                "INSERT INTO role SET ?",
                {
                    title: ans.new_role,
                    salary: ans.salary,
                    department_id: department_id,
                },
                (err, res) => {
                    if (err) throw err;
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