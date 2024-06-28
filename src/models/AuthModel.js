const Joi = require('joi');
const { clientMongo, mongDb } = require('../configurations/mongodbConfig');

class AuthModel {
    async register(email, password, role = 'user') {
        const usersCollection = mongDb().collection('users');
        const result = await usersCollection.insertOne({
            email,
            password,
            role
        });
        console.log(result);
        // const ruleValidate  = Joi.object({
        //     email : Joi.string().email(),
        //     password: Joi.string()
        // });
        // const resultValidate = ruleValidate.validate(data);
        // if(resultValidate.error){
        //     throw new Bad
        // }
    }
}

module.exports = new AuthModel();
