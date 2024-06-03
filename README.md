# Todo Web Application

This project is a simple web application for a todo list that is written
using Express.js, Pug, and MongoDB. This is meant to be a exploratory project, showcasing the use of these technologies to create a simple application.

The todo app loads data from the specified mongoDB to the web page. Both incomplete and complete todo items are listed, separated by an input field that allows the addition of a new todo list item. checking complete or incomplete on list items moves them to the oposite database collection; if they are in incomplete they are moved to complete, if they are in complete they are moved to incomplete. We can delete old todo items using the X button on the right of all todo list items.

## Features

The todo app will have the following:
- [X] load todo items from database
- [X] list all todo items
- [X] add a new todo item
- [X] move coimpleted todo items to incomplete
- [X] delete current todo items
- [X] delete completed todo items
- [X] store todo items in database
- [X] list todo items on web page on each update
