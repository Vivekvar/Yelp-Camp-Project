const express = require('express');
// mergeParams takes params from the main route from app.js also. Like campground ID from there.
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const reviews = require('../controllers/reviews');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');

router.post('/', isLoggedIn, validateReview, wrapAsync(reviews.addReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reviews.deleteReview))

module.exports = router;