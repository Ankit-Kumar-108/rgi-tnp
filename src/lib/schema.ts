import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

const cuid = () => text("id").primaryKey().$defaultFn(() => createId());
const now = () => text("createdAt").default(sql`(CURRENT_TIMESTAMP)`).notNull();
const updatedAt = () => text("updatedAt").default(sql`(CURRENT_TIMESTAMP)`).notNull();

export const studentMaster = sqliteTable("StudentMaster", {
  id: cuid(),
  enrollmentNumber: text("enrollmentNumber").notNull().unique(),
  name: text("name").notNull(),
  branch: text("branch").notNull(),
  course: text("course").notNull(),
  batch: text("batch").notNull(),
});

export const alumniMaster = sqliteTable("AlumniMaster", {
  id: cuid(),
  enrollmentNumber: text("enrollmentNumber").notNull().unique(),
  name: text("name").notNull(),
  course: text("course").notNull(),
  branch: text("branch").notNull(),
  batch: text("batch").notNull(),
});

export const admin = sqliteTable("Admin", {
  id: cuid(),
  email: text("email").notNull().unique(),
  passwordHash: text("passwordHash").notNull(),
  role: text("role").notNull().default("admin"),
});

export const student = sqliteTable("Student", {
  id: cuid(),
  name: text("name").notNull(),
  enrollmentNumber: text("enrollmentNumber").notNull().unique(),
  email: text("email").notNull().unique(),
  branch: text("branch").notNull(),
  semester: integer("semester").notNull(),
  gender: text("gender").notNull(),
  cgpa: real("cgpa").notNull(),
  isEmailVerified: integer("isEmailVerified", { mode: "boolean" }).notNull().default(false),
  isVerified: integer("isVerified", { mode: "boolean" }).notNull().default(false),
  emailVerificationToken: text("emailVerificationToken"),
  emailVerificationTokenExpiry: integer("emailVerificationTokenExpiry", { mode: "timestamp" }),
  emailVerificationFailed: integer("emailVerificationFailed", { mode: "boolean" }).notNull().default(false),
  emailVerificationError: text("emailVerificationError"),
  resetPasswordToken: text("resetPasswordToken"),
  isProfileComplete: integer("isProfileComplete", { mode: "boolean" }).notNull().default(false),
  resetPasswordTokenExpiry: integer("resetPasswordTokenExpiry", { mode: "timestamp" }),
  profileImageUrl: text("profileImageUrl"),
  resumeUrl: text("resumeUrl"),
  batch: text("batch").notNull(),
  phoneNumber: text("phoneNumber").notNull(),
  course: text("course").notNull(),
  passwordHash: text("passwordHash").notNull(),
  linkedinUrl: text("linkedinUrl"),
  githubUrl: text("githubUrl"),
  tenthPercentage: real("tenthPercentage").notNull(),
  twelfthPercentage: real("twelfthPercentage").notNull(),
  activeBacklog: integer("activeBacklog").notNull().default(0),
  role: text("role").notNull().default("student"),
  createdAt: now(),
  updatedAt: updatedAt(),
});

export const alumni = sqliteTable("Alumni", {
  id: cuid(),
  name: text("name").notNull(),
  enrollmentNumber: text("enrollmentNumber").notNull().unique(),
  personalEmail: text("personalEmail").notNull().unique(),
  passwordHash: text("passwordHash").notNull(),
  isVerified: integer("isVerified", { mode: "boolean" }).notNull().default(false),
  emailVerificationToken: text("emailVerificationToken"),
  emailVerificationTokenExpiry: integer("emailVerificationTokenExpiry", { mode: "timestamp" }),
  emailVerificationFailed: integer("emailVerificationFailed", { mode: "boolean" }).notNull().default(false),
  emailVerificationError: text("emailVerificationError"),
  resetPasswordToken: text("resetPasswordToken"),
  resetPasswordTokenExpiry: integer("resetPasswordTokenExpiry", { mode: "timestamp" }),
  isProfileComplete: integer("isProfileComplete", { mode: "boolean" }).notNull().default(false),
  currentCompany: text("currentCompany"),
  profileImageUrl: text("profileImageUrl").notNull(),
  jobTitle: text("jobTitle"),
  city: text("city"),
  cgpa: real("cgpa"),
  twelfthPercentage: real("twelfthPercentage"),
  tenthPercentage: real("tenthPercentage"),
  gender: text("gender"),
  country: text("country"),
  linkedInUrl: text("linkedInUrl"),
  phoneNumber: text("phoneNumber"),
  privacyJson: text("privacyJson", { mode: "json" }),
  branch: text("branch").notNull(),
  about: text("about"),
  batch: text("batch").notNull(),
  course: text("course").notNull(),
  createdAt: now(),
  updatedAt: updatedAt(),
  placementSnapsJson: text("placementSnapsJson", { mode: "json" }).default("[]"),
  isTransferred: integer("isTransferred", { mode: "boolean" }).default(false),
});

