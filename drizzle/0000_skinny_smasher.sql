CREATE TABLE `Admin` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`passwordHash` text NOT NULL,
	`role` text DEFAULT 'admin' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Admin_email_unique` ON `Admin` (`email`);--> statement-breakpoint
CREATE TABLE `Alumni` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`enrollmentNumber` text NOT NULL,
	`personalEmail` text NOT NULL,
	`passwordHash` text NOT NULL,
	`isVerified` integer DEFAULT false NOT NULL,
	`emailVerificationToken` text,
	`emailVerificationTokenExpiry` integer,
	`emailVerificationFailed` integer DEFAULT false NOT NULL,
	`emailVerificationError` text,
	`resetPasswordToken` text,
	`resetPasswordTokenExpiry` integer,
	`isProfileComplete` integer DEFAULT false NOT NULL,
	`currentCompany` text,
	`profileImageUrl` text NOT NULL,
	`jobTitle` text,
	`city` text,
	`cgpa` real,
	`twelfthPercentage` real,
	`tenthPercentage` real,
	`gender` text,
	`country` text,
	`linkedInUrl` text,
	`phoneNumber` text,
	`privacyJson` text,
	`branch` text NOT NULL,
	`about` text,
	`batch` text NOT NULL,
	`course` text NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`placementSnapsJson` text DEFAULT '[]',
	`isTransferred` integer DEFAULT false
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Alumni_enrollmentNumber_unique` ON `Alumni` (`enrollmentNumber`);--> statement-breakpoint
CREATE UNIQUE INDEX `Alumni_personalEmail_unique` ON `Alumni` (`personalEmail`);--> statement-breakpoint
CREATE TABLE `AlumniFeedback` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`rating` integer NOT NULL,
	`isApproved` integer DEFAULT false NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`alumniId` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `AlumniMaster` (
	`id` text PRIMARY KEY NOT NULL,
	`enrollmentNumber` text NOT NULL,
	`name` text NOT NULL,
	`course` text NOT NULL,
	`branch` text NOT NULL,
	`batch` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `AlumniMaster_enrollmentNumber_unique` ON `AlumniMaster` (`enrollmentNumber`);--> statement-breakpoint
CREATE TABLE `CorporateFeedback` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`rating` integer NOT NULL,
	`isApproved` integer DEFAULT false NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`recruiterId` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `DriveImage` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`imageUrl` text NOT NULL,
	`driveId` text NOT NULL,
	`uploadedBy` text NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `DriveRegistration` (
	`id` text PRIMARY KEY NOT NULL,
	`driveId` text NOT NULL,
	`studentId` text,
	`externalStudentId` text,
	`alumniId` text,
	`attended` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'Applied' NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `EmailLog` (
	`id` text PRIMARY KEY NOT NULL,
	`to` text NOT NULL,
	`subject` text NOT NULL,
	`template` text NOT NULL,
	`status` text NOT NULL,
	`error` text,
	`recipientType` text,
	`triggeredBy` text NOT NULL,
	`approvalType` text,
	`approvalId` text,
	`actionType` text,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ExternalStudent` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`collegeName` text NOT NULL,
	`enrollmentNumber` text NOT NULL,
	`email` text NOT NULL,
	`passwordHash` text NOT NULL,
	`profileImageUrl` text,
	`semester` integer NOT NULL,
	`isProfileComplete` integer DEFAULT false NOT NULL,
	`linkedinUrl` text,
	`githubUrl` text,
	`resumeUrl` text,
	`gender` text NOT NULL,
	`branch` text NOT NULL,
	`tenthPercentage` real,
	`twelfthPercentage` real,
	`cgpa` real,
	`activeBacklog` integer DEFAULT 0 NOT NULL,
	`course` text NOT NULL,
	`batch` text NOT NULL,
	`phoneNumber` text,
	`isVerified` integer DEFAULT false NOT NULL,
	`emailVerificationToken` text,
	`emailVerificationTokenExpiry` integer,
	`emailVerificationFailed` integer DEFAULT false NOT NULL,
	`emailVerificationError` text,
	`resetPasswordToken` text,
	`resetPasswordTokenExpiry` integer,
	`role` text DEFAULT 'external_student' NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ExternalStudent_enrollmentNumber_unique` ON `ExternalStudent` (`enrollmentNumber`);--> statement-breakpoint
CREATE UNIQUE INDEX `ExternalStudent_email_unique` ON `ExternalStudent` (`email`);--> statement-breakpoint
CREATE TABLE `Memory` (
	`id` text PRIMARY KEY NOT NULL,
	`imageUrl` text NOT NULL,
	`status` text DEFAULT 'pending_moderation' NOT NULL,
	`studentId` text,
	`title` text DEFAULT 'Untitled Memory' NOT NULL,
	`uploaderName` text NOT NULL,
	`alumniId` text,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Notification` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`message` text NOT NULL,
	`link` text,
	`isRead` integer DEFAULT false NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`recipientType` text NOT NULL,
	`studentId` text,
	`alumniId` text,
	`externalStudentId` text,
	`recruiterId` text
);
--> statement-breakpoint
CREATE TABLE `PlacementDrive` (
	`id` text PRIMARY KEY NOT NULL,
	`companyName` text NOT NULL,
	`roleName` text NOT NULL,
	`jobDescription` text NOT NULL,
	`ctc` text NOT NULL,
	`minCGPA` real NOT NULL,
	`jobType` text NOT NULL,
	`minBatch` text NOT NULL,
	`maxBatch` text NOT NULL,
	`course` text NOT NULL,
	`eligibleBranches` text NOT NULL,
	`genderPreference` text NOT NULL,
	`duration` text,
	`interviewProcess` text,
	`driveDate` integer NOT NULL,
	`driveType` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`googleSheetUrl` text,
	`recruiterId` text NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`allowAlumni` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Recruiter` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phoneNumber` text NOT NULL,
	`designation` text NOT NULL,
	`company` text NOT NULL,
	`resetPasswordToken` text,
	`resetPasswordTokenExpiry` integer,
	`passwordHash` text NOT NULL,
	`role` text DEFAULT 'recruiter' NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Recruiter_email_unique` ON `Recruiter` (`email`);--> statement-breakpoint
CREATE TABLE `Referral` (
	`id` text PRIMARY KEY NOT NULL,
	`companyName` text NOT NULL,
	`jobType` text,
	`position` text NOT NULL,
	`description` text NOT NULL,
	`location` text,
	`minCGPA` real,
	`experience` text,
	`batchEligible` text,
	`refrerralLink` text,
	`referralCode` text,
	`deadline` integer,
	`applyLink` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`alumniId` text NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Student` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`enrollmentNumber` text NOT NULL,
	`email` text NOT NULL,
	`branch` text NOT NULL,
	`semester` integer NOT NULL,
	`gender` text NOT NULL,
	`cgpa` real NOT NULL,
	`isEmailVerified` integer DEFAULT false NOT NULL,
	`isVerified` integer DEFAULT false NOT NULL,
	`emailVerificationToken` text,
	`emailVerificationTokenExpiry` integer,
	`emailVerificationFailed` integer DEFAULT false NOT NULL,
	`emailVerificationError` text,
	`resetPasswordToken` text,
	`isProfileComplete` integer DEFAULT false NOT NULL,
	`resetPasswordTokenExpiry` integer,
	`profileImageUrl` text,
	`resumeUrl` text,
	`batch` text NOT NULL,
	`phoneNumber` text NOT NULL,
	`course` text NOT NULL,
	`passwordHash` text NOT NULL,
	`linkedinUrl` text,
	`githubUrl` text,
	`tenthPercentage` real NOT NULL,
	`twelfthPercentage` real NOT NULL,
	`activeBacklog` integer DEFAULT 0 NOT NULL,
	`role` text DEFAULT 'student' NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Student_enrollmentNumber_unique` ON `Student` (`enrollmentNumber`);--> statement-breakpoint
CREATE UNIQUE INDEX `Student_email_unique` ON `Student` (`email`);--> statement-breakpoint
CREATE TABLE `StudentFeedback` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`rating` integer NOT NULL,
	`isApproved` integer DEFAULT false NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`studentId` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `StudentMaster` (
	`id` text PRIMARY KEY NOT NULL,
	`enrollmentNumber` text NOT NULL,
	`name` text NOT NULL,
	`branch` text NOT NULL,
	`course` text NOT NULL,
	`batch` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `StudentMaster_enrollmentNumber_unique` ON `StudentMaster` (`enrollmentNumber`);--> statement-breakpoint
CREATE TABLE `Volunteer` (
	`id` text PRIMARY KEY NOT NULL,
	`studentId` text,
	`designation` text DEFAULT 'Volunteer' NOT NULL,
	`isVerified` integer DEFAULT false NOT NULL,
	`assignedBy` text,
	`assignedAt` integer,
	`verificationNotes` text,
	`isActive` integer DEFAULT true NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Volunteer_studentId_unique` ON `Volunteer` (`studentId`);--> statement-breakpoint
CREATE TABLE `VolunteerStudentStatus` (
	`id` text PRIMARY KEY NOT NULL,
	`driveId` text NOT NULL,
	`studentId` text NOT NULL,
	`status` text DEFAULT 'Applied' NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
