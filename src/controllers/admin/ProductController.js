const Joi = require('joi');
const { Unprocessable } = require('../../core/handleError');
const { OK, CREATED } = require('../../core/handleSuccess');
const {
    createProduct,
    createColorProduct,
    getProductForAdmin,
    getProductForId,
    deleteUploadOptionProduct,
    deleteOptionProduct,
    updateSizeAmountOptionProduct,
    updateOptionProduct,
    deleteSizeAmountOption,
    addSizeAmountOption,
    updateProduct,
    addUploadOptionProduct,
    createMetaSeoProduct,
    getMetaSeoProduct,
    updateMetaSeoProduct,
    updateMediaUrlOption
} = require('../../services/admin/ProductService');
const { customObjectIdString } = require('../../utils/customJoi');
const { genSlug, hanldeValidateSchema } = require('../../utils/common');
const { ObjectId } = require('mongodb');
const { schemaMetaSeoProduct } = require('../../models/ProductModel');
const { unlink } = require('node:fs');
class ProductController {
    async createProduct(req, res) {
        const dataBody = req.body;
        const validateSchema = Joi.object({
            name: Joi.string().required(),
            slug: Joi.string().default(genSlug(dataBody.name)).required(),
            price: Joi.number().required(),
            detail: Joi.string().allow(null).min(0),
            categoryId: customObjectIdString.objectId(),
            status: Joi.valid(1, 0).required()
        });
        const { error, value } = validateSchema.validate(dataBody);
        if (error) {
            console.log("error::::",error)
            throw new Unprocessable();
        }
        const result = await createProduct(value);
        new OK(result).send(res);
    }

    async createColorProduct(req, res) {
        const socketProduct = req.socketProduct;
        const dataBody = req.body;
        dataBody.sizeAmounts = JSON.parse(dataBody.sizeAmounts);
        const filesUpload = req.files;
        const validateSchema = Joi.object({
            productId: customObjectIdString.objectId(),
            sizeAmounts: Joi.array().items(
                Joi.object({
                    id: customObjectIdString.objectId(),
                    size: Joi.string(),
                    amount: Joi.number(),
                    order: Joi.allow(0, 1)
                })
            ),
            orderFiles : Joi.array().items(
                Joi.string().custom((value)=> Number(value))
            ),
            order: Joi.number().integer().min(0),
            colorCode: Joi.string(),
            color: Joi.string()
        });
        const removeImage = ()=>{
            for (const file of filesUpload) {
                const path = file.path;
                unlink(path, () => {
                    console.log('===>Del:::', path);
                });
            }
        }
        const value = hanldeValidateSchema(dataBody , validateSchema, undefined ,removeImage);
        const result = await createColorProduct(
            value,
            filesUpload,
            socketProduct
        );
        new OK({
            ...result,
            status: 'pending'
        }).send(res);
    }
    async getProductForAdmin(req, res) {
        const query = req.query;

        const validateSchemaPrams = Joi.object({
            page: Joi.string()
                .allow(null)
                .regex(/^(?!0+$)\d+$/)
                .default('1'),
            limit: Joi.string()
                .allow(null)
                .regex(/^(?!0+$)\d+$/)
                .default('20'),
            minPrice: Joi.string()
                .allow(null)
                .regex(/^(?!0+$)\d+$/),
            maxPrice: Joi.string()
                .allow(null)
                .regex(/^(?!0+$)\d+$/),
            search: Joi.string().allow(null),
            categories: Joi.string().custom((value, helpers) => {
                if(value==="all"){
                    return undefined
                }
                const categoriesId = value.split(',');
                const validateValue = hanldeValidateSchema(
                    categoriesId,
                    Joi.array().items(customObjectIdString.objectId())
                );
                return validateValue;
            }),
            category: Joi.string().valid('has', 'none', "all"),
            description: Joi.string().valid('has', 'none', "all"),
            categoryStatus: Joi.string().valid('1', '0',"all"),
            status: Joi.string().valid('2', '1', '0' , "all"),
            option: Joi.string().valid('has', 'none', "all"),
            seo: Joi.string().valid('has', 'none',"all"),
            soldOut: Joi.string().valid('has', 'none', "all")
        });
        const value = hanldeValidateSchema(query, validateSchemaPrams, 422);
        if (value.categories) {
            value.categoriesId = value.categories;
            delete value.categories;
        }
        const result = await getProductForAdmin(value);
        new OK(result).send(res);
    }
    async getProductForId(req, res) {
        const params = req.params;
        const validateSchemaParams = Joi.object({
            id: customObjectIdString.objectId()
        });
        const { value, error } = validateSchemaParams.validate(params);
        if (error) {
            throw new Unprocessable();
        }
        const result = await getProductForId(value.id);
        new OK(result).send(res);
    }
    async deleteOptionProduct(req, res) {
        const optionId = req.params.optionId;
        const value = hanldeValidateSchema(optionId, customObjectIdString.objectId())
        await deleteOptionProduct(value);
        new OK().send(res);
    }
    async deleteUploadOptionProduct(req, res) {
        const body = req.body;
        const validateSchemaParams = Joi.object({
            optionId: customObjectIdString.objectId(),
            uploadId: customObjectIdString.objectId()
        });
        const { value, error } = validateSchemaParams.validate(body);
        if (error) {
            throw new Unprocessable();
        }
        await deleteUploadOptionProduct(value);
        new OK().send(res);
    }

