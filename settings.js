
/*
	settings.js: System parameters
*/

module.exports = {
	// server port
	PORT: 8080,

	// endpoint for requesting metadata on a YouTube video
	YOUTUBE_META_URL: {
		prefix: "https://www.youtube.com/oembed?url=http%3A//www.youtube.com/watch%3Fv%3D",
		suffix: "&format=json"
	},

	// number of recent reports to display on homepage
	reportsOnHomeTable: 100,
	reportsOnHomeVideos:100,
	reloadRate: 10

}