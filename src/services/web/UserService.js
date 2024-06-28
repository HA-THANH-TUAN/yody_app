const { ObjectId } = require('mongodb');
const { UserModel } = require('../../models/UserModel');

class UserService {
    async getProfile(userId) {
        return await UserModel.getProfile(new ObjectId(userId));
    }
    async createUserAddress(data) {
        data.userId = new ObjectId(data.userId);
        return await UserModel.createUserAddress(data);
    }
    async editUserAddress(userId, data) {
        data._id = new ObjectId(data.id);
        delete data.id;
        await UserModel.editUserAddress(new ObjectId(userId), data);
    }
}

module.exports = new UserService();
