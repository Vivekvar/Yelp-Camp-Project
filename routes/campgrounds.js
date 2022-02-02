const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const campgrounds = require('../controllers/campgrounds');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');

router.route('/')
    .get(wrapAsync(campgrounds.allCampgrounds))
    .post(isLoggedIn, validateCampground, wrapAsync(campgrounds.newCampground))

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(wrapAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, wrapAsync(campgrounds.editCampground))
    .delete(isLoggedIn, isAuthor, wrapAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(campgrounds.renderEditForm))

module.exports = router;