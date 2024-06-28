const Joi = require('joi');
const {
    addProductCart,
    getProductCart
} = require('../../services/web/CartService');
const { customObjectIdString } = require('../../utils/customJoi');
const { Unprocessable } = require('../../core/handleError');
const { CREATED, OK } = require('../../core/handleSuccess');

const schemValidatCreateCart = Joi.object({
    productId: customObjectIdString.objectId().required(),
    optionId: customObjectIdString.objectId().required(),
    sizeId: customObjectIdString.objectId().required(),
    amount: Joi.number().required()
}).max(7);
class CartController {
    async addProductCart(req, res) {
        const body = req.body;
        const userId = req.userId;
        const { value, error } = schemValidatCreateCart.validate(body);
        if (error) {
            throw new Unprocessable();
        }
        const result = await addProductCart(userId, value);
        new CREATED(result).send(res);
    }
    async getProductCart(req, res) {
        const userId = req.userId;
        const result = await getProductCart(userId);
        new OK(result).send(res);
    }
}

module.exports = new CartController();
