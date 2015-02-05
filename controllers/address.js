var mongoose = require('mongoose'),
    Address = mongoose.model('Address');

exports.getAddress = function (req, res, next) {
  req.params.prev = 'Address';

  // If request passed through getCustomer
  if (req.params.prev !== undefined) {
    var address = getAddressFromDB(req.params.Customer);
    req.params.address = address;
    return next();
  }

  if (req.query.q !== undefined)
    return next();

  var address = getAddressFromDB();
  req.params.address = address;
  return next();
}

