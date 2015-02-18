(function() {
  'use strict';

  /* Dependencies */
  var mongoose = require('mongoose'),
      validator = require('validator'),
      Address = mongoose.model('Address'),
      queue = require('./queue.js'),
      error = require('./error.js');

  exports.getAddress = function(req, res, next) {
    req.params.prev = 'Address';

    /* If ID is given, find country */
    if (req.params.id !== undefined) {
      Address.findById(req.params.id, function(err, data) {
        if (err)
          return error.respond(404, res, '/api/addresses/' + req.params.id);
        req.params.pretty = 'true';
        req.params.data = data;
        return next();
      });

    /* Otherwise call the next function */
    } else {
      return next();
    }
  };

  exports.postAddress = function(req, res, next) {
    var address,
	address2,
	district,
	city_id,
	postal_code,
	phone,
        queued_request;

    /* Attempt to get country name from request body */
    try { 
      address = JSON.parse(req.body).address;
	address2 = JSON.parse(req.body).address2;
	district = JSON.parse(req.body).district;
	city_id = JSON.parse(req.body).city_id;
	postal_code = JSON.parse(req.body).postal_code;
	phone = JSON.parse(req.body).phone;

    } catch (e) { 
      return error.respond(400, res, 'Cannot parse input');
    }
    if (validator.isNull(address) || validator.isNull(address2) || validator.isNull(district) || validator.isNull(city_id) || validator.isNull(postal_code) || validator.isNull(phone)) 
      return error.respond(400, res, 'Cannot parse input'); 

    /* Add this request to the queue */
    queued_request = queue.push(10000);
    res.json(202, {
      message: 'Resource accepted (Operation Pending)',
      url: '/api/queued_requests/' + queued_request._id
    });

    /* Save new country */
    var add = new Address();
    add.address = address;
	add.address2 = address2;
	add.district = district;
	add.city_id = city_id;
	add.postal_code = postal_code;
	add.phone = phone;
    add.save(function(err, add) {
      if (err)
        return queued_request.setStatus('Failed');

      queued_request.setStatus('Success');
      return queued_request.setResource('/api/addresses/' 
        + add._id);
    });
  }

  exports.putAddress = function(req, res, next) {
    var address,
	address2,
	district,
	city_id,
	postal_code,
	phone,
        queued_request;

    /* Only country name may be updated */
    try { 
      address = JSON.parse(req.body).address;
	address2 = JSON.parse(req.body).address2;
    } catch (e) { 
      return error.respond(400, res, 'Cannot parse input');
    }
    if (validator.isNull(address) || validator.isNull(address2)) 
      return error.respond(400, res, 'Cannot parse input'); 
 
    /* Find country */
    Address.findById(req.params.id, function(err, data) {
      
      /* Country not found */
      if (err)
        return error.respond(404, res, '/api/addresses/' + req.params.id);

      /* If found, add this request to the queue */
      queued_request = queue.push(10000);
      res.json(202, {
        message: 'Resource accepted (Operation Pending)',
        url: '/api/queued_requests/' + queued_request._id
      });

      /* Update country */
      data.address = address;
	data.address2 = address2;
      data.last_update = new Date();
      data.save(function (err, add) {
        if (err)
          return queued_request.setStatus('Failed');

        queued_request.setStatus('Success');
        return queued_request.setResource('/api/addresses/'
          + add._id);
      });
    });
  }

  exports.delAddress = function(req, res, next) {
    var queued_request;

    /* Find country */
    Address.findById(req.params.id, function(err, data) {

      /* Country not found */
      if (err)
        return error.respond(404, res, '/api/addresses/' + req.params.id);

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
