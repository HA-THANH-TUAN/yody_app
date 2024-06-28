const {
    getProductForCategory
} = require('../../controllers/web/ProductController');
const { handleErrorRequest } = require('../../core/handleError');
const express = require('express');

const prouductRoute = express.Router();

prouductRoute.get('/get-products', handleErrorRequest(getProductForCategory));
prouductRoute.get('/search-products', handleErrorRequest(getProductForCategory));
// prouductRoute.get('/get-product-colors', handleErrorRequest(getProductColors));

module.exports = { prouductRoute };
