// Modules
var restify = require('restify'),
    mongoose = require('mongoose'),
    fs = require('fs');

// Database
mongoose.connect('mongodb://localhost/CustomerData');

// Models
var models = {};
fs.readdirSync('./models').forEach(function (file) {
  if (file.indexOf('.js') != -1) {
    models[file.split('.')[0]] = require('./models/' + file);
  }
});

// Controllers
var controllers = {};
fs.readdirSync('./controllers').forEach(function (file) {
  if (file.indexOf('.js') != -1) {
    controllers[file.split('.')[0]] = require('./controllers/' + file);
  }
});

// Create Server
var server = restify.createServer();

server.use(restify.fullResponse());
server.use(restify.bodyParser());
server.use(restify.queryParser());

// Queued requests
server.get('/api/queued_requests/:id', controllers.queue.getQueuedRequest);

// Country requests
server.get('/api/countries', controllers.country.getCountry, controllers.presenter.present);
server.get('/api/countries/:id', controllers.country.getCountry, controllers.presenter.present);
server.post('/api/countries', controllers.country.postCountry);
server.put('/api/countries/:id', controllers.country.putCountry);
server.del('/api/countries/:id', controllers.country.delCountry);

/*
// City requests
server.get('/api/cities', controllers.city.getCity, controllers.presenter.present);
server.get('/api/cities/:id', controllers.city.getCity, controllers.presenter.present);
server.get('/api/cities/:id/country', controllers.city.getCity, 
									  controllers.country.getCountry,
									  controllers.presenter.present);
server.post('/api/cities', controllers.city.postCity);
server.put('/api/cities/:id', controllers.city.putCity);
server.del('/api/cities/:id', controllers.city.delCity);

// Address requests
server.get('/api/addresses', controllers.address.getAddress, controllers.presenter.present);
server.get('/api/addresses/:id', controllers.address.getAddress, controllers.presenter.present);
server.get('/api/addresses/:id/city', controllers.address.getAddress, 
									  controllers.city.getCity,
									  controllers.presenter.present);
server.get('/api/addresses/:id/city/country', controllers.address.getAddress, 
											  controllers.city.getCity,
											  controllers.country.getCountry,
											  controllers.presenter.present);
server.post('/api/addresses', controllers.address.postAddress);
server.put('/api/addresses/:id', controllers.address.putAddress);
server.del('/api/addresses/:id', controllers.address.delAddress);


// Customer requests
server.get('/api/customers', controllers.customer.getCustomer, controllers.presenter.present);
server.get('/api/customers/:id', controllers.customer.getCustomer, controllers.presenter.present);
server.get('/api/customers/:id/address', controllers.customer.getCustomer,
                                         controllers.address.getAddress,
                                         controllers.presenter.present);
server.get('/api/customers/:id/address/city', controllers.customer.getCustomer,
                                              controllers.address.getAddress,
                                              controllers.city.getCity,
                                              controllers.presenter.present);
server.get('/api/customers/:id/address/city/country', controllers.customer.getCustomer, 
                                                      controllers.address.getAddress,
                                                      controllers.city.getCity,
                                                      controllers.country.getCountry,
                                                      controllers.presenter.present);
server.post('/api/addresses', controllers.address.postAddress);
server.put('/api/addresses/:id', controllers.address.putAddress);
server.del('/api/addresses/:id', controllers.address.delAddress);
*/

var port = 3000;
server.listen(port, function (err) {
  if (err)
    console.error(err);
  else
    console.log('Running on port: ' + port);
});

