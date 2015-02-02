var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var citySchema = new Schema({
  name: String,
  country: [{ type: Schema.Types.ObjectId, ref: 'Country' }],
  last_update: { type: Date }
});

module.exports = mongoose.model('City', citySchema);