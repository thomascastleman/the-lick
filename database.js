
/*
	database.js: Database setup
*/

var creds = require('./credentials.js');
var mysql = require('mysql');

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

	// get all video IDs available in reportings table
	getLicked: function(cb){
		con.query('SELECT video_id from reportings;', function(err, licks){
			if (!err){
				cb(err, licks);
			} else {
				cb(err);
			}
		});
	},

	// get the reporting information by UID
	getReporting: function(uid, cb){
		con.query('SELECT * from reportings where uid = ?;',[uid], function(err, rows){
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
	}
}