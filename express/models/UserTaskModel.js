const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserTaskSchema = new Schema({
    storyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserStory"
    },
    description: String,
    time: Number,
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    status: String,
    accepted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('UserTask', UserTaskSchema);
