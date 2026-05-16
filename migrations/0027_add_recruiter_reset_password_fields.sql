-- Add missing password reset fields to Recruiter table
-- Required for recruiter forgot-password/reset-password flow in Prisma.
ALTER TABLE "Recruiter" ADD COLUMN "resetPasswordToken" TEXT;
ALTER TABLE "Recruiter" ADD COLUMN "resetPasswordTokenExpiry" DATETIME;
