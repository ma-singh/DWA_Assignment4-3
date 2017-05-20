var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
	email: {type: String, required: true},
	password: {type: String, required: true}
});

// encrypt user password
userSchema.methods.encryptPassword = function(password) {
	// return hashed password
	return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
}

// check if user entered a valid password
userSchema.methods.validPassword = function(password) {
	// compare hashed password with user input
	return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);
