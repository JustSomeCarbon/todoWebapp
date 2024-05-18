/*
 * Contains the logic for connecting with the local MongoDB database,
 * as well as the logic for deleting, inserting, and retrieving
 * information.
 */

const { MongoClient } = require('mongodb');

const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.5"
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
tasks = NONE;

function get_data() {
    try {
        client.connect();
        const database = client.db('todoList');
        const collection = database.collection('todoTasks');

        const cursor = collection.find();

        // convert to array and log the documents
        const tasks = cursor.toArray();
        console.log(tasks);

    } catch(error) {
        console.error("Error loading documents from database:: ", error);
    } finally {
        client.close();
    }
    return tasks;
}