const express = require('express');
const app = express();
const path = require('path');
const expressError = require('./utils/expressError');
const wrapAsync = require('./utils/wrapAsync');

// Javascript Validator for Schema
const Joi = require('joi');
const { campgroundSchema, reviewSchema } = require('./schemaValidator');

const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

// Used to dynamically add content to ejs files (convenient than partials) (layouts)
const ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate);

const passport = require('passport');
const passportLocal = require('passport-local');

const Campground = require('./models/campground');
const Review = require('./models/review');
const User = require('./models/user');

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

app.use(express.static(path.join(__dirname, 'public')))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('', (req, res) => {
    res.send('<h1>Please go to /campgrounds!</h1>');
})


const session = require('express-session');
const sessionConfig = {
    secret: 'asecrettokeep',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}
app.use(session(sessionConfig));

const flash = require('connect-flash');
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    // Will be undefined if no one is logged in.
    res.locals.currentUser = req.user;
    next();
})

app.use('/campgrounds', campgroundRoutes);

app.use('/campgrounds/:id/reviews', reviewRoutes);

app.use('/', userRoutes);

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