var mongoose = require('mongoose'),
    Country = mongoose.model('Country'),
    ObjectId = mongoose.Types.ObjectId;

exports.getCountry = function(req, res) {
  console.log('trigger');
  Country.find({}, function(err, country) {
    if (err) {
      res.status(500);
      res.json({
        data: 'Error occured: ' + err
      });
    } else {
      res.json({

      });
    }
  })
};
