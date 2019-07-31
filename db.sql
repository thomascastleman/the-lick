
DROP DATABASE IF EXISTS lick;
CREATE DATABASE lick;

USE lick;

-- reportings of the lick
CREATE TABLE reportings (
	uid INT NOT NULL AUTO_INCREMENT,
	date_reported DATETIME,			-- time of reporting
	reporter_name VARCHAR(64),		-- optional, name of the reporter
	url VARCHAR(512),				-- video li(n)ck (without time shift)
	video_id VARCHAR(32),			-- YouTube's ID for this video
	video_title VARCHAR(64),		-- title of reported video
	lick_start INT,					-- in seconds, when in the video the lick occurs
	notes TEXT,						-- extra notes regarding this instance of the lick
	PRIMARY KEY (uid)
);

INSERT INTO reportings (date_reported, reporter_name, url, video_id, video_title) 
VALUES (curdate(), 'Johnny Lindbergh', 'https://www.youtube.com/watch?v=30FTr6G53VU','30FTr6G53VU','Giant Steps');

INSERT INTO reportings (date_reported, reporter_name, url, video_id, video_title) 
VALUES (curdate(), 'Thomas Regularhouseman', 'https://www.youtube.com/watch?v=30FTr6G53VU','30FTr6G53VU','Giant Steps');

