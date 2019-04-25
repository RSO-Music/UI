var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserTaskSchema = new Schema({
    'storyId': {type: mongoose.Schema.Types.ObjectId, ref: "UserStory"},
	'description': {type: String},
	'time': {type: Number},
	'assignee': {type: mongoose.Schema.Types.ObjectId, ref: "User"},
	'status': {type: String},
    'accepted': {type: Boolean, default: false}
});

module.exports = mongoose.model('UserTask', UserTaskSchema);
