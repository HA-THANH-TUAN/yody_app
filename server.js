const { server } = require('./src/app');
const { connectMongoDb } = require('./src/configurations/mongodbConfig');
const { connectRedis } = require('./src/configurations/redisConfig');
// const connectRedis = require("./src/configurations/redisConfig");
require('dotenv').config();

class Server {
    static async runServer() {
        try {
            await Promise.all([connectMongoDb(), connectRedis()]);
            server.listen(process.env.PORT_SERVER, () => {
                console.log(
                    'Server Started !',
                    process.env.PORT_SERVER,
                    ':::',
                    `http://localhost:${process.env.PORT_SERVER}`
                );
            });
        } catch (error) {}
    }
}

// "events": {
//     "restart": "npx prettier --write ."
// },

Server.runServer();
