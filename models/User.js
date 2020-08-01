const mongoose = require('mongoose');

// a schema holds the fields we want this resource to have. create a variable with new object
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    avatar: {
        type: String // avatar will be avail right away to new user
    },
    date: {
        type: Date,
        default: Date.now
    }


});

module.exports = User = mongoose.model('user', UserSchema);