const express = require('express');
const router = express.Router();

const expressError = require('../utils/expressError');
const wrapAsync = require('../utils/wrapAsync');

const Campground = require('../models/campground');

const isLoggedIn = require('../checkAuthentication');

const { campgroundSchema } = require('../schemaValidator');

// READ
router.get('/', wrapAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        // error.details is an array.
        const msg = error.details.map(e => e.message).join(',');
        throw new expressError(msg, 400); 
    }
    else {
        next();
    }
}

// CREATE
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})
router.post('/', isLoggedIn, validateCampground, wrapAsync(async (req, res) => {
    const { title, location, image, price, description } = req.body.campground;
    const campground = new Campground({ title, location, image, price, description });
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${ campground._id }`);
}))

// SHOW
router.get('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    if (!campground) {
        req.flash('error', 'Cannot find the campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}))

// UPDATE
router.get('/:id/edit', isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find the campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}))
router.put('/:id', isLoggedIn, validateCampground, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { title, location, image, price, description } = req.body.campground;
    const campground = await Campground.findByIdAndUpdate(id, { title, location, image, price, description });
    req.flash('success', 'Successfully updated the campground!');
    res.redirect(`/campgrounds/${ campground._id }`);
}))

// DELETE
router.delete('/:id', isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
}))

module.exports = router;