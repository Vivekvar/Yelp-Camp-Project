// Javascript Validator for Schema
const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

// To help remove cross site scripting
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.campgroundSchema = Joi.object({
    // because all properties are under campground object
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    // because all properties are under review object
    review: Joi.object({
        body: Joi.string().required().escapeHTML(),
        rating: Joi.number().required().min(0).max(5),
    }).required()
});

// Client Side Validation using forms and Server Side Validation using Joi.