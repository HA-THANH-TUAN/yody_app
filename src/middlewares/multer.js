const multer = require('multer');
const { ObjectId } = require('mongodb');
const { customObjectIdString } = require('../utils/customJoi');
const { productColorColection } = require('../models/ProductModel');
const { Unprocessable } = require('../core/handleError');

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public');
    },
    filename: function (req, file, cb) {
        // Rename the file here
        const uniqueSuffix = Date.now();
        const extension = file.originalname.split('.').pop(); // Get file extension
        const newFileName = uniqueSuffix + '.' + extension;
        cb(null, newFileName);
    }
});
const limits = {
    fileSize: 1024 * 1024 * 40
};

// Create multer instance
const upload = multer({ storage: storage, limits: limits });
const handleErrorMiddleWareMulter = (cb) => {
    return (req, res, next) => {
        cb(req, res, next).catch((error) => {
            const { message, status } = error;

            res.status(status).json({
                status: status,
                message: message
            });
        });
    };
};
const middleWareCreateUploadOptionProduct = async (req, res, next) => {
    upload.array('files', 6)(req, res, next);
};
const middleWareUpdateMediaUrlOptionProduct = async (req, res, next) => {
    const optionId = req.params.optionId;
    const { value, error } = customObjectIdString.objectId().validate(optionId);
    if (error) {
        throw new Unprocessable();
    }
    const result = await productColorColection
        .aggregate([
            {
                $match: {
                    _id: new ObjectId(value)
                }
            },
            { $limit: 1 },
            {
                $project: {
                    _id: 0,
                    mediaUrlsCount: { $size: '$mediaUrls' }
                }
            }
        ])
        .toArray();
    if (!result[0]) {
        throw new Unprocessable();
    }
    const mediaUrlsCount = result[0]?.mediaUrlsCount;
    const max = 6 - mediaUrlsCount;
    upload.array('files', max)(req, res, next);
};

module.exports = {
    middleWareCreateUploadOptionProduct,
    handleErrorMiddleWareMulter,
    middleWareUpdateMediaUrlOptionProduct
};
