// Dependencies
var mongoose = require('mongoose'),
    City = mongoose.model('City');

// IMPORTANT: This method is done. Don't fuck with it.
exports.getCity = function(req, res, next) {
  req.params.prev = 'City';
  if (req.params.id !== undefined) {
    mongoose.model('City').findById(req.params.id, function(err, data) {
      if (err)
        return res.json(404, {
          message: 'Resource not found'
        });
      req.params.pretty = true;
      req.params.data = data;
      req.params.id = data.country_id;
      return next();
    });
  } else
    return next();
};

exports.postCity = function(req, res, next) {
  var name = JSON.parse(req.body).name;
  var countryID = JSON.parse(req.body).country;
  if (!(name === undefined ||
    name === '')) {
    Country.findById(countryID, function(err, data) {
      if (err) {
        res.json(500, {
          message: 'Error occured: ' + err
        });
      } else {
        var city = new City();
        city.name = name;
        city.country = countryID;
        city.last_update = new Date();
        city.save(function () {
          res.send(req.body);
        });
      }
    });
  }
}

exports.putCity = function(req, res, next) {
  if (!(req.params.id === undefined ||
    req.params.id === '')) {
    City.findById(req.params.id, function(err, data) {
      if (err) {
        res.json(500, {
          message: 'Error occured: ' + err
        });
      } else {
        var name = JSON.parse(req.body).name;
        if (!(name === undefined ||name === '')) {
          data.name = name;
        }
        //should we even allow for this?
        var countryID = JSON.parse(req.body).country;
        if (!(countryID === undefined || countryID === '')) {
          data.country = countryID;
        }
        data.last_update = new Date();
        res.json(200, {
          name: data.name,
          country: data.country,
          link: 'cities/' + data._id
        });
      }
    });
  }
}


exports.delCity = function(req, res, next) {
  if (!(req.params.id === undefined ||
    req.params.id === '')) {
    City.findByIdAndRemove(req.params.id, function(err, data) {
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
