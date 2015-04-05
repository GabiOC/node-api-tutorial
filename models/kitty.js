var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var kittySchema = new Schema({
	name: String,
	url: String
});

module.exports = mongoose.model('Kitty', kittySchema);