
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

	getLicked: function(callback){
		con.query('SELECT video_id from reportings;', function(err, licks){
			if (!err){
				console.log(licks)
				callback(licks);
			} else {
				console.log(err);
			}
		});
	},

	getReporting: function(uid, callback){
		con.query('SELECT * from reportings where uid = ?;',[uid], function(err, lick){
			if (!err){
				console.log(lick)
				callback(lick);
			} else {
				console.log(err);
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


// module.exports.addReporting({
// 	reporter_name: "Thomas Castleman",
// 	url: "https://www.youtube.com/watch?v=30FTr6G53VU",
// 	video_id: "30FTr6G53VU",
// 	video_title: "Giant Steps",
// 	lick_start: "01:29",
// 	notes: "The lick happens."
// }, function(err, uid) {
// 	console.log(err, uid);
// })