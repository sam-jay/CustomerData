var mongoose = require('mongoose'),
    async = require('async'),
    error = require('./error.js'),
    default_limit = 10; // Default page limit

exports.present = function(req, res, next) {
  var respond,
      parsed_query = { };

  parsed_query = { };
  if (req.query.q !== undefined)
    try {
      parsed_query = parseQuery(req.query.q);
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

    /* Begin callback hell */
    async.map(data, function(obj, callback) {
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
  .select(req.query.fields !== undefined ? req.query.fields.replace(',', ' ') : { })
  .skip(req.query.offset !== undefined ? req.query.offset : 0)
  .limit(req.query.limit !== undefined ? req.query.limit : default_limit)
  .exec(function (err, data) {
    return respond(err, data, req.params.prev);
  });

};

var parseQuery = function(str) {
  return JSON.parse('{ "$and": [' + str.split('&&').map(function(str) {
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

var _pretty = function(obj, type) {
  switch (type) {
    case 'Country':
      return {  
        data: { 
          country: obj.country,
          last_update: obj.last_update.toLocaleString() 
        },
        url: '/api/countries/' + obj._id
      };
      break;
    case 'City':
      return {
        data: { 
          city: obj.city, 
          country: obj.countryObj, 
          last_update: obj.last_update.toLocaleString()
        },
        url: '/api/cities/' + obj._id
      };
      break;
    case 'Address':
      return {
        data: {
          address: { line1: obj.address, line2: obj.address2 },
          district: obj.district,
          city: obj.cityObj,
          postal_code: obj.postal_code,
          phone: obj.postal_code,
          last_update: obj.last_update.toLocaleString()
        },
        url: '/api/addresses/' + obj._id
      };
      break;
    case 'Customer':
      return {
        data: {
          name: { first: obj.first_name, last: obj.last_name },
          email: obj.email,
          address: obj.addressObj,
          active: obj.active,
          create_date: obj.create_date.toLocaleString(),
          last_update: obj.last_update.toLocaleString()
        },
        url: '/api/customers/' + obj._id
      };
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