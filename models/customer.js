var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var customerSchema = new Schema({
  name: { first: String, last: String },
  email: String,
  address: [{ type: Schema.Types.ObjectId, ref: 'Address' }],
  active: Boolean,
  create_date: { type: Date },
  last_update: { type: Date }
});

module.exports = mongoose.model('Customer', customerSchema);