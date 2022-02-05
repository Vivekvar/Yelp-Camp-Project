const Campground = require('../models/campground');
const { cloudinary } = require("../cloudinary");

module.exports.allCampgrounds = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.newCampground = async (req, res) => {
    const { title, location, price, description } = req.body.campground;
    const campground = new Campground({ title, location, price, description });
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${ campground._id }`);
}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    // Because we want the author of campgrounds, all reviews and author of all reviews.
    const campground = await Campground.findById(id)
    .populate({                         // a nested populate.
        path: 'reviews',
        populate: {
            path: 'author'
        }
    })
    .populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find the campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find the campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.editCampground = async (req, res) => {
    const { id } = req.params;
    const { title, location, price, description } = req.body.campground;
    const campground = await Campground.findByIdAndUpdate(id, { title, location, price, description });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            // deletes an image from cloudinary
            await cloudinary.uploader.destroy(filename);
        }
        // deletes an image from deleteImages array
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated the campground!');
    res.redirect(`/campgrounds/${ campground._id }`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
}