
/*
	youtube.js: Parsing YouTube video metadata
*/

const request = require('request');
const sys = require('./settings.js')

module.exports = {

	/*	String -> String
		Remove any time shift from end of YouTube URL */
	cleanURL: function(url) {
		// match t parameter anywhere in URL and replace with empty string
		return url.replace(/&t=\d+/g, "");
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

	/* String -> String
		Extract video title, given ID */
	getVideoTitle: function(videoID, cb) {
		// get all metadata, extract title
		module.exports.getVideoMeta(videoID, function(err, meta) {
			if (!err) {
				cb(err, meta.title);
			} else {
				cb(err);
			}
		});
	},

	/*	String -> String
		Extract the video ID from the URL. */
	getVideoID: function(url) {
		var video_id = url.split('v=')[1];
		var ampersandPosition = video_id.indexOf('&');

		if (ampersandPosition != -1) {
  			video_id = video_id.substring(0, ampersandPosition);
		}

		return video_id;
	},

	/*	String -> Integer
		Parse the string timestamp for the occurrence of the lick into an integer duration of seconds. */
	parseStartTime: function(start) {
		return 61; // lol
	}

}


var v1 = "https://www.youtube.com/watch?v=30FTr6G53VU&t=261";
var v2 = "https://www.youtube.com/watch?v=30FTr6G53VU&t=261&feature=youtu.be&t=261";


console.log(module.exports.cleanURL(v1));