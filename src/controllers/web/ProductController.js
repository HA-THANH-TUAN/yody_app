const { getProductForCategory } = require('../../services/web/ProductService');
const { Unprocessable } = require('../../core/handleError');
const { OK } = require('../../core/handleSuccess');
const Joi = require('joi');
const { hanldeValidateSchema } = require('../../utils/common');

const validateSchema = Joi.object({
    cs: Joi.string(),
    srt: Joi.string().valid('default',
    'newest',
    'bestSeller',
    'nAsc',
    'nDesc',
    'prAsc',
    'prDesc').default("default"),
    mxp: Joi.number().min(0).integer(),
    mnp: Joi.number().min(0).integer(),
    page: Joi.number().min(1).integer().default(1),
});
class ProductController {
    async getProductForCategory(req, res) {
        const query = req.query;
        const value = hanldeValidateSchema(query, validateSchema)
        if (value.mnp > value.mxp) {
            throw new Unprocessable();
        }
        const result = await getProductForCategory(value);
        new OK(result).send(res);
    }
}

module.exports = new ProductController();
