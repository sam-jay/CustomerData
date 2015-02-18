(function() {
  'use strict';

  /* Dependencies */
  var mongoose = require('mongoose'),
      validator = require('validator'),
      Country = mongoose.model('Country'),
      City = mongoose.model('City'),
      queue = require('./queue.js'),
      error = require('./error.js');

  exports.getCity = function(req, res, next) {
    req.params.prev = 'City';

    /* If ID is given, find city */
    if (req.params.id !== undefined) {
      City.findById(req.params.id, function(err, data) {
        if (err)
          return error.respond(404, res, '/api/cities/' + req.params.id);
        req.params.pretty = 'true';
        req.params.data = data;
        return next();
      });

    /* Otherwise call the next function */
    } else {
      return next();
    }
  };

  exports.postCity = function(req, res, next) {
    var city_name,
        country_ID,
        queued_request;

    /* Attempt to get country name from request body */
    try { 
      city_name = JSON.parse(req.body).city;
      country_ID = JSON.parse(req.body).country_id;
    } catch (e) { 
      return error.respond(400, res, 'Cannot parse input');
    }
    if (validator.isNull(city_name) ||  validator.isNull(country_ID))
      return error.respond(400, res, 'Cannot parse input'); 
    // look for country ID
      //country does not exit - respond with error messaage
    /* Add this request to the queue */
    queued_request = queue.push(10000);
    res.json(202, {
      message: 'Resource accepted (Operation Pending)',
      url: '/api/queued_requests/' + queued_request._id
    });

        /* Save new country */
    var city = new City();
    city.city = city_name;
    city.country_id = country_ID;
    city.save(function(err, city) {
      if (err)
        return queued_request.setStatus('Failed');

      queued_request.setStatus('Success');
      return queued_request.setResource('/api/cities/' 
        + city._id);
    });
  }

})();

// // Dependencies
// var mongoose = require('mongoose'),
//     City = mongoose.model('City');

// // IMPORTANT: This method is done. Don't fuck with it.
// exports.getCity = function(req, res, next) {
//   req.params.prev = 'City';
//   if (req.params.id !== undefined) {
//     City.findById(req.params.id, function(err, data) {
//       if (err)
//         return res.json(404, {
//           message: 'Resource not found'
//         });
//       req.params.pretty = true;
//       req.params.data = data;
//       req.params.id = data.country_id;
//       return next();
//     });
//   } else
//     return next();
// };

// exports.postCity = function(req, res, next) {
//   var name = JSON.parse(req.body).name;
//   var countryID = JSON.parse(req.body).country;
//   if (!(name === undefined ||
//     name === '')) {
//     Country.findById(countryID, function(err, data) {
//       if (err) {
//         res.json(500, {
//           message: 'Error occured: ' + err
//         });
//       } else {
//         var city = new City();
//         city.name = name;
//         city.country = countryID;
//         city.last_update = new Date();
//         city.save(function () {
//           res.send(req.body);
//         });
//       }
//     });
//   }
// }

// exports.putCity = function(req, res, next) {
//   if (!(req.params.id === undefined ||
//     req.params.id === '')) {
//     City.findById(req.params.id, function(err, data) {
//       if (err) {
//         res.json(500, {
//           message: 'Error occured: ' + err
//         });
//       } else {
//         var name = JSON.parse(req.body).name;
//         if (!(name === undefined ||name === '')) {
//           data.name = name;
//         }
//         //should we even allow for this?
//         var countryID = JSON.parse(req.body).country;
//         if (!(countryID === undefined || countryID === '')) {
//           data.country = countryID;
//         }
//         data.last_update = new Date();
//         res.json(200, {
//           name: data.name,
//           country: data.country,
//           link: 'cities/' + data._id
//         });
//       }
//     });
//   }
// }


// exports.delCity = function(req, res, next) {
//   if (!(req.params.id === undefined ||
//     req.params.id === '')) {
//     City.findByIdAndRemove(req.params.id, function(err, data) {
//       if (err) {
//         res.json(500, {
//           message: 'Error occured: ' + err
//         });
//       } else {
//         res.json(204, {
//           message: 'Delete successful'
//         });
//       }
//     });
//   }
// }

// exports.query = function(req, res, next) {
//   console.log(req.params);
// }
