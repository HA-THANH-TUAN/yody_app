const express = require('express');
const { handleErrorRequest } = require('../../core/handleError');
const {
    createProduct,
    createColorProduct,
    getProductForAdmin,
    getProductForId,
    addUploadOptionProduct,
    deleteUploadOptionProduct,
    deleteOptionProduct,
    updateOptionProduct,
    deleteSizeAmountOption,
    addSizeAmountOption,
    updateProduct,
    updateSizeAmountOptionProduct,
    createMetaSeoProduct,
    getMetaSeoProduct,
    updateMetaSeoProduct,
    updateMediaUrlOption
} = require('../../controllers/admin/ProductController');
const {
    middleWareUpdateMediaUrlOptionProduct,
    middleWareCreateUploadOptionProduct,
    handleErrorMiddleWareMulter
} = require('../../middlewares/multer');

const routerAdminProduct = express.Router();

routerAdminProduct.get('/products', handleErrorRequest(getProductForAdmin));
routerAdminProduct.get('/product/:id', handleErrorRequest(getProductForId));
routerAdminProduct.post('/product', handleErrorRequest(createProduct));
routerAdminProduct.patch('/product', handleErrorRequest(updateProduct));

// start product-option
routerAdminProduct.post(
    '/upload-product',
    middleWareCreateUploadOptionProduct,
    handleErrorRequest(createColorProduct)
);
routerAdminProduct.delete(
    '/product/option/:optionId',
    handleErrorRequest(deleteOptionProduct)
);
routerAdminProduct.patch(
    '/product/delete-upload-option/',
    handleErrorRequest(deleteUploadOptionProduct)
);
routerAdminProduct.patch(
    '/product/add-upload-option/:optionId',
    handleErrorMiddleWareMulter(middleWareUpdateMediaUrlOptionProduct),
    handleErrorRequest(addUploadOptionProduct)
);
routerAdminProduct.patch(
    '/product/option/',
    handleErrorRequest(updateOptionProduct)
);
routerAdminProduct.patch(
    '/product/delete-size-amount-option/',
    handleErrorRequest(deleteSizeAmountOption)
);
routerAdminProduct.patch(
    '/product/add-size-amount-option/',
    handleErrorRequest(addSizeAmountOption)
);
routerAdminProduct.patch(
    '/product/update-size-amount-option/',
    handleErrorRequest(updateSizeAmountOptionProduct)
);
routerAdminProduct.patch(
    '/product/update-mediaUrl',
    handleErrorRequest(updateMediaUrlOption)
);
routerAdminProduct.post(
    '/product/meta-seo',
    handleErrorRequest(createMetaSeoProduct)
);
routerAdminProduct.get(
    '/product/meta-seo/:productId',
    handleErrorRequest(getMetaSeoProduct)
);
routerAdminProduct.patch(
    '/product/meta-seo',
    handleErrorRequest(updateMetaSeoProduct)
);
module.exports = routerAdminProduct;
