var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var eventSchema = mongoose.Schema({ 
	lieu		: String,
	date		: String,
	heure		: String,
});

eventSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

eventSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('Event', eventSchema);