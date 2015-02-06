var mongoose = require('mongoose'),
    validator = require('validator'),
    Country = mongoose.model('Country'),
    queue = require('./queue.js'),
    error = require('./error.js');

// IMPORTANT: Don't fuck with this method. Everything is finished here.
exports.getCountry = function(req, res, next) {
  req.params.prev = 'Country';
  if (req.params.id !== undefined) {
    Country.findById(req.params.id, function(err, data) {
      if (err)
        return error.respond(404, res, '/api/countries/' + req.params.id);
      req.params.pretty = true;
      req.params.data = data;
      return next();
    });
  } else
    return next();
};

exports.postCountry = function(req, res, next) {
  var country_name;
  var q_id;

  var saveCountry = function (id, next) {
    var country = new Country();
    country._id = mongoose.Types.ObjectId();
    country.country = country_name;
    country.last_update = new Date();
    country.save();
    var url = '/api/countries/' + country._id;
    return next(id, url); 
  }
  
  try { 
    country_name = JSON.parse(req.body).country;
  } catch (e) { 
    return error.respond(400, res, 'Cannot parse input');
  }

  if (validator.isNull(country_name)) 
    return error.respond(400, res, 'Cannot parse input'); 

  q_id = mongoose.Types.ObjectId();

  queue.push({
    status: 'pending',
    _id: q_id
  })

  res.json(202, {
    message: 'Resource accepted (Operation Pending)',
    url: '/api/queuedRequests/' + q_id
  });

  return saveCountry(q_id, queue.update);

}

exports.putCountry = function(req, res, next) {
  var country_name;

  try { 
    country_name = JSON.parse(req.body).country;
  } catch (e) { 
    return error.respond(400, res, 'Cannot parse input');
  }

  if (validator.isNull(country_name)) 
    return error.respond(400, res, 'Cannot parse input'); 

  res.json(202, {
    message: ''
  });

  Country.findById(req.params.id, function(err, data) {
    if (err)
      return error.respond(404, res, req.params.id);
    
    data.country = country_name;
    data.last_update = new Date();
    res.json(202, {
      message: 'Accepted (Operation Pending)',
      url: '/api/countries/' + data._id
    });
    return country.save();
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

