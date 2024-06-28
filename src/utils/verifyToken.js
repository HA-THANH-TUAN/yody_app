require('dotenv').config();
var jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');
const SECRET_KEY = process.env.SECRET_KEY;
const EXPIRE_TOKEN_TIME = process.env.EXPIRE_TOKEN_TIME;
const EXPIRE_REFRESH_TOKEN_TIME = process.env.EXPIRE_REFRESH_TOKEN_TIME;

function verifyToken(token) {
    try {
        const result = jwt.verify(token, SECRET_KEY);
        console.log('result:::', result);
        return {
            status: true,
            message: 'OK',
            infor: result
        };
    } catch (error) {
        return {
            status: false,
            message: error === 'jwt expired' ? 'Expired' : ''
        };
    }
}

function middleWareVerifyToken() {}

module.exports = verifyToken;
