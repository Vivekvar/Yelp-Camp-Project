const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // To keep track of on which page, user moved to login.
        // We will redirect him to that page in our login route.
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports = isLoggedIn;