export const externalStudent = sqliteTable("ExternalStudent", {
  id: cuid(),
  name: text("name").notNull(),
  collegeName: text("collegeName").notNull(),
  enrollmentNumber: text("enrollmentNumber").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("passwordHash").notNull(),
  profileImageUrl: text("profileImageUrl"),
  semester: integer("semester").notNull(),
  isProfileComplete: integer("isProfileComplete", { mode: "boolean" }).notNull().default(false),
  linkedinUrl: text("linkedinUrl"),
  githubUrl: text("githubUrl"),
  resumeUrl: text("resumeUrl"),
  gender: text("gender").notNull(),
  branch: text("branch").notNull(),
  tenthPercentage: real("tenthPercentage"),
  twelfthPercentage: real("twelfthPercentage"),
  cgpa: real("cgpa"),
  activeBacklog: integer("activeBacklog").notNull().default(0),
  course: text("course").notNull(),
  batch: text("batch").notNull(),
  phoneNumber: text("phoneNumber"),
  isVerified: integer("isVerified", { mode: "boolean" }).notNull().default(false),
  emailVerificationToken: text("emailVerificationToken"),
  emailVerificationTokenExpiry: integer("emailVerificationTokenExpiry", { mode: "timestamp" }),
  emailVerificationFailed: integer("emailVerificationFailed", { mode: "boolean" }).notNull().default(false),
  emailVerificationError: text("emailVerificationError"),
  resetPasswordToken: text("resetPasswordToken"),
  resetPasswordTokenExpiry: integer("resetPasswordTokenExpiry", { mode: "timestamp" }),
  role: text("role").notNull().default("external_student"),
  createdAt: now(),
  updatedAt: updatedAt(),
});

export const placementDrive = sqliteTable("PlacementDrive", {
  id: cuid(),
  companyName: text("companyName").notNull(),
  roleName: text("roleName").notNull(),
  jobDescription: text("jobDescription").notNull(),
  ctc: text("ctc").notNull(),
  minCGPA: real("minCGPA").notNull(),
  jobType: text("jobType").notNull(),
  minBatch: text("minBatch").notNull(),
  maxBatch: text("maxBatch").notNull(),
  course: text("course").notNull(),
  eligibleBranches: text("eligibleBranches").notNull(),
  genderPreference: text("genderPreference").notNull(),
  duration: text("duration"),
  interviewProcess: text("interviewProcess"),
  driveDate: integer("driveDate", { mode: "timestamp" }).notNull(),
  driveType: text("driveType").notNull(),
  status: text("status").notNull().default("pending"),
  googleSheetUrl: text("googleSheetUrl"),
  recruiterId: text("recruiterId").notNull(),
  createdAt: now(),
  updatedAt: updatedAt(),
  allowAlumni: integer("allowAlumni", { mode: "boolean" }).notNull().default(false),
});

export const driveImage = sqliteTable("DriveImage", {
  id: cuid(),
  title: text("title").notNull(),
  imageUrl: text("imageUrl").notNull(),
  driveId: text("driveId").notNull(),
  uploadedBy: text("uploadedBy").notNull(),
  createdAt: now(),
});

export const driveRegistration = sqliteTable("DriveRegistration", {
  id: cuid(),
  driveId: text("driveId").notNull(),
  studentId: text("studentId"),
  externalStudentId: text("externalStudentId"),
  alumniId: text("alumniId"),
  attended: integer("attended", { mode: "boolean" }).notNull().default(false),
  status: text("status").notNull().default("Applied"),
  createdAt: now(),
});

