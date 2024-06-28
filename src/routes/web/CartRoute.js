const express = require('express');
const { handleErrorRequest, Unauthorized } = require('../../core/handleError');
const {
    addProductCart,
    getProductCart
} = require('../../controllers/web/CartController');
const { comfirmToken } = require('../../middlewares/comfirmToken');

const routerWebCart = express.Router();
routerWebCart.use(
    '/',
    handleErrorRequest(comfirmToken),
    handleErrorRequest(async (req, res, next) => {
        const roles = req.role;
        if (roles.includes(1)) {
            next();
        } else {
            throw new Unauthorized('Resource access is not allowed');
        }
    })
);

routerWebCart.post('/add-product-cart', handleErrorRequest(addProductCart));
routerWebCart.get('/get-product-cart', handleErrorRequest(getProductCart));
module.exports = routerWebCart;
