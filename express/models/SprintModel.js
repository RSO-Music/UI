const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SprintSchema = new Schema({
    endDate: Date,
    startDate: Date,
    projectId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Project" 
    },
    speed: String,
    name: String,
    finished: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Sprint', SprintSchema);