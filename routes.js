
/*
	routes.js: System routes
*/

module.exports = {

	init: function(app) {

		// home page
		app.get('/', function(req, res) {

		});

		// individual lick reporting page
		app.get('/lick/:id', function(req, res) {

		});

		// page with all lick reportings
		app.get('/licks', function(req, res) {

		});
	}

}