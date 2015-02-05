var mongoose = require('mongoose'),
    default_limit = 10;

exports.present = function (req, res, next) {

  var query = { },
      pagination = { skip: 0, limit: default_limit },
      fields = { };

  if (req.query.q !== undefined)
    query = parseQuery(req.query.q);

  if (req.query.limit !== undefined || req.query.offset !== undefined)
    pagination = parseLimitOffset(req.query);

  if (req.query.fields !== undefined)
    fields = parseFields(req.query.fields);

  var Resource = mongoose.model(req.prev);
  Resource
  .find(query)
  .select(fields)
  .skip(pagination.skip)
  .limit(pagination.limit)
  .exec(function (err, data) {
    if (err)
      return res.json(404, {  
        message: 'Resource not found'
      });
    /// VVVVVVVVVVVVVV
    return res.json(data);
  });

};

var parseQuery = function (q) {
  return JSON.parse('{ "$and": [' + q.split('&&').map(function (str) {
    return '{ "$or": [' + str.split('||').map(function (str) {
      return '{' + str.split('=').map(function (str) {
        return '"' + str + '"';
      }).join(': ') + '}';
    }).join(', ') + '] }';
  }).join(', ') + '] }');
}

var parseLimitOffset = function (q) {
  return {
    skip: q.offset,
    limit: q.limit
  };
}

var parseFields = function (fields) {
  return fields.replace(',', ' ');
}
