const { Unauthorized } = require('../core/handleError');
const verifyToken = require('../utils/verifyToken');

const comfirmToken = async (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const result = verifyToken(token);
    if (result.status) {
        req.role = result.infor.role;
        req.userId = result.infor.id;
        next();
    } else {
        throw new Unauthorized(
            result.message === 'Expired' ? 'Expired' : undefined
        );
    }
};

module.exports = { comfirmToken };
