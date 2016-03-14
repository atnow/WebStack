// Require Node Modules
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var ParseCloud = require('parse-cloud-express');
var Parse = ParseCloud.Parse;

var app = express();

// Import your cloud code (which configures the routes)
require('./cloud/main.js');
// Mount the webhooks app to a specific path (must match what is used in scripts/register-webhooks.js)
app.use('/webhooks', ParseCloud.app);

// Host static files from public/
app.use(express.static(__dirname + '/public'));

app.use('/js', express.static(__dirname + '/public/js'));
app.use('/ThirdParty', express.static(__dirname + '/public/ThirdParty'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/views', express.static(__dirname + '/public/partials'));

app.all('/*', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('index.html', { root: __dirname + '/public'});
});

app.get('*', function(req, res, next) {
	res.sendFile('index.html', { root: __dirname + '/public'});
});

app.listen(8080);

//app.listen(3006);

/*
 * Launch the HTTP server
 */
var port = process.env.PORT || 5000;
var server = http.createServer(app);
server.listen(port, function() {
  console.log('Cloud Code Webhooks server running on port ' + port + '.');
});

