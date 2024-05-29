/*
 * Contains the logic for connecting with the local MongoDB database,
 * as well as the logic for deleting, inserting, and retrieving
 * information.
 */

const { MongoClient } = require('mongodb');

const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.5"
const client = new MongoClient(uri);

/**
 * initialize the database pool and retrieve necessary collection connections
 * @returns todoTasks and finishedTasks collections
 */
function initialize_application_db() {
    if (!connect_db_engine()) { // MAY CAUSE A RACE CONDITION ???
        throw new Error("No databse connection");
    }

    // connect to database
    const db = connect_db('todoList');

    // connect to database collections
    const todoTasks = connect_collection(db, 'todoTasks');
    const finishedTasks = connect_collection(db, 'completedTasks');

    return [todoTasks, finishedTasks];
}

/**
 * takes a collection and queries all documents to return them
 * @param {*} collection 
 * @returns a map of documents
 */
async function get_data(todoCollection, finishedCollection) {
    try {
        // gather everything from the collection
        const todoCursor = todoCollection.find();
        const finishedCursor = finishedCollection.find();
        const todoTasks = await todoCursor.toArray();
        const finishedTasks = await finishedCursor.toArray();

        return [todoTasks, finishedTasks];

    } catch(error) {
        console.error("Error loading documents from database:: ", error);
        return [{"None": "Nil"}];
    }
}


/**
 * update the data associated with the given task_id within the todo
 * list database.
 * @param {*} task_id 
 */
async function update_task_complete(task_id, todoTasks, finishedTasks) {
    const filter = {'_id': task_id};
    const doc = todoTasks.findOne(filter, (err) => {
        if (err) {
            console.log(`Error: ${err}`);
            return false;
        }
    });

    // insert the task to finished Tasks
    finishedTasks.insertOne(doc);
    todoTasks.deleteOne(filter);

    console.log('document moved from incomplete to complete');
    return true;
}

/**
 * updates a task and moves it from completed to incomplete
 * @param {*} task_id 
 * @param {*} todoTasks 
 * @param {*} finishedTasks 
 */
async function update_task_incomplete(task_id, todoTasks, finishedTasks) {
    const filter = {'_id': task_id}
    const doc = finishedTasks.findOne(filter, (err) => {
        if (err) {
            console.log(`Error: ${err}`);
            return false;
        }
    });

    todoTasks.insertOne(doc);
    finishedTasks.deleteOne(filter);

    console.log('moved task from completed to incomplete');
    return true;
}


/**
 * create a connection pool to the specified mongo database engine
 * @returns true if the connection was established, false otherwise
 */
async function connect_db_engine()
{
    await client.connect(async err => {
        if (err) {
            console.log(`Error connecting to mongoDB: ${err}`)
            return false;
        }
    });
    return true;
}


/**
 * connects to a database
 * @param {*} database_name 
 * @returns a connection to the given database
 */
function connect_db(database_name) {
    const database = client.db(database_name);
    return database;
}


/**
 * create a connection to the specified database collection
 * @param {*} database 
 * @param {*} collection_name 
 * @returns a connection to the given collection
 */
function connect_collection(database, collection_name)
{
    const collection = database.collection(collection_name);
    return collection;
}

/**
 * close the connection established with the database
 */
async function close_db_connection() {
    await client.close();
}


module.exports = {
    initialize_application_db,
    get_data,
    update_task_complete,
    update_task_incomplete,
    connect_db,
    connect_collection,
    close_db_connection
};