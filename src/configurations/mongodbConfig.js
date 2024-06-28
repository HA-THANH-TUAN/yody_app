// mongodb+srv://s2hathanhtuan2s:<password>@cluster0.2ew7vgg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
const { MongoClient } = require('mongodb');
require('dotenv').config();
const username = process.env.USER_NAME_MONGO;
const password = process.env.PASSWORD_MONGO;
const clusterName = process.env.CLUSTER_NAME;
const databaseName = process.env.DATABASE_NAME_MONGO;
const url = `mongodb+srv://${username}:${password}@${clusterName}.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const clientMongo = new MongoClient(url);

function mongDb() {
    return clientMongo.db(databaseName);
}
async function connectMongoDb() {
    try {
        await clientMongo.connect();
        console.log(' Connected to MongoBD successfully !');
        // await mongDb().collection('categories').createIndex({ name: 1 , _id:1 , slug: 1 }); // Index on 'name' field
        await mongDb().collection('products').createIndex({ name: 1 }); // Index on 'name' field
        await mongDb()
            .collection('product_colors')
            .createIndex({ productId: 1 }); // Index on 'name' field
        await mongDb().collection('user_addresses').createIndex({ userId: 1 }); // Index on 'name' field
        // await mongDb().collection('categories').createIndex({ slug: 1 , status:1}) // Index on 'name' field
    } catch (err) {
        console.log(err);
        console.log(' MongoBD connection has failed !');
        process.exit();
    }
}

module.exports = { connectMongoDb, mongDb };
