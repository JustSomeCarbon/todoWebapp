/*
 * Contains the logic for connecting with the local MongoDB database,
 * as well as the logic for deleting, inserting, and retrieving
 * information.
 */

const { MongoClient, ObjectId } = require('mongodb');

//const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.5"
const uri = "mongodb://127.0.0.1:27017/?directConnection=true&&appName=mongosh+2.2.5"
const client = new MongoClient(uri);

/**
 * initialize the database pool and retrieve necessary collection connections
 * @returns todoTasks and finishedTasks collections
 */
function initialize_application_db() {

    const con = connect_db_engine();
    if (!con) {
        console.error("Error: no database connection");
        return [null, null];
    }

    // connect to database
    const db = connect_db('todoList');

    //return [todoTasks, finishedTasks];
    return db;
}

/**
 * takes a collection and queries all documents to return them
 * @param {*} db
 * @returns a map of documents
 */
async function get_data(db) {
    try {
        // gather everything from the collection
        const todoCursor = db.collection('todoTasks').find();
        const finishedCursor = db.collection('completedTasks').find();
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
 * @param {*} db
 * @param {*} coll 
 */
async function update_task_complete(task_id, db, coll) {
    console.log(`type of task_id: ${typeof task_id}`);
    const id = new ObjectId(task_id.toString());
    const filter = {'_id': id};
    await db.collection(coll).findOne(filter).then((result) => {
        console.log(`Document:: ${result}`);
        insert_document(result, db, 'completedTasks', coll, filter);
    }).catch((err) => {
        console.log(`Error: fecthing doc _id: ${task_id}`);
        console.error(err);
        return false;
    });

    return true;
}

/**
 * updates a task and moves it from completed to incomplete
 * @param {*} task_id 
 * @param {*} db 
 */
async function update_task_incomplete(task_id, db, coll) {
    const id = new ObjectId(task_id.toString());
    const filter = {'_id': id};
    await db.collection(coll).findOne(filter).then(result => {
        console.log(`Document:: ${result}`);
        insert_document(result, db, 'todoTasks', coll, filter);
    }).catch(err => {
        console.log(`Error: fecthing doc _id: ${task_id}`);
        console.error(err);
        return false;
    });

    return true;
}


function insert_document(doc, db, to, from, filter) {
    db.collection(to).insertOne(doc);
    db.collection(from).deleteOne(filter);
}


/**
 * takes a new task and inserts it into the todoTasks Collection
 * @param {*} task 
 * @param {*} db 
 * @returns 
 */
async function add_new_task(task, db) {
    const newDoc = {'task': task, 'completed': false};

    const result = await db.collection('todoTasks').insertOne(newDoc);
    console.log(`Inserted new task: ${result}`);

    return true;
}


async function delete_task(task_id, db, coll) {
    const filter = {"_id": task_id};

    const result = await db.collection(coll).deleteOne(filter);
    console.log(`Deleted task: ${result}`);

    return true;
}


/**
 * create a connection pool to the specified mongo database engine
 * @returns true if the connection was established, false otherwise
 */
function connect_db_engine()
{
    client.connect(err => {
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
    add_new_task,
    delete_task,
    connect_db,
    close_db_connection
};