const { CREATED, OK } = require('../../core/handleSuccess');
const { schemaUserAddress } = require('../../models/UserModel');
const {
    getProfile,
    createUserAddress,
    editUserAddress
} = require('../../services/web/UserService');
const { hanldeValidateSchema } = require('../../utils/common');
const { customObjectIdString } = require('../../utils/customJoi');

class UserController {
    async getProfile(req, res) {
        const userId = req.userId;
        const result = await getProfile(userId);
        new CREATED(result).send(res);
    }
    async createUserAddress(req, res) {
        const userId = req.userId;
        const data = req.body;
        const result = await createUserAddress({ userId, ...data });
        new CREATED(result).send(res);
    }
    async editUserAddress(req, res) {
        const schemaEditUserAddress = schemaUserAddress
            .append({
                id: customObjectIdString.objectId().required()
            })
            .fork(
                [
                    'fullName',
                    'phone',
                    'company',
                    'hamlet',
                    'ward',
                    'district',
                    'province',
                    'isDefault'
                ],
                (schema) => schema.optional()
            )
            .fork(['userId'], (schema) => schema.optional().allow(null))
            .min(2);
        const dataValidate = hanldeValidateSchema(
            req.body,
            schemaEditUserAddress,
            422
        );
        const userId = req.userId;
        await editUserAddress(userId, dataValidate);
        new OK().send(res);
    }
}

module.exports = new UserController();
