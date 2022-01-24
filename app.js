const express = require('express');
const app = express();
const path = require('path');

const Campground = require('./models/campground');

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
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
})

// CREATE
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})
app.post('/campgrounds', async (req, res) => {
    const { title, location } = req.body.campground;
    console.log(title, location);
    const campground = new Campground({ title, location });
    await campground.save();
    res.redirect(`/campgrounds/${ campground._id }`);
})

// SHOW
app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', { campground });
})

// UPDATE
app.get('/campgrounds/:id/edit', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
})
app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const { title, location } = req.body.campground;
    const campground = await Campground.findByIdAndUpdate(id, { title, location });
    res.redirect(`/campgrounds/${ campground._id }`);
})

// DELETE
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndRemove(id);
    res.redirect('/campgrounds');
})

app.listen(3000, () => {
    console.log("Listening on port 3000!!!");
})