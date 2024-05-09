const express = require("express");
const path = require("path");
const controller = require("./controller/controller");

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
app.get("/", (request, response) => {
    //response.set('Custom-type', 'application/json');
    response.sendFile(path.join(__dirname, 'views/index.html'));
    //response.send({"list": todo.itemList});
});
*/

app.get("/", (request, response) => {
    response.render('index', {title: 'TodoList', header: "Todo List"});
})


app.listen(port, () => {
    console.log("server started at: http://localhost:" + port);
});