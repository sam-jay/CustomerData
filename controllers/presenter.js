var mongoose = require('mongoose'),
    default_limit = 10;

exports.present = function (req, res, next) {
  console.log(req.params);
}
/*exports.present = function (req, res, next) {

  var query, pagination, projection;

  if (req.query.q !== undefined)
    query = parseQuery(req.query.q);

  if (req.query.limit !== undefined || req.query.offset !== undefined)
    pagination = parseLimitOffset(req.query);

  if (req.query.fields !== undefined)
    projection = parseFields(req.query.fields);

};

var parseQuery = function (q) {
  return q.split('&&').map(function (str) {
    return str.split('||').map(function (str2) {
      return str2.split('=');
    });
  });
}

var parseLimitOffset = function (q) {
  return {
    'limit': q.limit,
    'offset': q.offset
  };
}

var parseFields = function (fields) {
  return fields.split(',');
}
*/
