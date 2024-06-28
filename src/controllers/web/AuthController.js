const Joi = require('joi');
const {
    register,
    login,
    resetPassword,
    verifyResetPassword,
    refreshToken
} = require('../../services/web/AuthService');
const { Unprocessable, BadRequest } = require('../../core/handleError');
const { CREATED, OK } = require('../../core/handleSuccess');
const { customObjectIdString } = require('../../utils/customJoi');

class AuthController {
    async login(req, res) {
        const schemaValidate = Joi.object({
            email: Joi.string().required().email(),
            password: Joi.string().required()
        }).length(2);
        const dataBody = req.body;
        const resultValidate = schemaValidate.validate(dataBody);
        if (resultValidate.error) {
            throw new BadRequest();
        }
        const result = await login(dataBody);
        new OK(result).send(res);
    }
    async register(req, res) {
        const schemaValidate = Joi.object({
            fullName: Joi.string().required(),
            email: Joi.string().required().email(),
            phone: Joi.string().required(),
            password: Joi.string().required()
        }).length(4);

        const dataBody = req.body;
        const resultValidate = schemaValidate.validate(dataBody);
        if (resultValidate.error) {
            throw new Unprocessable();
        }
        const result = await register(dataBody);
        new CREATED(result).send(res);
    }

    async resetPassword(req, res) {
        const schemaValidate = Joi.object({
            email: Joi.string().required().email()
        }).length(1);
        const dataBody = req.body;
        const resultValidate = schemaValidate.validate(dataBody);
        if (resultValidate.error) {
            throw new Unprocessable();
        }
        const resultService = await resetPassword(resultValidate.value);
        new OK(resultService).send(res);
    }

    async verifyResetPassword(req, res) {
        const schemaValidate = Joi.object({
            code: Joi.string().required().length(8),
            userId: customObjectIdString.objectId().required()
        }).length(2);
        const dataBody = req.body;
        const resultValidate = schemaValidate.validate(dataBody);
        if (resultValidate.error) {
            throw new Unprocessable();
        }
        await verifyResetPassword(dataBody);

        new OK().send(res);
    }

    async refreshToken(req, res) {
        const schemaValidate = Joi.object({
            refreshToken: Joi.string().required()
        }).length(1);
        const dataBody = req.body;
        const resultValidate = schemaValidate.validate(dataBody);
        if (resultValidate.error) {
            throw new Unprocessable();
        }
        const result = await refreshToken(dataBody);

        new OK(result).send(res);
    }
}

module.exports = new AuthController();
