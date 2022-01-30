const express = require('express');

// mergeParams takes params from the main route from app.js also. Like campground ID from there.
const router = express.Router({ mergeParams: true });

const expressError = require('../utils/expressError');
const wrapAsync = require('../utils/wrapAsync');

const Campground = require('../models/campground');
const Review = require('../models/review');

const { reviewSchema } = require('../schemaValidator');

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        // error.details is an array.
        const msg = error.details.map(e => e.message).join(',');
        throw new expressError(msg, 400); 
    }
    else {
        next();
    }
}

router.post('/', validateReview, wrapAsync(async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const { body, rating } = req.body.review;
    const review = new Review({ body, rating });
    const campground = await Campground.findById(id);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${ id }`);
}))

router.delete('/:reviewId', wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    const campground = await Campground.findById(id);
    // will remove/pull a matching instance of reviewId in reviews.
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${ id }`);
}))

module.exports = router;