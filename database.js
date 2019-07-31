
/*
	database.js: Database setup
*/

var creds = require('./credentials.js');
var mysql = require('mysql');

module.exports = {
	connection: mysql.createConnection({
	    host: 'localhost',
	    user: creds.MySQL_username,
	    password: creds.MySQL_password,
	    database: 'lick'
	}),

	// adds a new report to the database
	addReport: function(cb) {

	},

	// removes a report from database
	deleteReport: function(uid, cb) {

	}
}