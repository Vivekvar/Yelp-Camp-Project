const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', wrapAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');  
        })
    } catch(err) {
        // If user is already registered, this message comes from passport.
        req.flash('error', err.message);
        res.redirect('register');
    }
}))

router.get('/login', (req, res) => {
    res.render('users/login');
})

// authenticate is a method on passport to check authentication of a user using username and password and our strategy is local.
// If things go wrong, flash a message and redirect to /login.
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome Back!');
    // From checkAuthentication file.
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', "Adios Amigo! (See Yaa)")
    res.redirect('/campgrounds');
})

module.exports = router;