var restful = require('node-restful');
var mongoose = restful.mongoose;

var citySchema = new mongoose.Schema({
  city: String,
  country: [{ type: Schema.Types.ObjectId, ref: 'Countries' }],
  last_update: { type: Date }
});

module.exports = restful.model('Cities', citySchema);