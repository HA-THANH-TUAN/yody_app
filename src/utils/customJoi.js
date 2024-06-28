const Joi = require('joi');
const { ObjectId } = require('mongodb');

const customObjectId = Joi.extend((joi) => ({
    type: 'objectId',
    messages: {
        'objectId.invalid': '{{#label}} must be a valid MongoDB ObjectID'
    },
    validate(value, helpers) {
        if (!(ObjectId.isValid(value) && typeof value === 'object')) {
            return { value, errors: helpers.error('objectId.invalid') };
        }
    }
}));
const customObjectIdString = Joi.extend((joi) => ({
    type: 'objectId',
    messages: {
        'objectId.invalid': '{{#label}} must be a valid MongoDB ObjectID'
    },
    validate(value, helpers) {
        if (!(ObjectId.isValid(value) && typeof value == 'string')) {
            return { value, errors: helpers.error('objectId.invalid') };
        }
    }
}));

module.exports = { customObjectId, customObjectIdString };
