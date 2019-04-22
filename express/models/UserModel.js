var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var UserSchema = new Schema({
	'username' : { type : String , unique : true, required : true },
	'password' : { type : String ,  required : true },
	'firstName' : { type : String , required : true },
	'lastName' : { type : String ,  required : true },
	'email'  : { type : String ,  required : true },
	'isAdmin' : { type : Boolean , required : true },
});

module.exports = mongoose.model('User', UserSchema);
