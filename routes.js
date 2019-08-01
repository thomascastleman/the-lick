
/*
	routes.js: System routes
*/
const database = require('./database.js');

const db = require('./database.js');
const yt = require('./youtube.js');

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
			var uid = req.params.id;
			//console.log(uid)
			database.getReporting(uid, function(lick){
				console.log(lick)
				res.render('lick.html', {report:lick});
			});
			
		});

		// get page for reporting the lick
		app.get('/report', function(req, res) {
			res.render('report.html');
		});

		// post a new report of the lick
		app.post('/report', function(req, res) {
			console.log(req.body);

			// video data to give to addReporting function
			videoData = {
				reporter_name: req.body.reporter_name || null,
				url: yt.cleanURL(req.body.url),
				video_id: yt.getVideoID(req.body.url),
				lick_start: yt.parseStartTime(req.body.lick_start),
				notes: req.body.notes || null
			};

			// extract video title
			yt.getVideoTitle(videoData.video_id, function(err, title) {
				if (!err) {
					// add title to video data
					videoData.video_title = title;
				}

				// add new record to reportings table
				db.addReporting(videoData, function(err, uid) {
					console.log(err);
					if (!err) {
						// redirect to lick page for the newly added lick sighting
						res.redirect('/lick/' + uid);
					} else {
						// register error
						res.render('error.html', { raw: err });
					}
				});
			});


			// 	reporter_name: "Thomas Castleman",
			// 	url: "https://www.youtube.com/watch?v=30FTr6G53VU",
			// 	video_id: "30FTr6G53VU",
			// 	video_title: "Giant Steps",
			// 	lick_start: "01:29",
			// 	notes: "The lick happens."


		});

	}

}