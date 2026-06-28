PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_Volunteer` (
	`id` text PRIMARY KEY NOT NULL,
	`studentId` text,
	`designation` text DEFAULT 'Volunteer' NOT NULL,
	`isVerified` integer DEFAULT false NOT NULL,
	`assignedBy` text,
	`assignedAt` text,
	`verificationNotes` text,
	`isActive` integer DEFAULT true NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_Volunteer`("id", "studentId", "designation", "isVerified", "assignedBy", "assignedAt", "verificationNotes", "isActive", "createdAt", "updatedAt") SELECT "id", "studentId", "designation", "isVerified", "assignedBy", "assignedAt", "verificationNotes", "isActive", "createdAt", "updatedAt" FROM `Volunteer`;--> statement-breakpoint
DROP TABLE `Volunteer`;--> statement-breakpoint
ALTER TABLE `__new_Volunteer` RENAME TO `Volunteer`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `Volunteer_studentId_unique` ON `Volunteer` (`studentId`);--> statement-breakpoint
ALTER TABLE `Alumni` ADD `resumeUrl` text;--> statement-breakpoint
ALTER TABLE `Alumni` ADD `collegeName` text DEFAULT 'RGI' NOT NULL;--> statement-breakpoint
ALTER TABLE `Student` ADD `collegeName` text DEFAULT 'RGI' NOT NULL;