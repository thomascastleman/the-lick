
DROP DATABASE IF EXISTS lick;
CREATE DATABASE lick;

USE lick;

-- reportings of the lick
CREATE TABLE reportings (
	uid INT NOT NULL AUTO_INCREMENT,
	date_reported DATETIME,			-- time of reporting
	reporter_name VARCHAR(64),		-- optional, name of the reporter
	url VARCHAR(512),				-- video li(n)ck (without time shift)
	video_title VARCHAR(64),		-- title of reported video
	lick_start INT,					-- in seconds, when in the video the lick occurs
	notes TEXT,						-- extra notes regarding this instance of the lick
	PRIMARY KEY (uid)
);