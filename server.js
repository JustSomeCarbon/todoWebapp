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
const [todoTasks, finishedTasks] = db_controller.initialize_application_db();

/**
 * Loads the data from the databases to the index page
 * @param {*} request 
 * @param {*} response 
 */
function load_data(request, response) {
    //const data_array = db_controller.get_data();
    db_controller.get_data(todoTasks).then(data => {
        response.render('index', {title: 'TodoList', header: "Todo List", todoList: data[0], finishedList: data[1]});
    });
    /*
    db_controller.get_data(finishedTasks).then(data => {
        response.render('index', {finishedList: data});
    });
    */
    // reconstruct into a single call to get_data?
}


/*
 * sends the information from the data store of the todo list to the frontend
 */
app.get("/", load_data);


/*
 * updates the todo task sent back
 */
app.post("/update", (request, response) => {
    
    console.log(request.body);

    db_controller.update_completed(request.body.existing_task_id);

    //response.render('index', {title: 'TodoList', header: "Todo List", todoList: todo.itemList});
    load_data(request, response);
});


/*
 * updates the todo task sent back
 */
app.post("/new_task", (request, response) => {
    console.log("new post method");
    
    // update some shit
    console.log(request.body);

    //db_controller.update_data()

    response.render('index', {title: 'TodoList', header: "Todo List", todoList: todo.itemList});
});


/*
 * deletes the todo task sent back
 */
app.delete("/", (request, response) => {
    console.log("delete");

    // delete some shit

    response.render('index', {title: 'TodoList', header: "Todo List", todoList: todo.itemList});
});


app.listen(port, () => {
    console.log("server started at: http://localhost:" + port);
});