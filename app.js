const express = require('express');
const app = express();
const path = require('path');

const expressError = require('./utils/expressError');
const wrapAsync = require('./utils/wrapAsync');

// Javascript Validator for Schema
const Joi = require('joi');
const { campgroundSchema, reviewSchema } = require('./schemaValidator');

// Used to dynamically add content to ejs files (convenient than partials) (layouts)
const ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate);

const Campground = require('./models/campground');
const Review = require('./models/review');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/yelp-camp', { 
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!");
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!");
        console.log(err);
    })

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, '/public')))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('', (req, res) => {
    res.send('<h1>Please go to /campgrounds!</h1>');
})

// READ
app.get('/campgrounds', wrapAsync(async (req, res) => {
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

// CREATE
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})
app.post('/campgrounds', validateCampground, wrapAsync(async (req, res) => {
    const { title, location, image, price, description } = req.body.campground;
    const campground = new Campground({ title, location, image, price, description });
    await campground.save();
    res.redirect(`/campgrounds/${ campground._id }`);
}))

// SHOW
app.get('/campgrounds/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    res.render('campgrounds/show', { campground });
}))

// UPDATE
app.get('/campgrounds/:id/edit', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
}))
app.put('/campgrounds/:id', validateCampground, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { title, location, image, price, description } = req.body.campground;
    const campground = await Campground.findByIdAndUpdate(id, { title, location, image, price, description });
    res.redirect(`/campgrounds/${ campground._id }`);
}))

// DELETE
app.delete('/campgrounds/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))



app.post('/campgrounds/:id/reviews', validateReview, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { body, rating } = req.body.review;
    const review = new Review({ body, rating });
    const campground = await Campground.findById(id);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${ id }`);
}))

app.delete('/campgrounds/:id/reviews/:reviewId', wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    const campground = await Campground.findById(id);
    // will remove/pull a matching instance of reviewId in reviews.
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${ id }`);
}))



// For all other routes which does not exist.
app.all('*', (req, res, next) => {
    next(new expressError('Page not found!', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong, there's an error!";
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log("Listening on port 3000!!!");
})