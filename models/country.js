var mongoose = require('mongoose');

var countrySchema = new mongoose.Schema({
  name: String,
  last_update: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Country', countrySchema);
