var restful = require('node-restful');
var mongoose = restful.mongoose;

var customerSchema = new mongoose.Schema({
  name: { first: String, last: String },
  email: String,
  address: [{ type: Schema.Types.ObjectId, ref: 'Addresses' }],
  active: Boolean,
  create_date: { type: Date },
  last_update: { type: Date }
});

module.exports = restful.model('Customers', customerSchema);