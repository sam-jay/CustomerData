(function() {
	'use strict';

	var mongoose = require('mongoose'),
		queue = { },
		error = require('./error.js');

	var Request = function(timeout) {
		this.timeout = timeout;
		this._id = mongoose.Types.ObjectId();
		this.status = 'Pending';
		this.resource = '';
		this.created = Date.now();

		var _this = this;
		this.setStatus = function(status) {
			_this.status = status;
		};
		this.setResource = function(resource) {
			_this.resource = resource;
		}
	};

	exports.start = function() {
		setInterval(function() {
			if (queue.length > 0) {
      			// do cleanup stuff
  			}
		}, 1000);
	};

	exports.push = function(timeout) {
		var request = new Request(timeout);
		queue[request._id] = request;
		return request;
	};

	exports.getQueuedRequest = function(req, res, next) {
		if (queue[req.params.id] === undefined) {
			return error.respond(404, res, '/api/queued_requests/'
				+ req.params.id);
		} else {
			var request = queue[req.params.id];
			return res.json({
				data: {
					status: request.status,
					resource: request.resource
				},
				url: '/api/queued_requests/' + req.params.id
			});
		}
	};

})();