    async addUploadOptionProduct(req, res) {
        const socketProduct = req.socketProduct;
        const params = req.params;
        const orders = Array.isArray(req.body.orders) ? req.body.orders  : [req.body.orders];
        const files = Array.isArray(req.files) ?  req.files : [req.files] ;
        const validateSchemaParamsAndBody = Joi.object({
            optionId: customObjectIdString.objectId(),
            orders: Joi.array().items(Joi.string().min(0).custom((value)=>isNaN(Number(value)) ? 0 : Number(value))),

        }).max(2);
        const value = hanldeValidateSchema({...params, orders: orders} ,validateSchemaParamsAndBody)
        await addUploadOptionProduct(value.optionId, {files, orders}, socketProduct);
        new OK().send(res);
    }
    async updateSizeAmountOptionProduct(req, res) {
        const body = req.body;
        const validateSchemaParams = Joi.object({
            optionId: customObjectIdString.objectId(),
            sizeAmounts: Joi.array().required().min(0).items(Joi.object({
                id: customObjectIdString.objectId().required(),
                size: Joi.string().allow(null),
                amount: Joi.number().allow(null),
                order: Joi.number().min(0).allow(null)
            }))
        });
        const value = hanldeValidateSchema(body, validateSchemaParams)
        await updateSizeAmountOptionProduct(value);
        new OK().send(res);
    }
    async updateOptionProduct(req, res) {
        const body = req.body;
        console.log('body:::', body);
        const validateSchemaParams = Joi.object({
            optionId: customObjectIdString.objectId(),
            updateData: Joi.object({
                color: Joi.string().allow(null),
                colorCode: Joi.string().allow(null),
                order: Joi.number().allow(null),
            }).min(1)
        });
        const value = hanldeValidateSchema(body , validateSchemaParams)
        await updateOptionProduct(value);
        new OK().send(res);
    }
    async deleteSizeAmountOption(req, res) {
        const body = req.body;
        const validateSchema = Joi.object({
            optionId: customObjectIdString.objectId(),
            sizeAmountIds : Joi.array().items(customObjectIdString.objectId()).min(0).required()
        });
        
        const value = hanldeValidateSchema(body, validateSchema);
        
        await deleteSizeAmountOption(value);
        new OK().send(res);
    }
    async addSizeAmountOption(req, res) {
        const body = req.body;
        const validateSchemaParams = Joi.object({
            optionId: customObjectIdString.objectId(),
            sizeAmounts: Joi.array()
                .items(
                    Joi.object({
                        size: Joi.string(),
                        amount: Joi.number().min(0),
                        order: Joi.number().min(0)
                    })
                )
                .min(1)
        });
        const value = hanldeValidateSchema(body, validateSchemaParams);
        await addSizeAmountOption(value);
        new OK().send(res);
    }
    async updateProduct(req, res) {
        const body = req.body;
        const validateSchemaParams = Joi.object({
            id: customObjectIdString.objectId(),
            name: Joi.string(),
            slug: Joi.string(),
            price: Joi.number(),
            detail: Joi.string().min(0),
            categoryId: Joi.string().min(0).custom((value, helpers) => {
                if(value===""){
                    return null
                }
                const validateValue = hanldeValidateSchema(
                    value,
                    (customObjectIdString.objectId())
                );
                return validateValue;
            }),
            status: Joi.valid('0', '1')
        }).min(2);
        const value = hanldeValidateSchema(body, validateSchemaParams);
        await updateProduct(value);
        new OK().send(res);
    }
    async updateMediaUrlOption (req, res){
        const value = hanldeValidateSchema( req.body, Joi.object({
            optionId: customObjectIdString.objectId().required(),
            mediaUrls: Joi.array().items(Joi.object({
                id: customObjectIdString.objectId().required(),
                order: Joi.number().default(0)
            }).max(2))
        }))
        await updateMediaUrlOption(value);
        return new OK().send(res);

    }
    async createMetaSeoProduct(req, res) {
        const body = req.body;
        const { value, error } = schemaMetaSeoProduct
            .append({
                productId: customObjectIdString.objectId()
            })
            .fork(['_id'], (schema) => schema)
            .validate(body);
        if (error) {
            throw new Unprocessable();
        }
        await createMetaSeoProduct(value);
        new CREATED().send(res);
    }
    async getMetaSeoProduct(req, res) {
        const  schemaValidate = Joi.object({
            productId: customObjectIdString.objectId()
        })
        const value = hanldeValidateSchema(req.params ,schemaValidate);
        const result = await getMetaSeoProduct(value.productId);
        new OK(result).send(res);
    }
    async updateMetaSeoProduct(req, res) {
        const body = req.body;
        const customSchema = schemaMetaSeoProduct
            .fork(['_id'], (schema) => schema)
            .append({
                id: customObjectIdString.objectId().required()
            })
        const value = hanldeValidateSchema(body ,customSchema);
        await updateMetaSeoProduct(value);
        new OK().send(res);
    }
}

module.exports = new ProductController();
