const { createClient } = require('redis');

const clientRedis = createClient({
    password: 'Z89V8IL20UrbCoYm9Wbr5lUsFIotZ0rq',
    socket: {
        host: 'redis-15244.c1.asia-northeast1-1.gce.cloud.redislabs.com',
        port: 15244
    }
});

async function connectRedis() {
    try {
        await clientRedis.connect();
        console.log(' Connected to Redis successfully !');
    } catch (error) {
        console.log(' Redis connection has failed !');
        process.exit();
    }
}

module.exports = { connectRedis, clientRedis };
