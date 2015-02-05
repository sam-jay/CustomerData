var mongoose = require('mongoose'),
    default_limit = 10;

// IMPORTANT: This method is finished. Don't fuck with it!
exports.present = function (req, res, next) {

  if (req.params.pretty === true)
    return respond(0, req.params.data, res);

  // req.params.prev contains the name of Model we're looking up
  mongoose.model(req.params.prev)
  .find(req.query.q !== undefined ? parseQuery(req.query.q) : { })
  .select(req.query.fields !== undefined ? req.query.fields.replace(',', ' ') : { })
  .skip(req.query.offset !== undefined ? req.query.offset : 0)
  .limit(req.query.limit !== undefined ? req.query.limit : default_limit)
  .exec(function (err, data) {
    return respond(err, data, res);
  });

  var parseQuery = function (str) {
    return JSON.parse('{ "$and": [' + str.split('&&').map(function (str) {
      return '{ "$or": [' + str.split('||').map(function (str) {
        return '{' + str.split('=').map(function (str) {
          return '"' + str + '"';
        }).join(': ') + '}';
      }).join(', ') + '] }';
    }).join(', ') + '] }');
  }

};

var respond = function (err, data, res) {
  if (err)
    return res.json(404, {
      message: 'Resource not found'
    });
  return res.json(200, data);
};
