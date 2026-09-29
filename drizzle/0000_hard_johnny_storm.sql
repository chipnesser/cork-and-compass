CREATE TABLE `lesson_progress` (
	`learner` text NOT NULL,
	`lesson` text NOT NULL,
	`answers` text DEFAULT '[]' NOT NULL,
	PRIMARY KEY(`learner`, `lesson`)
);
