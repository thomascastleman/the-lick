
const moment 	= require('moment');
const casual	= require('casual');
const con		= require('./database.js').connection;
const yt		= require('./youtube.js');

const NUM_REPORTS = 450;				// number of fake lick reports to generate
const ASSUMED_VIDEO_DURATION = 300;		// assumed duration (sec) of every video in test suite (oops)
const P_NOTES = 0.2;					// probability a report will have notes
const P_REPORTER = 0.4;					// probability a report includes a name

var today = moment();


var youtubeURLs = [];

// get a random timestamp assumed to be within the duration of every video in the test suite (lol)
function getRandomTimeStamp(duration) {
	return Math.floor(Math.random() * ASSUMED_VIDEO_DURATION);
}

// subtract random amount of minutes from current time to get random datetime
function getRandomDate() {
	return today.subtract(Math.floor(Math.random() * 525600), 'minutes').format();
}

// generate random reporter name
function getRandomName() {
	return Math.random() < P_REPORTER ? casual.full_name : null;
}

// get a random youtube URL from pool
function getRandomVideoURL() {
	return youtubeURLs[Math.floor(Math.random() * youtubeURLs.length)];
}

// get random sentence for notes, or nothing
function getRandomNotes() {
	return Math.random() < P_NOTES ? casual.sentence : null;
}

// add random reportings to database
function populateRandomReportings(cb) {
	var records = [];

	// for each report to generate
	for (var i = 0; i < NUM_REPORTS; i++) {
		records.push([
			getRandomDate(),		// date_reported
			getRandomName(),		// reporter_name
			getRandomVideoURL(),	// url
			getRandomTimeStamp(),	// lick_start
			getRandomNotes(),		// notes
 		]);
	}

	// insert generated data
	con.query('INSERT INTO reportings (date_reported, reporter_name, url, lick_start, notes) VALUES ?;', [records], function(err) {
		cb(err);
	});


	/*
		uid INT NOT NULL AUTO_INCREMENT,
		date_reported DATETIME,			-- time of reporting
		reporter_name VARCHAR(64),		-- optional, name of the reporter
		url VARCHAR(512),				-- video li(n)ck (without time shift)
		video_id VARCHAR(32),			-- YouTube's ID for this video
		video_title VARCHAR(64),		-- title of reported video
		lick_start INT,					-- in seconds, when in the video the lick occurs
		notes TEXT,						-- extra notes regarding this instance of the lick
	*/
}


populateRandomReportings(function(err) {
	if (!err) {
		console.log('Test data complete.');
	} else {
		throw err;
	}
});