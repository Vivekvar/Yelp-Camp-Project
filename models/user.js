const mongoose = require('mongoose');

const passportLocalMongoose = require('passport-local-mongoose');

// We want email, username and password for each user.
// Email is through our schema.
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// Username and password are added through this beacuse passportLocalMongoose does authorization on the basis of username and password.
userSchema.plugin(passportLocalMongoose);

const user = mongoose.model('User', userSchema);

module.exports = user;