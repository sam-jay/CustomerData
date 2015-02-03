// Dependencies
var mongoose = require('mongoose'),
    Customer = mongoose.model('Customer');

exports.getCustomer = function(req, res, next) {
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
					name: data.name,
					email: data.email,
					// active: data.active,
					link: 'customers/' + data._id
				});
			}
		});
    }
}

exports.postCustomer = function(req, res, next) {
	var body = JSON.parse(req.body);
	if (!(body.name === undefined ||
		body.name === '')) {
		var customer = new Customer();
		customer.name = body.name;
		// customer.name = {
		// 	first: body.first,
		// 	last: body.last
		// };
		customer.last_update = new Date();
		customer.create_date = customer.last_update;
		customer.email = body.email;
		customer.save( function() {
			console.log("Saving: " + customer);
			res.send(customer);
		});
	}
}