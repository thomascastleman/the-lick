
/*
	routes.js: System routes
*/

const moment = require('moment');
const db = require('./database.js');
const yt = require('./youtube.js');
const sys = require('./settings.js');

module.exports = {

	init: function(app) {

		// home page
		app.get('/', function(req, res) {
			db.getMoreReports(1, function(){

			});
			var render = {};

			// get all video IDs
			db.getRandomReportings(sys.reportsOnHomeVideos,function(err, video_ids){
				if (!err) {
					render.video_ids = video_ids;

					// get subset of reportings
					db.getReportingsLimited(sys.reportsOnHomeTable, function(err, licks) {
						if (!err) {
							render.recentLicks = licks;

							for (var row = 0; row < licks.length; row++){
								// parse date reported into human readable format
								var d = moment(licks[row].date_reported);
								if (d && d.isValid()) licks[row].date_reported = d.format('MMMM Do, YYYY [at] h:mm A');

								licks[row].reporter_exists = licks[row].reporter_name !== null;
							}

							res.render('home.html', render);
						} else {
							res.render('error.html', { raw: err });
						}
					});
				} else {
					res.render('error.html', { raw: err });
				}
			});
		});

		// individual lick reporting page
		app.get('/lick/:id', function(req, res) {
			var uid = req.params.id;
			var render = {};

			// get info for this reporting
			db.getReporting(uid, function(err, lick){
				if (!err) {
					// register that reporter & notes & video title exist
					lick.reporter_exists = lick.reporter_name != null && lick.reporter_name != '';
					lick.notes_exist = lick.notes != null && lick.notes != '';
					lick.title_exists = lick.video_title != null && lick.video_title != '';

					// parse date reported into human readable format
					var d = moment(lick.date_reported);
					if (d && d.isValid()) lick.date_reported = d.format('MMMM Do, YYYY [at] h:mm A');

					// convert lick start from seconds to time string
					lick.lick_start_string = yt.convertToTimeString(lick.lick_start);

					// cache lick info in render object
					render.report = lick;

					res.render('lick.html', render);
				} else {
					res.render('error.html', { raw: err });
				}
			});
			
		});

		// get page for reporting the lick
		app.get('/report', function(req, res) {
			res.render('report.html');
		});

		app.get('/getMoreLicks/:lastID', function(req, res) {
			var lastID = req.params.lastID;
			db.getMoreReports(lastID, function(err, licks){
				if (!err && licks !== undefined){
					res.send({ data: licks, err: err })
				}

				
			});
		});


		// post a new report of the lick
		app.post('/report', function(req, res) {
			// ensure non-empty URL given
			if (req.body.url) {

				// attempt to extract YouTube video ID from the given URL
				var video_id = yt.getVideoID(req.body.url);

				// if video ID successfully extracted
				if (video_id) {
					// check for a t offset parameter in the URL itself 
					var parsedT = yt.parsePlaybackOffset(req.body.url);

					// consolidated / parsed video data
					videoData = {
						reporter_name: req.body.reporter_name || null,
						url: req.body.url,
						video_id: video_id,
						lick_start: parsedT || yt.parseStartTimeToSec(req.body.lick_start),
						notes: req.body.notes || null
					};


					if (!videoData.lick_start) {
						res.render('error.html', { raw: "Failed to add reporting as a lick occurrence timestamp was provided neither explicitly nor in the video URL. (Please indicate when the lick occurs)" });
					} else {
						// attempt to extract video title
						yt.getVideoMeta(videoData.video_id, function(err, meta) {
							if (!err) {
								// add title to video data
								videoData.video_title = meta.title;
							}

							// add new record to reportings table
							db.addReporting(videoData, function(err, uid) {
								if (!err) {
									// redirect to lick page for the newly added lick sighting
									res.redirect('/lick/' + uid);
								} else {
									// register error
									res.render('error.html', { raw: err });
								}
							});
						});
					}
				} else {
					res.render('error.html', { raw: "Failed to extract YouTube video ID from provided URL." });
				}
			} else {
				res.render('error.html', { raw: "Failed to add report as no URL was provided." });
			}
		});

	}

}