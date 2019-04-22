var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserTaskSchema = new Schema({
    'description': {type: String, required: true},
    'sprintId': {type: mongoose.Schema.Types.ObjectId, ref: "Sprint"},
    'projectId': {type: mongoose.Schema.Types.ObjectId, ref: "Project"},
    'time': {type: String, required: true}

    // 'users': [{
    //     user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    // }],
});

module.exports = mongoose.model('UserTask', UserTaskSchema);
