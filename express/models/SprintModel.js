var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SprintSchema = new Schema({
    'endDate': Number,
    'startDate': Number,
    'projectId': {type: mongoose.Schema.Types.ObjectId, ref: "Project"},
    'speed': String,
    'name': String
});

module.exports = mongoose.model('Sprint', SprintSchema);