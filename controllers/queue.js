
var queue = [ ];

var response = function(url, timeout, status) {
  this.id;
  this.timeout;
  this.status;
}

exports.start = function() {
  setInterval(function() {
    if (queue.length > 0) {
      // do stuff
    }
  }, 1000);
}
