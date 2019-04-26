const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SprintSchema = new Schema({
    endDate: Number,
    startDate: Number,
    projectId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Project" 
    },
    speed: String,
    name: String
});

module.exports = mongoose.model('Sprint', SprintSchema);