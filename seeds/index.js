const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

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

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 1000) + 500;
        const camp = new Campground({
            location: `${cities[random].city}, ${cities[random].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images:  [
                {
                  url: 'https://res.cloudinary.com/vivekcloud/image/upload/v1643914740/Yelp-Camp/y7znebydcgybjx4379vd.jpg',
                  filename: 'Yelp-Camp/y7znebydcgybjx4379vd',
                }
            ],
            description: "A very good place to camp. Would suggest everyone to visit once.",
            price,
            author: "61f824dcded4d35341763dd5",
            geometry: {
                type: 'Point',
                coordinates: [ 78.08, 27.88 ]
            }
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})