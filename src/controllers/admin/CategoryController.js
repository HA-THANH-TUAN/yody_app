const Joi = require('joi');
const {
    createCategory,
    updateCategory,
    getCategories,
    deleteService,
    getCategory
} = require('../../services/admin/CategoryService');
const { OK } = require('../../core/handleSuccess');
const { customObjectIdString } = require('../../utils/customJoi');
const { hanldeValidateSchema } = require('../../utils/common');

class CategoryController {
    async createCategory(req, res) {
        const dataBody = req.body;
        const validateSchema = Joi.object({
            name: Joi.string().required(),
            slug: Joi.string().required(),
            status: Joi.string().allow('0', '1').required(),
            parentId: Joi.string().length(24).allow(null)
        }).min(2);
        const resultValidate = hanldeValidateSchema(dataBody, validateSchema);
        const resultService = await createCategory(resultValidate);
        new OK(resultService).send(res);
    }
    async updateCategory(req, res) {
        const dataBody = req.body;
        const validateSchema = Joi.object({
            id: customObjectIdString.objectId().required(),
            name: Joi.string(),
            slug: Joi.string(),
            status: Joi.number().valid(0, 1),
            parentId: Joi.string().min(0).invalid(Joi.ref('id'))
        }).min(2);
        const resultValidate = hanldeValidateSchema(dataBody, validateSchema);
        const resultService = await updateCategory(resultValidate);
        new OK(resultService).send(res);
    }
    async getCategories(req, res) {
        const result = await getCategories();
        new OK(result).send(res);
    }
    async getCategory(req, res) {
        const id = req.params?.id;
        const validateSchema = customObjectIdString.objectId();
        const value = hanldeValidateSchema(id, validateSchema);
        const result = await getCategory(value);
        new OK(result).send(res);
    }
    async deleteCategory(req, res) {
        const deleteId = hanldeValidateSchema(
            req.params.id,
            customObjectIdString.objectId().required()
        );
        await deleteService(deleteId);
        new OK().send(res);
    }
}

module.exports = new CategoryController();
