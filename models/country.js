var mongoose = require('mongoose');

var countrySchema = new mongoose.Schema({
  country: String,
  last_update: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Country', countrySchema);
