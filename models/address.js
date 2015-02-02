var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var addressSchema = new Schema({
  address: String,
  address2: String,
  district: String,
  city: [{ type: Schema.Types.ObjectId, ref: 'City' }],
  postal_code: String,
  phone: String,
  last_update: { type: Date }
});

module.exports = mongoose.model('Address', addressSchema);