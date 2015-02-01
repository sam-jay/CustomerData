var restful = require('node-restful');
var mongoose = restful.mongoose;

var addressSchema = new mongoose.Schema({
  address: String,
  address2: String,
  district: String,
  city: [{ type: Schema.Types.ObjectId, ref: 'Cities' }],
  postal_code: String,
  phone: String,
  last_update: { type: Date }
});

module.exports = restful.model('Addresses', addressSchema);