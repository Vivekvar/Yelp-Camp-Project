const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.addReview = async (req, res) => {
    const { id } = req.params;
    const { body, rating } = req.body.review;
    const review = new Review({ body, rating });
    review.author = req.user._id;
    const campground = await Campground.findById(id);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully created a new review!');
    res.redirect(`/campgrounds/${ id }`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    // will remove/pull a matching instance of reviewId in reviews.
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/campgrounds/${ id }`);
}