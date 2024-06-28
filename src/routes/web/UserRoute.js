const express = require('express');
const { handleErrorRequest } = require('../../core/handleError');
const { comfirmToken } = require('../../middlewares/comfirmToken');
const {
    getProfile,
    editUserAddress,
    createUserAddress
} = require('../../controllers/web/UserController');

const routerUser = express.Router();
routerUser.use('/', handleErrorRequest(comfirmToken));
routerUser.get('/my-profile', handleErrorRequest(getProfile));
routerUser.post('/add-user-address', handleErrorRequest(createUserAddress));
routerUser.post('/edit-user-address', handleErrorRequest(editUserAddress));

module.exports = routerUser;
