const express = require('express');
const { handleErrorRequest } = require('../../core/handleError');
const {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
    getCategory
} = require('../../controllers/admin/CategoryController');

const routerAdminCategory = express.Router();
routerAdminCategory.get('/category/:id', handleErrorRequest(getCategory));
routerAdminCategory.get('/categories', handleErrorRequest(getCategories));
routerAdminCategory.post('/category', handleErrorRequest(createCategory));
routerAdminCategory.patch('/category', handleErrorRequest(updateCategory));
routerAdminCategory.delete('/category/:id', handleErrorRequest(deleteCategory));

module.exports = routerAdminCategory;
