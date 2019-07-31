
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
	getVideoTitle: function(url, callback) {
		var url = settings.youtube_url_info_1 + url + settings.youtube_url_info_2
		request(url, { json: true }, (err, res, body) => {
  			if (err) { return console.log(err); }
			//	console.log(body)
				callback(err,body);
			});
		// Use this:
		// 'https://www.youtube.com/oembed?url=http%3A//www.youtube.com/watch%3Fv%3D' + <video id> + '&format=json'

	}

}