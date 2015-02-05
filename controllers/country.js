var mongoose = require('mongoose'),
    Country = mongoose.model('Country');

// IMPORTANT: Don't fuck with this method. Everything is finished here.
exports.getCountry = function(req, res, next) {
  req.params.prev = 'Country';
  if (req.params.id !== undefined) {
    Country.findById(req.params.id, function(err, data) {
      if (err)
        return res.json(404, {
          message: 'Resource not found'
        });
      req.params.pretty = true;
      req.params.data = data;
      return next();
    });
  } else
    return next();
};

// TODO: validation. Everything else working.
exports.postCountry = function(req, res, next) {
  var err = false, 
      country_name = JSON.parse(req.body).country;
  if (err)
    return res.json(500, {
      message: 'Internal Server Error'
    });
  var country = new Country();
  country._id = mongoose.Types.ObjectId();
  country.country = country_name;
  country.last_update = new Date();
  res.json(202, {
    message: 'Resource accepted (Operation Pending)',
    url: '/api/countries/' + country._id
  });
  country.save();
}

exports.putCountry = function(req, res, next) {
  var new_name = JSON.parse(req.body).country;
  Country.findById(req.params.id, function(err, data) {
    if (err)
      return res.json(404, {
        message: 'Resource not found'
      });
    data.country = new_name;
    data.last_update = new Date();
    res.json(202, {
      message: 'Accepted (Operation Pending)',
      url: '/api/countries/' + data._id
    });
    country.save();
  });
}

exports.delCountry = function(req, res, next) {
  Country.findById(req,params.id, function(err, data) {
    if (err)
      return res.json(404, {
        message: 'Resource not found'
      });
    
  });
}

