var restful = require('node-restful');
var mongoose = restful.mongoose;

var customerSchema = new mongoose.Schema({
  name: { first: String, last: String },
  email: String
});

module.exports = restful.model('Customers', customerSchema);