// Dependencies
var mongoose = require('mongoose'),
    Country = mongoose.model('Country');

exports.getCountry = function(req, res, next) {
  console.log(req.params.q);
  if (!(req.params.id === undefined ||
    req.params.id === '')) {
    Country.findById(req.params.id, function(err, data) {
      if (err) {
        res.json(500, {
          message: 'Error occured: ' + err
        });
      } else {
        res.json(200, {
          name: data.name,
          link: 'countries/' + data._id
        });
      }
    });
  } else {
    Country.find({}, function(err, data) {
      if (err) {
        res.json(500, {
          message: 'Error occured: ' + err
        });
      } else {
        var i, results = [];
        for (i = 0; i < data.length; i++) {
          results[i] = {
            name: data[i].name,
            link: 'countries/' + data[i]._id
          };
        }
        res.json(200, results);
      }
    })
  }
}

exports.postCountry = function(req, res, next) {
  var name = JSON.parse(req.body).name;
  if (!(name === undefined ||
    name === '')) {
    var country = new Country();
    country._id = mongoose.Types.ObjectId();
    console.log(country._id);
    country.name = name;
    country.last_update = new Date();
    country.save(function () {
      res.send(req.body);
    });
  }
}

exports.delCountry = function(req, res, next) {
  if (!(req.params.id === undefined ||
    req.params.id === '')) {
    Country.findByIdAndRemove(req.params.id, function(err, data) {
      if (err) {
        res.json(500, {
          message: 'Error occured: ' + err
        });
      } else {
        res.json(204, {
          message: 'Delete successful'
        });
      }
    });
  }
}

exports.query = function(req, res, next) {
  console.log(req.params);
}
