
/*
	youtube.js: Parsing YouTube video metadata
*/

const request = require('request');
const sys = require('./settings.js')

module.exports = {

	/*	String -> Integer
		Extract the value of the t parameter from a given YouTube URL.
		If none found, return null. */
	parsePlaybackOffset: function(url) {
		// attempt to match value of t parameter in URL
		var match = /(\?|&)t=(\d+)/g.exec(url);

		// if valid match exists
		if (match && match.length > 2) {
			return match[2];
		} else {
			return null;
		}
	},

	/*	String -> JSON
		Extract all video metadata, given ID. */
	getVideoMeta: function(videoID, cb) {
		// format URL to retrieve video meta
		var url = sys.YOUTUBE_META_URL.prefix + videoID + sys.YOUTUBE_META_URL.suffix
		
		// make request to video metadata endpoint
		request(url, { json: true }, (err, res, body) => {
			cb(err, body);
		});
	},

	/*	String -> String
		Extract the video ID from the URL. */
	getVideoID: function(url, cb) {
		// regular expression used to extract ID from URL (depends on form of URL)
		var videoIDExpr;
		
		if (/https:\/\/www\.youtube\.com\/watch\?v=.*/g.test(url)) {
			// add & to end as though another parameter occurs (allows the lookahead to work)
			url += '&';
			videoIDExpr = /https:\/\/www\.youtube\.com\/watch\?v=(.+?)(?=&)/g;

		} else if (/https:\/\/www\.youtube\.com\/v\/.*/g.test(url)) {
			// add ? to end as though parameters occur (allows lookahead)
			url += '?';
			videoIDExpr = /https:\/\/www\.youtube\.com\/v\/(.+?)(?=\?)/g;

		} else if (/https:\/\/youtu\.be\/.*/g.test(url)) {
			// add ? to end as though parameters occur (allows lookahead)
			url += '?';
			videoIDExpr = /https:\/\/youtu\.be\/(.+?)(?=\?)/g;			
		} else {
			// if no URL format recognized, callback on error
			return cb("The URL provided was in an unrecognizable format.");
		}

		// use regex to get ID in ?v parameter
		var match = videoIDExpr.exec(url);

		// if match exists, return just the ID
		if (match && match.length > 1) {
			cb(null, match[1]);
		} else {
			cb("Failed to extract video ID from provided URL.");
		}
	},

	/*	String -> Integer
		Parse the string timestamp for the occurrence of the lick into an integer duration of seconds. */
	parseStartTimeToSec: function(start) {

		/* Expected Formats:
			hh:mm:ss
			h:mm:ss
			mm:ss
			m:ss
		*/

		const includeHours = /(\d+):(\d+):(\d+)/g;
		const noHours = /(\d+):(\d+)/g;

		if (includeHours.test(start)) {
			includeHours.lastIndex = 0;
			var match = includeHours.exec(start);

			// if valid match
			if (match && match.length > 3) {
				// convert to seconds
				return (3600 * parseInt(match[1])) + (60 * parseInt(match[2])) + (parseInt(match[3]));
			} else {
				return null;
			}
		} else if (noHours.test(start)) {
			noHours.lastIndex = 0;
			var match = noHours.exec(start);

			// if valid match
			if (match && match.length > 2) {
				// convert to seconds
				return (60 * parseInt(match[1])) + parseInt(match[2]);
			} else {
				return null;
			}
		} else {
			return null;
		}
	},

	/*	Integer -> String
		Converts from a duration in seconds to a time string */
	convertToTimeString: function(duration) {
		if (duration) {
			var totalMin = Math.floor(duration / 60);
			var h = Math.floor(totalMin / 60);
			var m = totalMin % 60;
			var s = duration % 60;

			// convert to string, adding 0s appropriately
			return (h > 0 ? h.toString() + ':' : '') + (m < 10 ? '0' : '') + m.toString() + ':' + (s < 10 ? '0' : '') + s.toString();
		} else {
			return null;
		}
	}

}


// var urls = [
// 	'https://www.youtube.com/watch?v=30FTr6G53VU',
// 	'https://www.youtube.com/watch?v=-wtIMTCHWuI',
// 	'https://www.youtube.com/watch?v=I-VY-zs2eiY',
// 	'https://www.youtube.com/watch?v=30FTr6G53VU&t=261',
// 	'https://www.youtube.com/watch?v=30FTr6G53VU&t=261&feature=youtu.be&t=261',
// 	'https://www.youtube.com/v/-wtIMTCHWuI?version=3&autohide=1',
// 	'https://www.youtube.com/v/I-VY-zs2eiY?version=3&autohide=1',
// 	'https://www.youtube.com/v/I-VY-zs2eiY?',
// 	'https://youtu.be/-wtIMTCHWuI',
// 	'https://youtu.be/30FTr6G53VU?t=4'
// ];


// for (var i = 0; i < urls.length; i++) {
// 	// var id = module.exports.getVideoID(urls[i]);

// 	// console.log(urls[i]);
// 	// console.log(id);
// 	// console.log();

// 	console.log(urls[i]);
// 	console.log(module.exports.parsePlaybackOffset(urls[i]));
// 	console.log();
// }