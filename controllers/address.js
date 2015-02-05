var mongoose = require('mongoose'),
    Address = mongoose.model('Address');

module.exports.getAddress = function (req, res, next) {
  req.params.prev = 'Address';

  // If request passed through getCustomer
  if (req.params.prev !== undefined) {
    var address = getAddressFromDB(req.params.customer.address_id);
    if (address.hasOwnProperty('error'))
     res.json(500, address)
    req.params.address = address;
    return next();
  }

  if (req.query.q !== undefined)
    return next();

  var address = getAddressFromDB(req.params.id);
  if (address.hasOwnProperty('error'))
    res.json(500, address)
  req.params.address = address;
  return next();

  var getAddressFromDB = function (arg) {
    if (arg !== undefined) {
      Address.findById(arg, function(err, data) {
        if (err)
          return { error: "Error occured: " + err}
        else return data;
      });
    }
  };

}

