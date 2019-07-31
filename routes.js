
/*
	routes.js: System routes
*/
const database = require('./database.js');

module.exports = {

	init: function(app) {

		// home page
		app.get('/', function(req, res) {
			//console.log("//")
			database.getLicked(function(video_ids){
				res.render('home.html',{video_ids:video_ids});
			});
		});

		// individual lick reporting page
		app.get('/lick/:id', function(req, res) {
			res.render('lick.html');
		});

		// get page for reporting the lick
		app.get('/report', function(req, res) {
			res.render('report.html');
		});

		// post a new report of the lick
		app.post('/report', function(req, res) {
			console.log(req.body);
			res.render('report.html');
		});

	}

}