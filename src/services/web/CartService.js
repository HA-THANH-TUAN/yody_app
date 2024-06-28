const { ObjectId } = require('mongodb');
const { CartModel, cartColection } = require('../../models/CartModel');
const UserModel = require('../../models/UserModel');
const { BadRequest } = require('../../core/handleError');
const { uid } = require('uid');
const {
    productColorColection,
    ProductModel
} = require('../../models/ProductModel');

class CartService {
    async getProductCart(userId) {
        const _id = new ObjectId(userId);
        const result = await CartModel.getProductCart(_id);
        return result;
    }
    async addProductCart(userId, dataAddCart) {
        const _userId = new ObjectId(userId);
        const checkCart = await CartModel.getCart(_userId);
        if (!checkCart) {
            await CartModel.createCart({
                _id: _userId,
                products: []
            });
        }
        const checkProduct = await ProductModel.getProduct(
            new ObjectId(dataAddCart.productId),
            undefined,
            1
        );
        if (!checkProduct) {
            throw new BadRequest();
        }
        const productCart = checkProduct.productColors.find(
            (proColor) =>
                proColor._id.toString() === dataAddCart.optionId.toString()
        );
        if (!productCart) {
            throw new BadRequest("This color of product doesn't exist");
        }
        const sizeProduct = productCart.sizeAmounts.find(
            (sizeAmount) =>
                sizeAmount._id.toString() === dataAddCart.sizeId.toString()
        );
        if (!sizeProduct) {
            throw new BadRequest("This size of product doesn't exist");
        }
        const amountInventory = sizeProduct.amount;
        if (amountInventory === 0) {
            throw new BadRequest('This option product is sold out');
        }
        dataAddCart.productId = new ObjectId(dataAddCart.productId);
        dataAddCart.optionId = new ObjectId(dataAddCart.optionId);
        dataAddCart.sizeId = new ObjectId(dataAddCart.sizeId);
        const cartItem = (checkCart?.products ?? []).find(
            ({ productId, optionId, sizeId }) =>
                productId.toString() === dataAddCart.productId.toString() &&
                sizeId.toString() === dataAddCart.sizeId.toString() &&
                optionId.toString() === dataAddCart.optionId.toString()
        );
        if (cartItem) {
            const _cartProductItemId = cartItem._id;
            const amountBody = dataAddCart.amount;
            const amountPres = cartItem.amount;
            const valueAfterAdd = amountPres + amountBody;
            if (valueAfterAdd <= 0) {
                throw new BadRequest();
            }
            if (valueAfterAdd > amountInventory) {
                throw new BadRequest('The number of product is enough');
            }
            await CartModel.setAmountCartItem(
                _userId,
                _cartProductItemId,
                amountBody
            );
            return {
                ...dataAddCart,
                amount: valueAfterAdd,
                _id: cartItem._id
            };
        } else {
            const cartProductItemId = new ObjectId(uid(24));
            if (dataAddCart.amount <= 0) {
                throw new BadRequest();
            }
            if (dataAddCart.amount > amountInventory) {
                throw new BadRequest('The number of product is enough');
            }
            dataAddCart._id = cartProductItemId;
            await CartModel.addProductCart(_userId, dataAddCart);
            return dataAddCart;
        }
    }
}
module.exports = new CartService();
