const Joi = require('joi');
const { mongDb } = require('../configurations/mongodbConfig');
const REGEX = require('../utils/regex');
const { hanldeValidateSchema } = require('../utils/common');
const { customObjectId } = require('../utils/customJoi');
const userCollection = mongDb().collection('users');
const userAddressCollection = mongDb().collection('user_addresses');

const schemaUserAddress = Joi.object({
    userId: customObjectId.objectId().required(),
    fullName: Joi.string().required(),
    phone: Joi.string().required(),
    company: Joi.string().required(),
    hamlet: Joi.string().required(),
    ward: Joi.string().required(),
    district: Joi.string().required(),
    province: Joi.string().required(),
    isDefault: Joi.boolean().required()
}).required();
const schemaUser = Joi.object({
    fullName: Joi.string().regex(REGEX.fullName).required(),
    phone: Joi.string().regex(REGEX.phone).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    status: Joi.string()
        .valid('active', 'unActive')
        .default('active')
        .required(),
    role: Joi.string().default([1]).required()
}).required();
class UserModel {
    static async createUser(data) {
        const dataValidate = hanldeValidateSchema(data, schemaUser, 401);
        const result = await userCollection.insertOne(dataValidate);
        return result;
    }
    static async getUser(_id, email) {
        const users = userCollection.findOne(
            _id ? { _id: _id } : { email: email }
        );
        return users;
    }
    static async changePassword(_id, password) {
        return await userCollection.findOneAndUpdate(
            { _id },
            { $set: { password: password } }
        );
    }
    static async getProfile(_id) {
        const users = await userCollection.findOne(
            { _id: _id },
            { projection: { password: 0, role: 0, _id: 0 } }
        );
        return users;
    }
    static async createUserAddress(_data) {
        const dataValidate = hanldeValidateSchema(
            _data,
            schemaUserAddress,
            401
        );
        if (_data.isDefault) {
            await userAddressCollection.updateOne(
                { userId: _data.isDefault },
                { $set: { isDefault: false } }
            );
        }
        const insertResult =
            await userAddressCollection.insertOne(dataValidate);
        delete _data.userId;
        return {
            id: insertResult.insertedId,
            ..._data
        };
    }
    static async editUserAddress(_userId, dataEdit) {
        const { _id, ...dataUpdate } = dataEdit;
        const updateOperator = Object.keys(dataUpdate).reduce((prev, key) => {
            prev[key] = dataUpdate[key];
            return prev;
        }, {});
        if (dataUpdate.isDefault) {
            await userAddressCollection.updateOne(
                { userId: dataUpdate.isDefault },
                { $set: { isDefault: false } }
            );
        }
        await userAddressCollection.updateOne(
            { _id: _id },
            { $set: updateOperator }
        );
    }
}

module.exports = { UserModel, schemaUserAddress };