export const recruiter = sqliteTable("Recruiter", {
  id: cuid(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phoneNumber: text("phoneNumber").notNull(),
  designation: text("designation").notNull(),
  company: text("company").notNull(),
  resetPasswordToken: text("resetPasswordToken"),
  resetPasswordTokenExpiry: integer("resetPasswordTokenExpiry", { mode: "timestamp" }),
  passwordHash: text("passwordHash").notNull(),
  role: text("role").notNull().default("recruiter"),
  createdAt: now(),
  updatedAt: updatedAt(),
});

export const referral = sqliteTable("Referral", {
  id: cuid(),
  companyName: text("companyName").notNull(),
  jobType: text("jobType"),
  position: text("position").notNull(),
  description: text("description").notNull(),
  location: text("location"),
  minCGPA: real("minCGPA"),
  experience: text("experience"),
  batchEligible: text("batchEligible"),
  refrerralLink: text("refrerralLink"),
  referralCode: text("referralCode"),
  deadline: integer("deadline", { mode: "timestamp" }),
  applyLink: text("applyLink"),
  status: text("status").notNull().default("pending"),
  alumniId: text("alumniId").notNull(),
  createdAt: now(),
  updatedAt: updatedAt(),
});

export const memory = sqliteTable("Memory", {
  id: cuid(),
  imageUrl: text("imageUrl").notNull(),
  status: text("status").notNull().default("pending_moderation"),
  studentId: text("studentId"),
  title: text("title").notNull().default("Untitled Memory"),
  uploaderName: text("uploaderName").notNull(),
  alumniId: text("alumniId"),
  createdAt: now(),
});

export const alumniFeedback = sqliteTable("AlumniFeedback", {
  id: cuid(),
  content: text("content").notNull(),
  rating: integer("rating").notNull(),
  isApproved: integer("isApproved", { mode: "boolean" }).notNull().default(false),
  createdAt: now(),
  updatedAt: updatedAt(),
  alumniId: text("alumniId").notNull(),
});

export const studentFeedback = sqliteTable("StudentFeedback", {
  id: cuid(),
  content: text("content").notNull(),
  rating: integer("rating").notNull(),
  isApproved: integer("isApproved", { mode: "boolean" }).notNull().default(false),
  createdAt: now(),
  updatedAt: updatedAt(),
  studentId: text("studentId").notNull(),
});

export const corporateFeedback = sqliteTable("CorporateFeedback", {
  id: cuid(),
  content: text("content").notNull(),
  rating: integer("rating").notNull(),
  isApproved: integer("isApproved", { mode: "boolean" }).notNull().default(false),
  createdAt: now(),
  updatedAt: updatedAt(),
  recruiterId: text("recruiterId").notNull(),
});

export const volunteer = sqliteTable("Volunteer", {
  id: cuid(),
  studentId: text("studentId").unique(),
  designation: text("designation").notNull().default("Volunteer"),
  isVerified: integer("isVerified", { mode: "boolean" }).notNull().default(false),
  assignedBy: text("assignedBy"),
  assignedAt: integer("assignedAt", { mode: "timestamp" }),
  verificationNotes: text("verificationNotes"),
  isActive: integer("isActive", { mode: "boolean" }).notNull().default(true),
  createdAt: now(),
  updatedAt: updatedAt(),
});

export const volunteerStudentStatus = sqliteTable("VolunteerStudentStatus", {
  id: cuid(),
  driveId: text("driveId").notNull(),
  studentId: text("studentId").notNull(),
  status: text("status").notNull().default("Applied"),
  createdAt: now(),
  updatedAt: updatedAt(),
});

export const notification = sqliteTable("Notification", {
  id: cuid(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  link: text("link"),
  isRead: integer("isRead", { mode: "boolean" }).notNull().default(false),
  createdAt: now(),
  recipientType: text("recipientType").notNull(),
  studentId: text("studentId"),
  alumniId: text("alumniId"),
  externalStudentId: text("externalStudentId"),
  recruiterId: text("recruiterId"),
});

export const emailLog = sqliteTable("EmailLog", {
  id: cuid(),
  to: text("to").notNull(),
  subject: text("subject").notNull(),
  template: text("template").notNull(),
  status: text("status").notNull(),
  error: text("error"),
  recipientType: text("recipientType"),
  triggeredBy: text("triggeredBy").notNull(),
  approvalType: text("approvalType"),
  approvalId: text("approvalId"),
  actionType: text("actionType"),
  createdAt: now(),
});

export const studentRelations = relations(student, ({ many }) => ({
  registrations: many(driveRegistration),
  memories: many(memory),
  studentFeedbacks: many(studentFeedback),
  volunteerStudentStatuses: many(volunteerStudentStatus),
  volunteers: many(volunteer),
  notifications: many(notification),
}));

export const alumniRelations = relations(alumni, ({ many }) => ({
  memories: many(memory),
  referrals: many(referral),
  alumniFeedbacks: many(alumniFeedback),
  notifications: many(notification),
  registrations: many(driveRegistration),
}));

export const externalStudentRelations = relations(externalStudent, ({ many }) => ({
  registrations: many(driveRegistration),
  notifications: many(notification),
}));

export const placementDriveRelations = relations(placementDrive, ({ one, many }) => ({
  recruiter: one(recruiter, {
    fields: [placementDrive.recruiterId],
    references: [recruiter.id],
  }),
  registrations: many(driveRegistration),
  driveImages: many(driveImage),
  volunteerStudentStatuses: many(volunteerStudentStatus),
}));

export const driveImageRelations = relations(driveImage, ({ one }) => ({
  drive: one(placementDrive, {
    fields: [driveImage.driveId],
    references: [placementDrive.id],
  }),
}));

export const driveRegistrationRelations = relations(driveRegistration, ({ one }) => ({
  drive: one(placementDrive, {
    fields: [driveRegistration.driveId],
    references: [placementDrive.id],
  }),
  student: one(student, {
    fields: [driveRegistration.studentId],
    references: [student.id],
  }),
  externalStudent: one(externalStudent, {
    fields: [driveRegistration.externalStudentId],
    references: [externalStudent.id],
  }),
  alumni: one(alumni, {
    fields: [driveRegistration.alumniId],
    references: [alumni.id],
  }),
}));

export const recruiterRelations = relations(recruiter, ({ many }) => ({
  drives: many(placementDrive),
  corporateFeedbacks: many(corporateFeedback),
  notifications: many(notification),
}));

export const referralRelations = relations(referral, ({ one }) => ({
  alumni: one(alumni, {
    fields: [referral.alumniId],
    references: [alumni.id],
  }),
}));

export const memoryRelations = relations(memory, ({ one }) => ({
  alumni: one(alumni, {
    fields: [memory.alumniId],
    references: [alumni.id],
  }),
  student: one(student, {
    fields: [memory.studentId],
    references: [student.id],
  }),
}));

export const alumniFeedbackRelations = relations(alumniFeedback, ({ one }) => ({
  alumni: one(alumni, {
    fields: [alumniFeedback.alumniId],
    references: [alumni.id],
  }),
}));

export const studentFeedbackRelations = relations(studentFeedback, ({ one }) => ({
  student: one(student, {
    fields: [studentFeedback.studentId],
    references: [student.id],
  }),
}));

export const corporateFeedbackRelations = relations(corporateFeedback, ({ one }) => ({
  recruiter: one(recruiter, {
    fields: [corporateFeedback.recruiterId],
    references: [recruiter.id],
  }),
}));

export const volunteerRelations = relations(volunteer, ({ one }) => ({
  student: one(student, {
    fields: [volunteer.studentId],
    references: [student.id],
  }),
}));

export const volunteerStudentStatusRelations = relations(volunteerStudentStatus, ({ one }) => ({
  drive: one(placementDrive, {
    fields: [volunteerStudentStatus.driveId],
    references: [placementDrive.id],
  }),
  student: one(student, {
    fields: [volunteerStudentStatus.studentId],
    references: [student.id],
  }),
}));

export const notificationRelations = relations(notification, ({ one }) => ({
  student: one(student, {
    fields: [notification.studentId],
    references: [student.id],
  }),
  alumni: one(alumni, {
    fields: [notification.alumniId],
    references: [alumni.id],
  }),
  externalStudent: one(externalStudent, {
    fields: [notification.externalStudentId],
    references: [externalStudent.id],
  }),
  recruiter: one(recruiter, {
    fields: [notification.recruiterId],
    references: [recruiter.id],
  }),
}));
