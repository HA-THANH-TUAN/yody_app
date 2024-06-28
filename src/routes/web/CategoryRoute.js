const express = require('express');
const { getCategories } = require('../../controllers/web/CategoryController');
const { handleErrorRequest } = require('../../core/handleError');
const routerCategory = express.Router();

routerCategory.get('/get-categories', handleErrorRequest(getCategories));

module.exports = { routerCategory };
