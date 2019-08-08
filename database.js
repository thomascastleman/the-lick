
/*
	database.js: Database setup
*/

var creds = require('./credentials.js');
var mysql = require('mysql');
var settings = require('./settings.js')
var moment = require('moment');

var con = mysql.createConnection({
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

	getMoreReports: function(last_id, cb){
		var reloadRate = settings.reloadRate;
		last_id = parseInt(last_id);
		con.query('SELECT * from reportings LIMIT ?, ? ;',[last_id, last_id+reloadRate], function(err, licks){
			if (!err && licks !== undefined){
				for (var row = 0; row < licks.length; row++){
					// parse date reported into human readable format
					var d = moment(licks[row].date_reported);
					if (d && d.isValid()) licks[row].date_reported = d.format('MMMM Do, YYYY [at] h:mm A');

					licks[row].reporter_exists = licks[row].reporter_name !== null;
				}
				cb(err, licks);
			} else {
				cb(err || "Failed to retrieve more licks.");
			}

		});

	},

	// get a random subset of lick reportings
	getRandomReportings: function(limit, cb){
		con.query('SELECT * from reportings ORDER BY RAND() LIMIT ?;',[limit], function(err, licks){
			if (!err && licks !== undefined){
				cb(err, licks);
			} else {
				cb(err || "Failed to retrieve random subset of licks.");
			}
		});
	},

	// get a limited amount of reportings
	getReportingsLimited: function(limit, cb) {
		con.query('SELECT * from reportings', [limit], function(err, licks){
			if (!err){
				cb(err, licks);
			} else {
				cb(err);
			}
		});
	},

	// get the reporting information by UID
	getReporting: function(uid, cb){
		con.query('SELECT * from reportings where uid = ?;', [uid], function(err, rows){
			if (!err && rows !== undefined && rows.length > 0) {
				cb(err, rows[0]);
			} else {
				cb(err || "Failed to retrieve reporting information.");
			}
		});
	},

	// removes a report from database
	deleteReporting: function(uid, cb) {
		// make delete query
		con.query('DELETE FROM reportings WHERE uid = ?;', [uid], function(err) {
			cb(err);
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
	}
}