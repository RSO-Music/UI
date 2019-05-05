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
        ref: "User",
        default: null
    },
    accepted: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: false
    },
    finished: {
        type: Boolean,
        default: false
    },
    activeHours: {
        type: Number,
        default: 0
    },
    activeHoursAssignee: {
        type: Number,
        default: 0
    },
    activities: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            date: Date,
            activeHours: {
                type: Number,
                default: 0
            }
        }
    ]
});

module.exports = mongoose.model('UserTask', UserTaskSchema);
