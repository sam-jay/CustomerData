var mongoose = require('mongoose'),
    async = require('async'),
    error = require('./error.js'),
    validator = require('validator'),
    default_limit = 10; // Default page limit

exports.present = function(req, res, next) {
  var respond,
      parsed_query = { };

  parsed_query = { };
  if (req.query.q !== undefined)
    try {
      parsed_query = parseQuery(req.query.q.substring(1, req.query.q.length - 1));
    } catch (e) {
      return error.respond(400, res, 'Invalid query');
    }

  respond = function(err, data, type) {
    if (err || data.length === 0)
      return res.json(404, {
        code: 'ResourceNotFound',
        message: getUrl(req.query, type) +
          'does not exist'
      });

    async.map(data, function(obj, callback) {
      if (!validator.isNull(req.query.fields))
        obj.fields = req.query.fields.toLowerCase().split(',');
      pretty(obj, type, function(data) {
        callback(null, data);
      });
    }, function(err, result) {
      return res.json(200, {
        data: result,
        url: getUrl(req.query, type)
      })
    });
  };
  
  if (req.params.pretty)
    return respond(0, [req.params.data], req.params.prev);

  // req.params.prev contains the name of Model we're looking up
  mongoose.model(req.params.prev)
  .find(parsed_query)
  .skip(req.query.offset !== undefined ? req.query.offset : 0)
  .limit(req.query.limit !== undefined ? req.query.limit : default_limit)
  .exec(function (err, data) {
    return respond(err, data, req.params.prev);
  });

};

var parseQuery = function(str) {
  return JSON.parse('{ "$and": [' + str.split('&').map(function(str) {
    return '{ "$or": [' + str.split('||').map(function(str) {
      return '{' + str.split('=').map(function(str) {
        return '"' + str + '"';
      }).join(': ') + '}';
    }).join(', ') + '] }';
  }).join(', ') + '] }');
}

var getUrl = function (query, type) {

  var plural = {
    'Country': 'countries',
    'City': 'cities',
    'Address': 'addresses',
    'Customer': 'customers'
  };

  var query_url = [
  query.q !== undefined ? 'q=' + query.q : '',
  query.fields !== undefined ? 'fields=' + query.fields : '',
  query.offset !== undefined ? 'offset=' + query.offset : '',
  query.limit !== undefined ? 'limit=' + query.limit : ''
  ].filter(function(e) { return e !== ''; }).join('&');

  return '/api/' + plural[type] + (query_url.length > 0 ? '?' + query_url : '');
}

var getObject = function(id, type, callback) {
  mongoose.model(type).findById(id, function(err, data) {
    return callback(data);
  });
}

Array.prototype.contains = function(element) {
  return this.indexOf(element) > -1;
};

var _pretty = function(obj, type) {
  switch (type) {

    case 'Country':

      var country = {
        data: {},
        url: '/api/countries/' + obj._id
      };

      if (validator.isNull(obj.fields) || obj.fields.contains('country'))
        country.data.country = obj.country;
      if (validator.isNull(obj.fields) || obj.fields.contains('last_update'))
        country.data.last_update = obj.last_update;

      return country;
      break;

    case 'City':

      var city = {
        data: {},
        url: '/api/cities/' + obj._id
      };

      if (validator.isNull(obj.fields) || obj.fields.contains('city'))
        city.data.city = obj.city;
      if (validator.isNull(obj.fields) || obj.fields.contains('country'))
        city.data.country = obj.countryObj;
      if (validator.isNull(obj.fields) || obj.fields.contains('last_update'))
        city.data.last_update = obj.last_update.toLocaleString();

      return city;
      break;

    case 'Address':

      var address = {
        data: {},
        url: '/api/addresses/' + obj._id
      };

      if (validator.isNull(obj.fields) || obj.fields.contains('address'))
        address.data.address = { line1: obj.address, line2: obj.address2 };
      else if (validator.isNull(obj.fields) || obj.fields.contains('address.line1'))
        address.data.address = { line1: obj.address };
      else if (validator.isNull(obj.fields) || obj.fields.contains('address.line2'))
        address.data.address = { line2: obj.address2 };
      if (validator.isNull(obj.fields) || obj.fields.contains('district'))
        address.data.district = obj.district;
      if (validator.isNull(obj.fields) || obj.fields.contains('city'))
        address.data.city = obj.cityObj;
      if (validator.isNull(obj.fields) || obj.fields.contains('postal_code'))
        address.data.postal_code = obj.postal_code;
      if (validator.isNull(obj.fields) || obj.fields.contains('phone'))
        address.data.phone = obj.phone;
      if (validator.isNull(obj.fields) || obj.fields.contains('last_update'))
        address.data.last_update = obj.last_update.toLocaleString();

      return address;
      break;

    case 'Customer':

      var customer = {
        data: {},
        url: '/api/customers/' + obj._id
      };

      if (validator.isNull(obj.fields) || obj.fields.contains('name'))
        customer.data.name = { first: obj.first_name, last: obj.last_name };
      else if (validator.isNull(obj.fields) || obj.fields.contains('name.first'))
        customer.data.name = { first: obj.first_name };
      else if (validator.isNull(obj.fields) || obj.fields.contains('name.last'))
        customer.data.name = { last: obj.last_name };
      if (validator.isNull(obj.fields) || obj.fields.contains('email'))
        customer.data.email = obj.email;
      if (validator.isNull(obj.fields) || obj.fields.contains('address'))
        customer.data.address = obj.addressObj;
      if (validator.isNull(obj.fields) || obj.fields.contains('active'))
        customer.data.active = obj.active;
      if (validator.isNull(obj.fields) || obj.fields.contains('create_date'))
        customer.data.create_date = obj.create_date.toLocaleString();
      if (validator.isNull(obj.fields) || obj.fields.contains('last_update'))
        customer.data.last_update = obj.last_update.toLocaleString();

      return customer;
      break;
  }
};

var pretty = function(obj, type, callback) {
  switch (type) {
    case 'Country':
      return callback(_pretty(obj, type));
      break;
    case 'City':
      getObject(obj.country_id, 'Country', function(country) {
        obj.countryObj = _pretty(country, 'Country');
        return callback(_pretty(obj, 'City'));
      });
      break;
    case 'Address':
      getObject(obj.city_id, 'City', function(city) {
        getObject(city.country_id, 'Country', function(country) {
          city.countryObj = _pretty(country, 'Country');
          obj.cityObj = _pretty(city, 'City');
          return callback(_pretty(obj, 'Address'));
        })
      });
      break;
    case 'Customer':
      getObject(obj.address_id, 'Address', function(address) {
        getObject(address.city_id, 'City', function(city) {
          getObject(city.country_id, 'Country', function(country) {
            city.countryObj = _pretty(country, 'Country');
            address.cityObj = _pretty(city, 'City');
            obj.addressObj = _pretty(address, 'Address');
            return callback(_pretty(obj, 'Customer'));
          })
        })
      });
      break;
  };
};