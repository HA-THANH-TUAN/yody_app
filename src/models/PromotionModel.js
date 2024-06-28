const Joi = require('joi');
const { customObjectId } = require('../utils/customJoi');

const promotionColection = mongDb().collection('promotion');
class PromotionModel {
    static async createPromotion() {
        const validateSchema = Joi.object({
            productId: customObjectId.objectId(),
            sale: Joi.string(),
            typeSale: Joi.string().valid('hard', 'none', 'percent'),
            amount: Joi.number(),
            start: Joi.date(),
            end: Joi.date()
        });
    }
}
