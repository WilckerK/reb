const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

var cachedDB;
var cachedClient;

module.exports = async () => {
    if (cachedDB && cachedDB){
        return{client: cachedClient, db: cachedDB};
    }

    const client = new MongoClient(uri);
    await client.connect();
    cachedClient = client;

    const db = client.db(dbName);
    cachedDB = db;
    return{client, db};
}