const express = require('express');
const { mongDb } = require('../configurations/mongodbConfig');
const Joi = require('joi');
const router = express.Router();

const schema = Joi.object({
    _id: Joi.string().required(),
    options: Joi.array()
        .items(
            Joi.object({
                optionId: Joi.string(),
                name: Joi.string()
            })
        )
        .min(0)
});
// test::
router.get('/test', async (req, res) => {
    const body = req.body;
    const { value, error } = schema.validate(body, {
        context: { pick: ['_id', 'options'] }
    });
    console.log({ value, error });
    res.json(value);
});

module.exports = router;
