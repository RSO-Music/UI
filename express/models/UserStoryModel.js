var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserStorySchema = new Schema({
    'name': {type: String, required: true, unique: true,},
    'sprintId': {type: mongoose.Schema.Types.ObjectId, ref: "Sprint"},
    'projectId': {type: mongoose.Schema.Types.ObjectId, ref: "Project"},
    'description': {type: String, required: true},
    'acceptanceTests': {type: String, required: true},
    'priority': {type: String, required: true},
    'timeEstimation': {type: Number},
    'businessValue': {type: String, required: true},
    'done': {type: Boolean, required: true, default: false}
});

module.exports = mongoose.model('UserStory', UserStorySchema);
