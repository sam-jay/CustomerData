// Dependencies
var mongoose = require('mongoose'),
    Customer = mongoose.model('Customer'),
    Address = mongoose.model('Address'),
    validator = require('validator'),
    queue = require('./queue.js'),
    error = require('./error.js');

exports.getCustomer = function(req, res, next) {
    req.params.prev = 'Customer';

    /* If ID is given, find city */
    if (req.params.id !== undefined) {
      Customer.findById(req.params.id, function(err, data) {
        if (err)
          return error.respond(404, res, '/api/customers/' + req.params.id);
        req.params.pretty = 'true';
        req.params.data = data;
        req.params.id = data.address_id;
        return next();
      });

    /* Otherwise call the next function */
    } else {
      return next();
    }
}

exports.postCustomer = function(req, res, next) {
    var first_name = req.body.first_name,
        last_name = req.body.last_name,
        email = req.body.email,
        address_id = req.body.address_id,
        active = req.body.active,
        queued_request;

    if (validator.isNull(first_name) ||
    	validator.isNull(last_name) ||
    	validator.isNull(email) ||
    	validator.isNull(address_id) ||
    	validator.isNull(active))
    	return error.respond(400, res, 'Cannot parse input'); 

    /* Ensure valid countryID given */
    Address.findById(address_id, function(err, data) {
      if (err)
        return error.respond(404, res, '/api/addresses/' + address_id);
      if (data === null)
        return error.respond(404, res, '/api/addresses/' + address_id);
      /* Add this request to the queue */
      queued_request = queue.push(10000);
      res.json(202, {
        message: 'Resource accepted (Operation Pending)',
        url: '/api/queued_requests/' + queued_request._id
      });

      /* Save new city */
      var customer = new Customer();
      customer.first_name = first_name;
      customer.last_name = last_name;
      customer.email = email;
      customer.address_id = address_id;
      customer.active = active;
      customer.save(function(err, customer) {
        if (err)
          return queued_request.setStatus('Failed');

        queued_request.setStatus('Success');
        return queued_request.setResource('/api/customers/' 
          + customer._id);
      });
    });
}

exports.delCustomer = function(req, res, next) {
	if (!(req.params.id === undefined ||
		req.params.id === '')) {
		Customer.findByIdAndRemove(req.params.id, function(err, data) {
			if (err) {
				res.json(500, {
					message: "Error occured: " + err
				});
			} else {
				res.json(204, {
					message: 'Delete successful'
				});
			}
		});
	}
}
