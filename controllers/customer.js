// Dependencies
var mongoose = require('mongoose'),
    Customer = mongoose.model('Customer');

module.exports.getCustomer = function(req, res, next) {
  req.params.prev = 'Customer';

  // If query go to next
  if (req.query.q !== undefined)
    return next();

  var customer = getCustomerFromDB();
  req.params.customer = customer;
  return next();

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
}

exports.postCustomer = function(req, res, next) {
	var body = JSON.parse(req.body);
	if (!(body.name === undefined ||
		body.name === '')) {
		var customer = new Customer();
		// customer.name = body.name;
		var names = body.name.split(' ');
		if (names.length != 2) {
			res.json(500, {
				message: "Error occured: must send 2 names"
			});
		}
		customer.name = {
			first: names[0],
			last: names[1]
		};
		customer.last_update = new Date();
		customer.create_date = customer.last_update;
		customer.email = body.email;
		customer.save( function() {
			console.log("Saving: " + customer);
			res.send(customer);
		});
	}
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
