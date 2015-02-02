var mongoose = require('mongoose'),
      Country = mongoose.model('Country');

exports.getCountry = function(req, res) {
  if (!(req.params.id === undefined ||
    req.params.id === '')) {
    Country.findById(req.params.id, function(err, data) {
      if (err) {
        res.status(500);
        res.json({
          message: 'Error occured: ' + err
        });
      } else {
        res.json({
          name: data.name,
          link: 'countries/' + data._id
        });
      }
    });
  } else {
    Country.find({}, function(err, data) {
      if (err) {
        res.status(500);
        res.json({
          message: 'Error occured: ' + err
        });
      } else {
        var i, result = [];
        for (i = 0; i < data.length; i++) {
          result[i] = {
            name: data[0].name,
            link: 'countries/' + data[0]._id
          };
        }
        res.json(result);
      }
    })
  }
}

exports.delCountry = function(req, res) {
  if (!(req.params.id === undefined ||
    req.params.id === '')) {
    Country.findByIdAndRemove(req.params.id, function(err, data) {
      if (err) {
        res.status(500);
        res.json({
          message: 'Error occured: ' + err
        });
      } else {
        res.json({
          message: 'Delete successful'
        });
      }
    });
  }
}