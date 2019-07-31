
/*
	youtube.js: Parsing YouTube video metadata
*/

const request = require('request');
const settings = require('./settings.js')

module.exports = {

	/*	String -> String
		Remove any time shift from end of YouTube URL */
	cleanURL: function(url) {
		var cleanURL = url.split('t=')[0];
		return cleanURL
	},

	/*	String -> String
		Extract video title, given URL. */
	getVideoTitle: function(videoID, cb) {
		// format URL to retrieve video meta
		var url = settings.youtube_url_info_1 + videoID + settings.youtube_url_info_2
		
		// make request to video metadata endpoint
		request(url, { json: true }, (err, res, body) => {
			cb(err,body);
		});
	},

	getId:function(url){

		var video_id = url.split('v=')[1];
		var ampersandPosition = video_id.indexOf('&');

		if(ampersandPosition != -1) {
  			video_id = video_id.substring(0, ampersandPosition);
		} 

		return video_id 
	}

}