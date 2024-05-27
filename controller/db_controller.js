/*
 * Contains the logic for connecting with the local MongoDB database,
 * as well as the logic for deleting, inserting, and retrieving
 * information.
 */

const { MongoClient } = require('mongodb');

const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.5"
const client = new MongoClient(uri);

async function get_data() {
    try {
        client.connect();
        const database = client.db('todoList');
        const collection = database.collection('todoTasks');

        const cursor = collection.find();

        // convert to array and log the documents
        const tasks = await cursor.toArray();

        return tasks;

    } catch(error) {
        console.error("Error loading documents from database:: ", error);
        return [{"None": "Nil"}];
    }
}


/*
 * update the data associated with the given task_id within the todo
 * list database. return nothing.
 */
async function update_completed(task_id) {
    const collection = connect_db_collection('todoList', 'todoTasks');
    const filter = {'task_id': task_id};
    collection.findOne(filter, (err, result) => {
        if (err) {
            console.log(`Error: ${err}`);
            return;
        }
    });

    new_value = !(result.completed);

    const update_document = {
        $set: {
            completed: new_value
        }
    }

    const result = await collection.updateOne(filter, update_document);

    console.log(`${result.modifiedCount} document(s) updated`);
}

/*
 * create a connection pool to the database
 */
function connect_db_collection(database_name, collection_name)
{
    client.connect(async err => {
        if (err) {
            console.log(`Error connecting to mongoDB:: ${err}`);
            return null;
        }
    });
    const database = client.db(database_name);
    const collection = database.collection(collection_name);

    return collection;
}

/*
 * close the connection established with the database
 */
async function close_db_connection() {
    await client.close();
}


module.exports = {get_data, update_completed, connect_db_collection, close_db_connection};