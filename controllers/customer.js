// Dependencies
var mongoose = require('mongoose'),
    Customer = mongoose.model('Customer'),
    Address = mongoose.model('Address'),
    validator = require('validator'),
    queue = require('./queue.js'),
    error = require('./error.js');



exports.getCustomer = function(req, res, next) {
  req.params.prev = 'Customer';

  // If query go to next
  if (req.query.q !== undefined) {
    return next();
  }

  var getCustomerFromDB = function (arg) {
    if (arg !== undefined) {
      Customer.findById(arg, function(err, data) {
      	if (err)
      		return error.respond(404, res, '/api/customers/' + arg);
      	req.params.pretty = 'true';
      	req.params.data = data;
      	return next();
      });
    }
  };

  var customer = getCustomerFromDB(req.params.id);
  req.params.customer = customer;
  return next(); 
}
  /*
  console.log(req.params);
	if (!(req.params.id === undefined ||
    req.params.id === '')) {
		Customer.findById(req.params.id, function(err, data) {
			if (err) {
				res.json(500, {
					message: "Error occured: " + err
				});
			} else {
				res.json(200, {
					name: data.name.first + ' ' + data.name.last,
					email: data.email,
					// active: data.active,
					link: 'customers/' + data._id
				});
			}
		});
    } else {
    	Customer.find({}, function(err, data) {
    		if (err) {
    			res.json(500, {
    				message: "Error occured: " + err
    			});
    		} else {
    			var i, results = [];
    			for (i = 0; i < data.length; i++) {
    				results[i] = {
    					name: data[i].name.first + ' ' + data[i].name.last,
    					link: 'customers/' + data[i]._id
    				};
    			}
    			res.json(200, results);
    		}
    	});
    }
*/

exports.postCustomer = function(req, res, next) {

	var customer_fname, customer_lname,
		customer_email,
		customer_status,
		address_url, address_ID,
		queued_request;

	// Parse request body
	try {
		var body = JSON.parse(req.body);
		customer_fname = body.name.first;
		customer_lname = body.name.last;
		customer_email = body.email;
		address_ID = body.address.split('/')[3];
		customer_status = body.active;
	} catch (e) { return error.respond(400, res, 'Cannot parse input'); }

	console.log(
		"name: " + customer_lname + ', ' + customer_fname + '\n' +
		"email: " + customer_email + '\n' +
		"address_id: " + address_ID + '\n' +
		"customer_status: " + customer_status + '\n');

	// Validate parameters here

	// Ensure valid address_id here
	Address.findById(address_ID, function(err, data) {

		console.log("looking up address");
		if (err)
	        return error.respond(404, res, '/api/addresses/' + address_ID);
	    if (data === null)
	        return error.respond(404, res, '/api/addresses/' + address_ID);
	    
		// Add this request to queue
		queued_request = queue.push(10000);
		res.json(202, {
			message: 'Resource accepted (Operation Pending)',
	        url: '/api/queued_requests/' + queued_request._id
		});

		// Save new customer
		var customer = new Customer();
		customer.first_name = customer_fname;
		customer.last_name = customer_lname;
		customer.email = customer_email;
		customer.address_id = address_ID;
		customer.active = customer_status;
		customer.save(function(err, customer) {
			if (err) return queued_request.setStatus('Failed');
			queued_request.setStatus('Success');
			return queued_request.setResource('/api/customers/' + customer._id);
		});
	});
	// if (!(body.name === undefined ||
	// 	body.name === '')) {
	// 	var customer = new Customer();
	// 	// customer.name = body.name;
	// 	var names = body.name.split(' ');
	// 	if (names.length != 2) {
	// 		res.json(500, {
	// 			message: "Error occured: must send 2 names"
	// 		});
	// 	}
	// 	customer.name = {
	// 		first: names[0],
	// 		last: names[1]
	// 	};
	// 	customer.last_update = new Date();
	// 	customer.create_date = customer.last_update;
	// 	customer.email = body.email;
	// 	customer.save( function() {
	// 		console.log("Saving: " + customer);
	// 		res.send(customer);
	// 	});
	// }
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
