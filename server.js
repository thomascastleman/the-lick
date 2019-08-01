const express 			= require('express');
const app 				= express();
const mustacheExpress 	= require('mustache-express');
const bodyParser 		= require('body-parser');
const creds				= require('./credentials.js');
const sys 				= require('./settings.js');
const youtube			= require('./youtube.js')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.engine('html', mustacheExpress());
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));

const routes = require('./routes.js').init(app);

// start server
var server = app.listen(sys.PORT, function() {
	console.log('The Lick server licking on port %d', server.address().port);
});