
const moment 	= require('moment');
const casual	= require('casual');
const con		= require('./database.js').connection;
const yt		= require('./youtube.js');

const NUM_REPORTS = 450;				// number of fake lick reports to generate
const ASSUMED_VIDEO_DURATION = 300;		// assumed duration (sec) of every video in test suite (oops)
const P_NOTES = 0.2;					// probability a report will have notes
const P_REPORTER = 0.4;					// probability a report includes a name

var today = moment();

// some random jazz YouTube videos
var youtubeURLs = ['https://www.youtube.com/watch?v=30FTr6G53VU', 'https://www.youtube.com/watch?v=__OSyznVDOY&list=PLp7pAH9am84PBSXodlLRtdWaUrOjZx58M', 'https://www.youtube.com/watch?v=dH3GSrCmzC8&list=PLp7pAH9am84PBSXodlLRtdWaUrOjZx58M&index=2', 'https://www.youtube.com/watch?v=Cv9NSR-2DwM&list=PLp7pAH9am84PBSXodlLRtdWaUrOjZx58M&index=3', 'https://www.youtube.com/watch?v=8B1oIXGX0Io&list=PLp7pAH9am84PBSXodlLRtdWaUrOjZx58M&index=4', 'https://www.youtube.com/watch?v=UTORd2Y_X6U&list=PLp7pAH9am84PBSXodlLRtdWaUrOjZx58M&index=5', 'https://www.youtube.com/watch?v=CWeXOm49kE0&list=PLp7pAH9am84PBSXodlLRtdWaUrOjZx58M&index=7', 'https://www.youtube.com/watch?v=dqn3PF_DcSg&list=PLp7pAH9am84PBSXodlLRtdWaUrOjZx58M&index=8', 'https://www.youtube.com/watch?v=s4rXEKtC8iY&list=PLp7pAH9am84PBSXodlLRtdWaUrOjZx58M&index=9'];

// get a random timestamp assumed to be within the duration of every video in the test suite (lol)
function getRandomTimeStamp(duration) {
	return Math.floor(Math.random() * ASSUMED_VIDEO_DURATION);
}

// subtract random amount of minutes from current time to get random datetime
function getRandomDate() {
	return today.subtract(Math.floor(Math.random() * 525600), 'minutes').format('YYYY-MM-DD hh:mm:ss');
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

// get a random fake video title
function getRandomVideoTitle() {
	return casual.title;
}

// add random reportings to database
function populateRandomReportings(cb) {
	var records = [];

	// for each report to generate
	for (var i = 0; i < NUM_REPORTS; i++) {
		// get random video URL
		var url = getRandomVideoURL();
		var video_id = yt.getVideoID(url);

		// ensure video ID successfully parsed
		if (!video_id) {
			throw new Error("Failed to parse video ID for \'" + url + "\'");
		} else {
			// add new report record to list
			records.push([
				getRandomDate(),		// date_reported
				getRandomName(),		// reporter_name
				url,					// url
				video_id,				// video_id
				getRandomVideoTitle(),	// video_title (fudge the video title because bleh)
				getRandomTimeStamp(),	// lick_start
				getRandomNotes(),		// notes
	 		]);
		}
	}

	// insert generated data
	con.query('INSERT INTO reportings (date_reported, reporter_name, url, video_id, video_title, lick_start, notes) VALUES ?;', [records], function(err) {
		cb(err);
	});
}

populateRandomReportings(function(err) {
	if (!err) {
		console.log('Test data complete.');
	} else {
		throw err;
	}
});
