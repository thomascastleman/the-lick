const express 			= require('express');
const app 				= express();
const mustacheExpress 	= require('mustache-express');
const bodyParser 		= require('body-parser');
const creds				= require('./credentials.js');
const sys 				= require('./settings.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.engine('html', mustacheExpress());
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));

// send licks
app.get('/', function(req, res) {
	res.send('licks');
});

// start server
var server = app.listen(sys.PORT, function() {
	console.log('The Lick server listening on port %d', server.address().port);
});

/*
'https://www.youtube.com/oembed?url=http%3A//www.youtube.com/watch%3Fv%3D' + <video id> + '&format=json'
*/