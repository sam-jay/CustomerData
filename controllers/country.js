(function() {
  'use strict';

  /* Dependencies */
  var mongoose = require('mongoose'),
      validator = require('validator'),
      Country = mongoose.model('Country'),
      queue = require('./queue.js'),
      error = require('./error.js');

  exports.getCountry = function(req, res, next) {
    req.params.prev = 'Country';

    /* If ID is given, find country */
    if (req.params.id !== undefined) {
      Country.findById(req.params.id, function(err, data) {
        if (err)
          return error.respond(404, res, '/api/countries/' + req.params.id);
        req.params.pretty = 'true';
        req.params.data = data;
        return next();
      });

    /* Otherwise call the next function */
    } else {
      return next();
    }
  };

  exports.postCountry = function(req, res, next) {
    var country_name,
        queued_request;

    /* Attempt to get country name from request body */
    try { 
      country_name = JSON.parse(req.body).country;
    } catch (e) { 
      return error.respond(400, res, 'Cannot parse input');
    }
    if (validator.isNull(country_name)) 
      return error.respond(400, res, 'Cannot parse input'); 

    /* Add this request to the queue */
    queued_request = queue.push(10000);
    res.json(202, {
      message: 'Resource accepted (Operation Pending)',
      url: '/api/queued_requests/' + queued_request._id
    });

    /* Save new country */
    var country = new Country();
    country.country = country_name;
    country.save(function(err, country) {
      if (err)
        return queued_request.setStatus('Failed');

      queued_request.setStatus('Success');
      return queued_request.setResource('/api/countries/' 
        + country._id);
    });
  }

  exports.putCountry = function(req, res, next) {
    var country_name,
        queued_request;

    /* Only country name may be updated */
    try { 
      country_name = JSON.parse(req.body).country;
    } catch (e) { 
      return error.respond(400, res, 'Cannot parse input');
    }
    if (validator.isNull(country_name)) 
      return error.respond(400, res, 'Cannot parse input'); 
 
    /* Find country */
    Country.findById(req.params.id, function(err, data) {
      
      /* Country not found */
      if (err)
        return error.respond(404, res, '/api/countries/' + req.params.id);

      /* If found, add this request to the queue */
      queued_request = queue.push(10000);
      res.json(202, {
        message: 'Resource accepted (Operation Pending)',
        url: '/api/queued_requests/' + queued_request._id
      });

      /* Update country */
      data.country = country_name;
      data.last_update = new Date();
      data.save(function (err, country) {
        if (err)
          return queued_request.setStatus('Failed');

        queued_request.setStatus('Success');
        return queued_request.setResource('/api/countries/'
          + country._id);
      });
    });
  }

  exports.delCountry = function(req, res, next) {
    var queued_request;

    /* Find country */
    Country.findById(req.params.id, function(err, data) {

      /* Country not found */
      if (err)
        return error.respond(404, res, '/api/countries/' + req.params.id);

      /* If found, add this request to the queue */
      queued_request = queue.push(10000);
      res.json(202, {
        message: 'Resource accepted (Operation Pending)',
        url: '/api/queued_requests/' + queued_request._id
      });

    }).remove(function(err) {
      if (err)
        return queued_request.setStatus('Failed');

      return queued_request.setStatus('Success');
    });
  }

})();