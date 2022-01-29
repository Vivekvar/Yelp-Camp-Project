const { append } = require('express/lib/response');
const mongoose = require('mongoose');
const Review = require('./review');

const campgroundSchema = new mongoose.Schema({
    title: String,
    price: Number,
    image: String,
    location: String,
    description: String,
    reviews: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Review' 
        }
    ]
});

campgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

const Campground = mongoose.model('Campground', campgroundSchema);

module.exports = Campground;