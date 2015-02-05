var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var customerSchema = new Schema({
  first_name: String,
  last_name: String,
  email: String,
  address_id: [{ type: Schema.Types.ObjectId, ref: 'Address' }],
  active: Boolean,
  create_date: { type: Date, default: Date.now },
  last_update: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Customer', customerSchema);
