const bcrypt = require('bcrypt');
require('dotenv').config();
var jwt = require('jsonwebtoken');
const { UserModel } = require('../../models/UserModel');
const { clientRedis } = require('../../configurations/redisConfig');
const { Unauthorized, BadRequest } = require('../../core/handleError');
const MailService = require('../../utils/sendMail');
const { uid } = require('uid');
const { ObjectId } = require('mongodb');
const { CartModel } = require('../../models/CartModel');
const SECRET_KEY = process.env.SECRET_KEY;
const EXPIRE_TOKEN_TIME = process.env.EXPIRE_TOKEN_TIME;
const EXPIRE_REFRESH_TOKEN_TIME = process.env.EXPIRE_REFRESH_TOKEN_TIME;
const CODE_RESET_TIME = process.env.CODE_RESET_TIME;
class AuthService {
    async login(data) {
        const email = data.email;
        const password = data.password;
        const getUser = await UserModel.getUser(null, email);
        if (getUser) {
            const passwordDb = getUser.password;
            console.time('login time');
            const resultCompare = bcrypt.compareSync(password, passwordDb);
            delete getUser.password;
            console.timeEnd('login time');

            if (resultCompare) {
                const id = getUser._id.toString();
                const payloadJWT = {
                    id: id,
                    email: getUser.email,
                    role: getUser.role
                };
                const token = jwt.sign(payloadJWT, SECRET_KEY, {
                    expiresIn: Number(EXPIRE_TOKEN_TIME)
                });
                const refreshToken = jwt.sign(payloadJWT, SECRET_KEY, {
                    expiresIn: Number(EXPIRE_REFRESH_TOKEN_TIME)
                });
                const keyRedisToken = `tokens:${id}`;
                await clientRedis.hSet(
                    keyRedisToken,
                    ...Object.entries({ refreshToken: refreshToken })
                );
                clientRedis.expire(keyRedisToken, 3600);

                return {
                    user: getUser,
                    token: token,
                    refreshToken: refreshToken
                };
            }
        }
        throw new Unauthorized('login fail');
    }

    async register(data) {
        const { fullName, email, password } = data;
        const getUser = await UserModel.getUser(null, email);
        if (getUser) {
            throw new BadRequest('This email exist');
        }
        const saltRounds = process.env.BCRYPT_SALT;
        const salt = bcrypt.genSaltSync(Number(saltRounds));
        const hassPassword = bcrypt.hashSync(password, salt);
        data.password = hassPassword;
        data.role = [1];
        const insertMongo = await UserModel.createUser(data);
        const id = insertMongo.insertedId.toString();
        await CartModel.createCart({
            _id: insertMongo.insertedId,
            products: []
        });
        const payloadJWT = {
            id: id,
            email: email,
            role: data.role
        };
        const token = jwt.sign(payloadJWT, SECRET_KEY, {
            expiresIn: Number(EXPIRE_TOKEN_TIME)
        });
        const refreshToken = jwt.sign(payloadJWT, SECRET_KEY, {
            expiresIn: Number(EXPIRE_REFRESH_TOKEN_TIME)
        });
        const keyRedisToken = `tokens:${id}`;
        await clientRedis.hSet(
            keyRedisToken,
            ...Object.entries({ refreshToken: refreshToken })
        );
        clientRedis.expire(keyRedisToken, 3600);
        delete data.password;
        return {
            user: data,
            token: token,
            refreshToken: refreshToken
        };
    }

    async resetPassword(data) {
        const email = data.email;
        const user = await UserModel.getUser(undefined, email);
        if (!user) {
            throw new BadRequest('This email is not registered !');
        }
        const idRedis = `codeResetPassword:${user._id.toString()}`;
        const code = uid(8);
        const resultRedis = await clientRedis.set(idRedis, code, {
            EX: Number(CODE_RESET_TIME)
        });
        if (resultRedis !== 'OK') {
            throw new BadRequest();
        }

        new MailService().send({
            to: user.email,
            text: 'code ::: ' + code
        });
        return {
            userId: user._id.toString(),
            code: code
        };
    }
    async verifyResetPassword(data) {
        const userId = data.userId;
        const code = data.code;
        const resultRedis = await clientRedis.get(
            `codeResetPassword:${userId}`
        );
        if (resultRedis !== code) {
            throw new BadRequest('Incorrect code');
        }
        const newPassword = uid(10);
        const saltRounds = process.env.BCRYPT_SALT;
        const salt = bcrypt.genSaltSync(Number(saltRounds));
        const hashPassword = bcrypt.hashSync(newPassword, salt);
        clientRedis.del(`codeResetPassword:${userId}`);
        const user = await UserModel.changePassword(
            new ObjectId(userId),
            hashPassword
        );
        await new MailService().send({
            to: user.email,
            text: 'password ::: ' + newPassword
        });
    }
    async refreshToken(data) {
        const refreshToken = data.refreshToken;
        const decode = jwt.decode(refreshToken);
        if (!decode) {
            throw new BadRequest();
        }
        const keyRedis = `tokens:${decode.id}`;

        const refreshTokenRedis = await clientRedis.hGet(
            keyRedis,
            'refreshToken'
        );
        if (refreshTokenRedis !== refreshToken) {
            throw new BadRequest();
        }

        console.log(refreshTokenRedis);
    }
}

module.exports = new AuthService();
