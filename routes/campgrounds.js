const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const Campground = require('../models/campground');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');

// READ
router.get('/', wrapAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))

// CREATE
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})
router.post('/', isLoggedIn, validateCampground, wrapAsync(async (req, res) => {
    const { title, location, image, price, description } = req.body.campground;
    const campground = new Campground({ title, location, image, price, description });
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${ campground._id }`);
}))

// SHOW
router.get('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    // Because we want the author of campgrounds, all reviews and author of all reviews.
    const campground = await Campground.findById(id)
    .populate({                         // a nested populate.
        path: 'reviews',
        populate: {
            path: 'author'
        }
    })
    .populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find the campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}))

// UPDATE
router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find the campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}))
router.put('/:id', isLoggedIn, isAuthor, validateCampground, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { title, location, image, price, description } = req.body.campground;
    const campground = await Campground.findByIdAndUpdate(id, { title, location, image, price, description });
    req.flash('success', 'Successfully updated the campground!');
    res.redirect(`/campgrounds/${ campground._id }`);
}))

// DELETE
router.delete('/:id', isLoggedIn, isAuthor, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
}))

module.exports = router;