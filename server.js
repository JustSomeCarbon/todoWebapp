const express = require("express");
const bodyParser = require('body-parser');
const db_controller = require("./controller/db_controller");

const app = express();
app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'pug');
const port = process.env.PORT || 8080;
//app.use(express.json());
//app.use(express.urlencoded({extended: true}));

// open the connection to the database
const db = db_controller.initialize_application_db();

/**
 * Loads the data from the databases to the index page
 * @param {*} request 
 * @param {*} response 
 */
function load_data(request, response) {
    //const data_array = db_controller.get_data();
    db_controller.get_data(db).then(data => {
        response.render('index', {title: 'TodoList', header: "Todo List", todoList: data[0], finishedList: data[1]});
    });
}


/*
 * sends the information from the data store of the todo list to the frontend
 */
app.get("/", load_data);


/*
 * updates task to be completed
 */
app.post("/complete", (request, response) => {
    if ("existing_task_id" in request.body) {
        console.log(request.body);
        db_controller.update_task_complete(request.body.existing_task_id, db, 'todoTasks').then(res => {
            load_data(request, response);
        });
    } else if ("finished_task_id" in request.body) {
        console.log(request.body);
        db_controller.update_task_incomplete(request.body.finished_task_id, db, 'completedTasks').then(res => {
            load_data(request, response);
        });
    } else {
        console.error("Error, unknown task given");
        load_data(request, response);
    }
});


/*
 * updates the todo task sent back
 */
app.post("/newtask", (request, response) => {
    console.log("post new");

    // update some shit
    console.log(request.body);
    db_controller.add_new_task(request.body.new_task, db).then(res => {
        load_data(request, response);
    });
});


/*
 * deletes a task from the todo collection
 */
app.delete("/deletetodo", (request, response) => {
    console.log("delete Todo");

    db_controller.delete_task(request.body.to_delete_id, db, "todoTasks").then(res => {
        load_data(request, response);
    });
});


/**
 * deletes a task from the completed collection
 */
app.delete("/deletecompleted", (request, response) => {
    console.log("delete Completed");

    db_controller.delete_task(request.body.to_delete_id, db, "completedTasks").then(res => {
        load_data(request, response);
    });
});


app.listen(port, () => {
    console.log("server started at: http://localhost:" + port);
});