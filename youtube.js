
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
	getVideoID: function(url) {
		// regular expression used to extract ID from URL (depends on form of URL)
		var expr;

		// supported YouTube URL formats
		var form1 = /https:\/\/www\.youtube\.com\/watch\?v=(.+?)(?=(&|$))/gm;		// youtube.com/watch?v= <VIDEO ID>
		var form2 = /https:\/\/www\.youtube\.com\/v\/(.+?)(?=(\?|$))/gm;			// youtube.com/v/ <VIDEO ID>
		var form3 = /https:\/\/youtu\.be\/(.+?)(?=(\?|$))/gm;						// youtu.be/ <VIDEO ID>

		// test each format against the URL to determine which expression to use
		if (form1.test(url)) {
			// use youtube.com/watch format
			expr = form1;
		} else if (form2.test(url)) {
			// use youtube.com/v format
			expr = form2;
		} else if (form3.test(url)) {
			// use youtu.be format
			expr = form3;
		} else {
			// if no URL format recognized, return null (failure to retrieve video ID)
			return null;
		}

		// reset index of regular expression before using to extract ID
		expr.lastIndex = 0;

		// use regex to pull video ID from URL
		var match = expr.exec(url);

		// if match exists, return just the ID
		if (match && match.length > 1) {
			return match[1];
		} else {
			return null;
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