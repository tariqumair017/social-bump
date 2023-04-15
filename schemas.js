const Joi = require("joi");
const joi = require("joi");

module.exports.walletSchema = joi.object({
    data: joi.object({
        name: joi.string().required(),
        location: joi.string().required(),
        price: joi.number().required().min(0),
        // images: joi.string().required(),
        description: joi.string().required()
    }).required(),
    deleteImages: joi.array()
});

module.exports.commentSchema = joi.object({
    comment: joi.object({
        text: joi.string().required(), 
        rating: joi.number().required().min(1).max(5)
    }).required() 
});