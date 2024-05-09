/*
 * The controller file for the TodoList application
 */

const { TodoList } = require("../model/todolib");

function initializeTodoList() {
    return new TodoList();
}

module.exports = {initializeTodoList};