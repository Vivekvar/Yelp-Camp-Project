// Javascript Validator for Schema
const Joi = require('joi');

module.exports.campgroundSchema = Joi.object({
    // because all properties are under campground object
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    // because all properties are under review object
    review: Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().required().min(0).max(5),
    }).required()
});


// Client Side Validation using forms and Server Side Validation using Joi.