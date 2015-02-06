var queue = [ ],
	error = require('./error.js');

// var response = function(url, timeout, status) {
//   this.id;
//   this.timeout;
//   this.status;
// }

exports.start = function() {
  setInterval(function() {
    if (queue.length > 0) {
      // do stuff
    }
  }, 1000);
};

exports.getStatus = function(req, res, next) {
	var q_id = req.params.id;

	for (var i = 0; i < queue.length; i++) {
		if (queue[i]._id == q_id)
			res.json(200, queue[i]);
	}

	error.respond(404, res, 'Resource not found');
}

exports.push = function(response) {
	queue.push(response);
};

exports.update = function(id, url) {
	queue.forEach(function(response) {
		if (response._id === id) {
			response.status = 'updated';
			response.link = url;
		}
	});
};