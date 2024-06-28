const express = require('express');
const { handleErrorRequest } = require('../../core/handleError');
const {
    login,
    register,
    resetPassword,
    verifyResetPassword,
    refreshToken
} = require('../../controllers/web/AuthController');

const routerAuth = express.Router();
routerAuth.post('/login', handleErrorRequest(login));
routerAuth.post('/register', handleErrorRequest(register));
routerAuth.post('/refresh-token', handleErrorRequest(refreshToken));
routerAuth.post('/reset-password', handleErrorRequest(resetPassword));
routerAuth.patch(
    '/verify-reset-password',
    handleErrorRequest(verifyResetPassword)
);

module.exports = routerAuth;
