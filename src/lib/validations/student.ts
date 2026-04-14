import { z } from 'zod';

export const registrationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name cannot be more than 100 characters'),
  email: z
    .string()
    .trim()
    .email('Invalid email address'),
  enrollmentNumber: z
    .string()
    .trim()
    .min(1, 'Enrollment number is required')
    .regex(/^[A-Za-z0-9]+$/, 'Enrollment number must be alphanumeric'),
  branch: z.enum(['Computer Science', 'Mechanical', 'Electrical', 'Civil', 'Electronics', 'Power Systems', 'Digital Communication', 'Thermal Engineering', 'Marketing', 'Finance', 'Human Resource']),
  course: z.string().trim().min(1, 'Course is required'),
  semester: z.coerce
    .number()
    .int()
    .min(1, 'Semester must be at least 1')
    .max(8, 'Semester cannot be more than 8'),
  cgpa: z.coerce
    .number()
    .min(0, 'CGPA must be a positive number')
    .max(10, 'CGPA cannot be more than 10'),
  batch: z.string().trim().min(1, 'Batch is required'),
  phoneNumber: z
    .string()
    .trim()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number cannot be more than 15 digits'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[@$!%*?&]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
  profileImageUrl: z.string().trim().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
});

// NEW: Schema to validate the token and email from the verification link URL
export const emailVerificationSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
  email: z.string().trim().email("Invalid email address"),
});

export const passwordResetSchema = z
  .object({
    token: z.string(),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain uppercase letter")
      .regex(/[a-z]/, "Password must contain lowercase letter")
      .regex(/[0-9]/, "Password must contain number")
      .regex(/[@$!%*?&]/, "Password must contain special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email(),
});

export const memoryUploadSchema = z.object({
  files: z
    .array(
      z
        .instanceof(File)
        .refine((file) => file.size <= 5 * 1024 * 1024, "File must be <= 5MB")
        .refine(
          (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
          "Only JPG, PNG, WEBP allowed"
        )
    )
    .min(1, "At least 1 file required")
    .max(5, "Maximum 5 files allowed"),
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type EmailVerificationData = z.infer<typeof emailVerificationSchema>; // NEW
export type PasswordResetData = z.infer<typeof passwordResetSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;