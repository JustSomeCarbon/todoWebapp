const express = require("express");
//const path = require("path");
const bodyParser = require('body-parser')
const controller = require("./controller/controller");
const db_controller = require("./controller/db_controller");

const app = express();
app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.set('view engine', 'pug');
const port = process.env.PORT || 8080;
//app.use(express.json());
//app.use(express.urlencoded({extended: true}));

// open the connection to the database
db_controller.connect_db_collection("")

function load_data(request, response) {
    //const data_array = db_controller.get_data();
    db_controller.get_data().then(data => {
        response.render('index', {title: 'TodoList', header: "Todo List", todoList: data});
    });
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