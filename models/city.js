var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var citySchema = new Schema({
  city: String,
  country_id: [{type: Schema.Types.ObjectId, ref: 'Country'}],
  last_update: { type: Date, default: Date.now }
});

module.exports = mongoose.model('City', citySchema);
