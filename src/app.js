const express = require('express');
const { Server: ServerSocketIO } = require('socket.io');
const bodyParser = require('body-parser');
const { createServer } = require('http');
const routerUser = require('./routes/web/UserRoute');
const routerAuth = require('./routes/web/AuthRoute');
const ResponseApi = require('./core/response');
const { cors } = require('./middlewares/cors');
const routerAdminCategory = require('./routes/admin/CategoryRoute');
const routerAdminProduct = require('./routes/admin/ProductRoute');
const routerTest = require('./routes/editor');
const routerWebCart = require('./routes/web/CartRoute');
const { prouductRoute } = require('./routes/web/ProductRoute');
const { routerCategory } = require('./routes/web/CategoryRoute');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/admin', routerAdminCategory);
app.use(
    '/admin',
    (req, res, next) => {
        req.socketProduct = socketProduct;
        next();
    },
    routerAdminProduct
);
app.use('/web/user', routerUser);
app.use('/web/auth', routerAuth);
app.use('/web/cart', routerWebCart);
app.use('/web/product', prouductRoute);
app.use('/web/category', routerCategory);
app.use('/', routerTest);

app.use((error, req, res, next) => {
    console.log('error:::', error);
    const dataResponse = new ResponseApi(
        undefined,
        error.message ?? 'Not Found',
        error.status ?? 404
    );
    res.status(error.status ?? 404).json(dataResponse);
});

const server = createServer(app);
const io = new ServerSocketIO(server, {
    cors: {
        origin: 'http://localhost:3001'
    }
});

const socketProduct = io.of('/admin/product');
socketProduct.on('connection', (socket) => {
    console.log('A user connected');

    // Handle messages sent by the client
    socket.on('message', (data) => {
        console.log('Received message:', data);
        // Broadcast the message to all connected clients
        io.emit('message', data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

module.exports = {
    server
};
