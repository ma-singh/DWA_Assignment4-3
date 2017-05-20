var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	user: {type: Schema.Types.ObjectId, ref: 'User'},
	name: {type: String, required: true},
	cart: {type: Object, required: true},
	address: {type: String, required: true},
	paymentId: {type: String, required: true}
});

module.exports = mongoose.model('Order', schema);