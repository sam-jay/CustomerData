var mongoose = require('mongoose'),
    default_limit = 10;

// IMPORTANT: This method is finished. Don't fuck with it!
exports.present = function(req, res, next) {
  var respond,
      parseQuery,
      parsed_query = { };

  parseQuery = function(str) {
    return JSON.parse('{ "$and": [' + str.split('&&').map(function(str) {
      return '{ "$or": [' + str.split('||').map(function(str) {
        return '{' + str.split('=').map(function(str) {
          return '"' + str + '"';
        }).join(': ') + '}';
      }).join(', ') + '] }';
    }).join(', ') + '] }');
  }

  parsed_query = { };
  if (req.query.q !== undefined)
    try {
      parsed_query = parseQuery(req.query.q);
    } catch (e) {
      return res.json(400, {
        message: 'Invalid parameter'
      });
    }

  respond = function(err, data, type) {
    
    var plural = {
      'Country': 'countries',
      'City': 'cities',
      'Address': 'addresses',
      'Customer': 'customers'
    };
    
    var query_url = [
      req.query.q !== undefined ? 'q=' + req.query.q : '',
      req.query.fields !== undefined ? 'fields=' + req.query.fields : '',
      req.query.offset !== undefined ? 'offset=' + req.query.offset : '',
      req.query.limit !== undefined ? 'limit=' + req.query.limit : ''
    ].filter(function(e) { return e !== ''; }).join('&');

    if (err || data.length === 0)
      return res.json(404, {
        code: 'ResourceNotFound',
        message: '/api/' + plural[type] + (query_url.length > 0 ? '?' + query_url : '') +
          'does not exist'
      });

    return res.json(200, {
      data: data.map(function(obj) {
        return pretty(obj, type);
      }),
      url: '/api/' + plural[type] + (query_url.length > 0 ? '?' + query_url : '')
    });
  };

  if (req.params.pretty === true) 
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

var getObject = function(id, type) {
  return mongoose.model(type).findById(id, function(err, data) {
    return data; 
  });
}

var pretty = function(obj, type) {
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
          country: pretty(getObject(obj.country_id, 'Country'), 'Country'), 
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
          city: pretty(getObject(obj.city_id, 'City'), 'City'),
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
          address: pretty(getObject(obj.address_id, 'Address'), 'Address'),
          active: obj.active,
          create_date: obj.create_date.toLocaleString(),
          last_update: obj.last_update.toLocaleString()
        },
        url: '/api/customers/' + obj._id
      };
      break;
  };
};

