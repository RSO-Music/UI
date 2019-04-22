var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema   = mongoose.Schema;

var ProjectSchema = new Schema({
	'name' :  { type : String , unique : true, required : true },
    'users': [{
        user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
		role: { type : String , required : true }
    }],
    'deletable' :  { type : Boolean , required : true, default: true},
});

module.exports = mongoose.model('Project', ProjectSchema);
