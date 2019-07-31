
DROP DATABASE IF EXISTS lick;
CREATE DATABASE lick;

USE lick;

CREATE TABLE reportings (
	uid INT NOT NULL AUTO_INCREMENT,
	date_reported DATETIME,
	reporter_name VARCHAR(64), -- optional, name of the reporter
	url VARCHAR(512),	-- video li(n)ck
	video_title VARCHAR(64),
	lick_start INT,		-- in seconds, when in the video the lick occurs
	notes TEXT,
	PRIMARY KEY (uid)
);