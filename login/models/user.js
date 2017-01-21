var mongoose = require('mongoose');
var bcrypt   = require('bcryptjs');


var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index: true
	},
	password:{
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	}
});

var User = module.exports = mongoose.model('User', UserSchema);

//user functions below

//create user
module.exports.createUser = function(newUser, callback){
	//hash the password using the bcrypt module
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        
	        newUser.password = hash;
	        newUser.save(callback);

	    });
	});
}


