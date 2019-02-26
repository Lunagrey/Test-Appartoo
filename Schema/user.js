var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({ 
	local     		: {
		login 		: String,
		password 	: String,
		age		: Number,
		famille		: String,
		role		: String,
		nourriture	: String,
		friends		: Array
	}
});

userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);