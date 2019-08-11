const express 			= require('express');
const app 				= express();
const mustacheExpress 	= require('mustache-express');
const bodyParser 		= require('body-parser');
const cookieParser 		= require('cookie-parser');
const passport			= require('passport');
const session 			= require('cookie-session');
const creds				= require('./credentials.js');
const sys 				= require('./settings.js');
const youtube			= require('./youtube.js')

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.engine('html', mustacheExpress());
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));

// configure session
app.use(session({ 
	secret: creds.SESSION_SECRET,
	name: 'session',
	resave: true,
	saveUninitialized: true
}));

// import local modules for routes / all other functionality
const auth = require('./auth.js').init(app, passport);
const routes = require('./routes.js').init(app);

// unhandled routes redirect to home
app.get('*', (req, res) => { res.redirect('/'); });

// allow server to licken
var server = app.listen(sys.PORT, function() {
	console.log('The Lick server lickening on port %d', server.address().port);
});