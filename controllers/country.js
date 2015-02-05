// Dependencies
var mongoose = require('mongoose');

exports.getCountry = function(req, res, next) {
  req.params.prev = 'Country';

  if (req.params.id !== undefined) {
    mongoose.model('Country').findById(req.params.id, function(err, data) {
      if (err)
        return res.json(404, {
          message: 'Resource not found'
        });
      req.params.pretty = true;
      req.params.data = data;
      return next();
    });
  }

};
