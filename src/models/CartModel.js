const Joi = require('joi');
const { customObjectId } = require('../utils/customJoi');
const { BadRequest } = require('../core/handleError');
const { mongDb } = require('../configurations/mongodbConfig');
const { ObjectId } = require('mongodb');

const schemaCartModelItem = Joi.object({
    _id: customObjectId.objectId().required(),
    productId: customObjectId.objectId().required(),
    optionId: customObjectId.objectId().required(),
    sizeId: customObjectId.objectId().required(),
    amount: Joi.number().required()
});
const schemaCartModel = Joi.object({
    _id: customObjectId.objectId().required(),
    products: Joi.array().items(schemaCartModelItem).min(0)
});
const cartColection = mongDb().collection('carts');

class CartModel {
    static async getCart(_userId) {
        return await cartColection.findOne({ _id: _userId });
    }
    static async getProductCart(_userId) {
        return await cartColection
            .aggregate([
                { $match: { _id: _userId } },
                { $unwind: '$products' },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'products.productId',
                        foreignField: '_id',
                        as: 'products.product'
                    }
                },
                { $unwind: '$products.product' },
                {
                    $lookup: {
                        from: 'product_colors',
                        localField: 'products.sizeId',
                        foreignField: 'sizeAmounts._id',
                        as: 'products.option'
                    }
                },
                { $unwind: '$products.option' },

                {
                    $project: {
                        _id: 1,
                        'products.option': {
                            $mergeObjects: [
                                '$products.option',
                                {
                                    sizeAmounts: {
                                        $arrayElemAt: [
                                            {
                                                $filter: {
                                                    input: '$products.option.sizeAmounts',
                                                    as: 'sizeAmount',
                                                    cond: {
                                                        $eq: [
                                                            '$$sizeAmount._id',
                                                            '$products.sizeId'
                                                        ]
                                                    }
                                                }
                                            },
                                            0
                                        ]
                                    }
                                }
                            ]
                        },
                        'products.product._id': 1,
                        'products.product.name': 1,
                        'products.product.slug': 1,
                        'products.product.price': 1
                    }
                }

                // { "$unwind": "$products.option.sizeAmounts" },
                // {"$unset" : ["products.productId", "products.optionId", "products.sizeId"] }
            ])
            .toArray();
    }
    static async setAmountCartItem(_userId, _cartProductId, amount) {
        return await cartColection.updateOne(
            {
                _id: _userId,
                'products._id': _cartProductId
            },
            {
                $inc: {
                    'products.$.amount': amount
                }
            }
        );
    }

    static async createCart(data) {
        console.log(data);
        const { value, error } = schemaCartModel.validate(data);
        if (error) {
            throw new BadRequest();
        }
        await cartColection.insertOne(value);
        return value;
    }
    static async addProductCart(_id, data) {
        console.log('data::::', data);
        await cartColection.updateOne(
            { _id },
            {
                $push: {
                    products: data
                }
            }
        );
    }
    static async removeCart(_cartId) {
        return await cartColection.deleteOne({ _id: _cartId });
    }
    static async changeAmountProductCart(_cartId, amount) {
        return await cartColection.deleteOne(
            { _id: _cartId },
            { $set: { amount: amount } }
        );
    }
}

module.exports = {
    CartModel,
    schemaCartModelItem,
    schemaCartModel,
    cartColection
};
