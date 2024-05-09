/*
 * The view script for the frontend of the file. used by the index.html
 * file to showcase the todoList objects in the front end
 */

function printTodoHTML(todoList) {
    let list = document.getElementById("list");
    todoList.forEach((item) => {
        let li = document.createElement("li");
        li.innerText = `${item["todoTask"]}`;
        list.appendChild(li);
    });
}