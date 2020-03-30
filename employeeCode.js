var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "employees_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected")
    askUser();
});

function askUser() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices:
                ["Add Department",
                    "Add Role",
                    "Add Employee",
                    "View Department",
                    "View Role",
                    "View Employee",
                    "Update Employee role",
                    "EXIT"
                ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "Add Department":
                    addDept();
                    break;

                case "Add Role":
                    addRole();
                    break;

                case "Add Employee":
                    addEmp();
                    break;

                case "View Department":
                    viewDept();
                    break;

                case "View Role":
                    viewRole();
                    break;

                case "View Employee":
                    viewEmp();
                    break;
                case "Update Employee role":
                    updateRole();
                    break;
                case "EXIT":
                    endNow();
            }
        });
}


function viewDept() {
    connection.query("SELECT * FROM dept", function (err, res) {
        if (err) throw err;
        console.table(res);
        whatNext();
    })
}

function viewRole() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        console.table(res);
        whatNext();
    })
}

function viewEmp() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        console.table(res);
        whatNext();
    })
}

function addDept() {
    inquirer.prompt(
        [
            {
                name: "dept_Name",
                type: "input",
                message: "Enter new Department name:"
            }
        ]
    ).then(function (answer) {
        connection.query("INSERT INTO dept SET ?",
            {
                name: answer.dept_Name
            },
            function (err) {
                if (err) throw err;
                console.log("New Department added")
                
                whatNext();
            })
    })

}

function addRole() {
    connection.query("SELECT * FROM dept", function (err, allDepts) {
        if (err) throw err;

        inquirer.prompt(
            [
                {
                    name: "new_title",
                    type: "input",
                    message: "Enter new Employee Role:"
                },
                {
                    name: "new_salary",
                    type: "number",
                    message: "Enter new Role salary:"
                },
                {
                    name: "dept_ID",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < allDepts.length; i++) {
                            choiceArray.push({
                                name: allDepts[i].name,
                                value: allDepts[i].id
                            })
                        }
                        return choiceArray;

                    },
                    message: "Enter new role's department:",
                    //  value: allDepts[i].id,
                },
            ]
        ).then(function (answer) {
            connection.query("INSERT INTO role SET ?",
                {
                    title: answer.new_title,
                    salary: answer.new_salary,
                    dept_id: answer.dept_ID,
                },
                function (err) {
                    if (err) throw err;
                    console.log("New Role added")
                    
                    whatNext();
                })
        })
    })
}


function addEmp() {
    connection.query("SELECT * FROM role", function (err, allRoles) {
        if (err) throw err;
        connection.query("SELECT * FROM employee", function (err, allEmps) {
            if (err) throw err;


            inquirer.prompt(
                [
                    {
                        name: "fname",
                        type: "input",
                        message: "Enter new Employee first name:"
                    },
                    {
                        name: "lname",
                        type: "input",
                        message: "Enter new Employee last name:"
                    },
                    {
                        name: "role_ID",
                        type: "rawlist",
                        choices: function () {
                            var choiceArray = [];
                            for (var i = 0; i < allRoles.length; i++) {
                                choiceArray.push({
                                    name: allRoles[i].title,
                                    value: allRoles[i].id
                                })
                            }
                            return choiceArray;

                        },
                        message: "Select new employees role:",
                        //  value: allDepts[i].id,
                    },
                    {
                        name: "boss_id",
                        type: "rawlist",
                        choices: function () {
                            var choice2Array = [];
                            for (var i = 0; i < allEmps.length; i++) {
                                choice2Array.push({
                                    name: allEmps[i].first_name,
                                    value: allEmps[i].rold_id
                                })
                            }
                            return choice2Array;
                        }

                    }
                ]
            ).then(function (answer) {
                connection.query("INSERT INTO employee SET ?",
                    {
                        first_name: answer.fname,
                        last_name: answer.lname,
                        rold_id: answer.role_ID,
                        manager_id: answer.boss_id
                    },
                    function (err) {
                        if (err) throw err;
                        console.log("New Employee added")
                        
                        whatNext();
                    })
            })
        })
    })
}

function updateRole() {
    connection.query("SELECT * FROM employee", function (err, allEmps) {
        if (err) throw err;
        connection.query("SELECT * FROM role", function (err, allRoles) {
            if (err) throw err;
            inquirer.prompt([
                {
                    name: "Emp",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < allEmps.length; i++) {
                            choiceArray.push({
                                name: allEmps[i].first_name,
                                value: allEmps[i].id
                            })
                        }
                        return choiceArray;

                    },
                    message: "Select Employee to update",

                },
                {
                    name: "new_Role",
                    type: "rawlist",
                    choices: function () {
                        var choice2Array = [];
                        for (var i = 0; i < allRoles.length; i++) {
                            choice2Array.push({
                                name: allRoles[i].title,
                                value: allRoles[i].id
                            })
                        }
                        return choice2Array;
                    }

                }]).then(function (answer) {
                    console.log(answer)
                    connection.query("UPDATE employee SET ? WHERE ?", [
                        {
                            rold_id: answer.new_Role,
                        },
                        {
                            id: answer.Emp
                        }],
                        function (err) {
                            if (err) throw err;
                            console.log("Employee Role changed")
                            
                            whatNext();
                        })

                })
        })
    })
}

function whatNext() {
    askUser()
}
function endNow() {
    connection.end();
}