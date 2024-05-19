const express = require("express");
const path = require("path");
const controller = require("./controller/controller");
const db_controller = require("./controller/db_controller");

const app = express();
app.use(express.static(__dirname + '/'));
app.set('view engine', 'pug');
const port = process.env.PORT || 8080;
//app.use(express.json());
//app.use(express.urlencoded({extended: true}));


// initialize the todo list item
todo = controller.initializeTodoList();
todo.addTodoItem("brush teeth");
todo.addTodoItem("Eat breakfast");
todo.addTodoItem("finish todo application");

/*
 * sends the information from the data store of the todo list to the frontend
 */
app.get("/", (request, response) => {
    //const data_array = db_controller.get_data();
    db_controller.get_data().then(data => {
        response.render('index', {title: 'TodoList', header: "Todo List", todoList: data});
    });
});

/*
 * updates the todo task sent back
 */
app.put("/", (request, response) => {
    console.log("put method");
    
    // update some shit

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