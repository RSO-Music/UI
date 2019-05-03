const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserStorySchema = new Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true, 
    },
    sprintId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Sprint" 
    },
    projectId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Project" 
    },
    description: { 
        type: String, 
        required: true 
    },
    acceptanceTests: { 
        type: String, 
        required: true 
    },
    priority: { 
        type: String, 
        required: true 
    },
    timeEstimation: { 
        type: Number 
    },
    businessValue: { 
        type: String, 
        required: true 
    },
    done: { 
        type: Boolean, 
        required: true, 
        default: false
    },
    realized: {
        type: Boolean,
        required: true,
        default: false
    },
    rejected: {
        type: Boolean,
        required: true,
        default: false
    },
    rejectionReason: String
});

module.exports = mongoose.model('UserStory', UserStorySchema);
