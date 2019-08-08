
/*
	database.js: Database setup & query functions
*/

const creds = require('./credentials.js');
const mysql = require('mysql');
const sys = require('./settings.js')
const moment = require('moment');

const con = mysql.createConnection({
	host: 'localhost',
	user: creds.MySQL_username,
	password: creds.MySQL_password,
	database: 'lick',
	multipleStatements: true
});

module.exports = {
	connection: con,

	// adds a new report to the database, callback on record UID
	addReporting: function(data, cb) {
		// make insert query into reportings table, and get ID of inserted record
		con.query('INSERT INTO reportings (date_reported, reporter_name, url, video_id, video_title, lick_start, notes) VALUES (NOW(), ?, ?, ?, ?, ?, ?); SELECT LAST_INSERT_ID() AS uid;', [data.reporter_name, data.url, data.video_id, data.video_title, data.lick_start, data.notes], function(err, rows) {
			if (!err && rows !== undefined && rows.length > 1 && rows[1].length > 0) {
				cb(err, rows[1][0].uid);
			} else {
				cb(err || "Failed to determine UID of last added report.");
			}
		});
	},

	// remove a reporting from the db
	deleteReporting: function(uid, cb) {
		// ensure UID exists
		if (uid) {
			// make delete query
			con.query('DELETE FROM reportings WHERE uid = ?;', [uid], cb);
		} else {
			cb("Failed to remove reporting as no identifier provided.");
		}
	},

	// retrieve more lick reports to load onto the homepage as a user scrolls
	getMoreReports: function(last_id, cb) {
		var reloadRate = sys.SCROLL_RELOAD_RATE;	// get system reload rate
		last_id = parseInt(last_id);

		// select more reports from reportings table
		con.query('SELECT * from reportings ORDER BY uid DESC LIMIT ?, ? ;', [last_id, last_id + reloadRate], function(err, licks){
			if (!err && licks !== undefined){
				for (var row = 0; row < licks.length; row++){
					// parse date reported into human readable format
					var d = moment(licks[row].date_reported);
					if (d && d.isValid()) licks[row].date_reported = d.format('MMMM Do, YYYY [at] h:mm A');

					// check if a reporter name exists, for mustache
					licks[row].reporter_exists = licks[row].reporter_name !== null;
				}

				// callback successfully on the extra licks
				cb(err, licks);
			} else {
				cb(err || "Failed to retrieve more licks.");
			}
		});
	},

	// get a random subset of lick reportings
	getRandomReportings: function(limit, cb){
		con.query('SELECT * from reportings ORDER BY RAND() LIMIT ?;', [limit], function(err, licks){
			if (!err && licks !== undefined){
				cb(err, licks);
			} else {
				cb(err || "Failed to retrieve random subset of licks.");
			}
		});
	},

	// get a limited amount of the most recent reportings
	getRecentReportings: function(limit, cb) {
		con.query('SELECT * from reportings ORDER BY uid DESC LIMIT ?;', [limit], function(err, licks){
			if (!err){
				cb(err, licks);
			} else {
				cb(err);
			}
		});
	},

	// get a single reporting's information by UID
	getReporting: function(uid, cb){
		con.query('SELECT * from reportings where uid = ?;', [uid], function(err, rows){
			if (!err && rows !== undefined && rows.length > 0) {
				cb(err, rows[0]);
			} else {
				cb(err || "Failed to retrieve reporting information.");
			}
		});
	},

	// add a new moderator to the system
	addModerator: function(name, email, cb) {
		// ensure name and email given
		if (name && email) {
			// make insert query
			con.query('INSERT INTO moderators (name, email) VALUES (?, ?);', [name, email], cb);
		} else {
			cb("Failed to add moderator as not all fields were supplied.");
		}
	}
}