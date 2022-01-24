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
    res.send('HI!');
})
app.listen(3000, () => {
    console.log("Listening on port 3000!!!");
})