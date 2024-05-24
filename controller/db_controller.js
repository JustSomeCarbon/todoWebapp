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
        await client.close();
        return tasks;

    } catch(error) {
        console.error("Error loading documents from database:: ", error);
        return [{"None": "Nil"}];
    } finally {
        await client.close();
    }
}


/*
 * 
 */
async function update_data(task_id) {
    const collection = connect_db_collection('todoList', 'todoTasks');
    const filter = {'task_id': task_id};
    const update_document = {
        $set: {
            keyToUpdate: new_value
        }
    }

    const result = await collection.updateOne(filter, update_document);

    console.log(`${result.modifiedCount} document(s) updated`);

    await client.close();
}


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


module.exports = {get_data, update_data};