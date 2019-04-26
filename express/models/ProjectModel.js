const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    users: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            role: {
                type: String,
                required: true
            }
        }
    ],
    deletable: {
        type: Boolean,
        required: true,
        default: true
    }
});

module.exports = mongoose.model('Project', ProjectSchema);
