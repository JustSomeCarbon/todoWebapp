/*
 * Todo application module library
 * this file contains the class for the TodoList object
 * used in the application. All methods on the TodoList are
 * defined bellow.
 */


/*
 * Todo List Class Definition
 */
class TodoList {
    constructor() {
        this.itemList = [];
        this.listLength = 0;
    }

    /* Add an item to the TodoList instance */
    addTodoItem(newItem) {
        this.itemList.push({"todoId": `${this.listLength + 1}`, "todoTask": newItem});
        this.listLength += 1;
    }

    /* Print the todo items in the TodoList object instance */
    printTodoItems() {
        this.itemList.forEach((item) => {
            console.log(`${item["todoId"]} : ${item["todoTask"]}`);
        });
    }
}


module.exports = { TodoList };