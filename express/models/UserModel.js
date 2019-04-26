const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userRoles = require('../lib/userRoles');

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: Object.values(userRoles)
    }
});

module.exports = mongoose.model('User', UserSchema);
