var restful = require('node-restful');
var mongoose = restful.mongoose;

var countrySchema = new mongoose.Schema({
  country: String,
  last_update: { type: Date }
});

module.exports = restful.model('Countries', countrySchema);