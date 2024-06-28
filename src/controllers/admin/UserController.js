const { CREATED } = require('../../core/handleSuccess');

class UserControler {
    async getProfile(req, res) {
        const userId = req.userId;
        console.log('userId:::', userId);
        new CREATED().send(res);
    }
}

module.exports = new UserControler();
