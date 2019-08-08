
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

	// site name that appears in top lefthand corner of navbar
	SITE_NAME: 'thelick.space',

	// number of recent reports to display on homepage
	REPORTS_ON_HOME_TABLE: 200,

	// number of videos to use in the homepage video player
	VIDEOS_IN_RAND_SUBSET: 100,
	
	// number of videos to load onto the homepage on scroll
	SCROLL_RELOAD_RATE: 10

}