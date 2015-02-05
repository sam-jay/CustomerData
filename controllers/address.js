var mongoose = require('mongoose'),
    Address = mongoose.model('Address');

module.exports.getAddress = function (req, res, next) {
  req.params.prev = 'Address';

  // If request passed through getCustomer
  if (req.params.prev !== undefined) {
    var address = getAddressFromDB(req.params.Customer[0].address_id);
    req.params.address = address;
    return next();
  }

  if (req.query.q !== undefined)
    return next();

  var address = getAddressFromDB(req.params.id);
  req.params.address = address;
  return next();

  var getAddressFromDB = function (arg) {
    if (arg !== undefined) {
    
    }
  };

}

