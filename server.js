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

// Country requests
server.get('/countries', controllers.country.getCountry);
server.get('/countries/:id', controllers.country.getCountry);
server.post('/countries', controllers.country.postCountry);
//server.put('/countries/:id', controllers.country.putCountry);
server.del('/countries/:id', controllers.country.delCountry);

// Customer requests
server.get('/customers', controllers.customer.getCustomer);
server.get('/customers/:id', controllers.customer.getCustomer);
server.post('/customers', controllers.customer.postCustomer);
server.del('/customers/:id', controllers.customer.delCustomer);

// City requests
server.get('/api/cities/:id/country', controllers.city.getCountry);

var port = 3000;
server.listen(port, function (err) {
  if (err)
    console.error(err);
  else
    console.log('Running on port: ' + port);
});

