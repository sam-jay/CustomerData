// Modules
var restify = require('restify'),
    mongoose = require('mongoose'),
    fs = require('fs');

mongoose.connect('mongodb://localhost/CustomerData');
// Models
var Country = require('./models/country.js');

// Controllers
var controllers = {};
fs.readdirSync('./controllers').forEach(function (file) {
  if (file.indexOf('.js') != -1) {
    controllers[file.split('.')[0]] = require('./controllers/' + file);
  }
});

var server = restify.createServer();

server.use(restify.fullResponse());
server.use(restify.bodyParser());

server.get('/countries', controllers.country.getCountry);

var port = 3000;
server.listen(port, function (err) {
  if (err)
    console.error(err);
  else
    console.log('Running on port: ' + port);
});

