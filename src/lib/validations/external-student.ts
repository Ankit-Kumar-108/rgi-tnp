import { z } from 'zod';

export const externalStudentRegistrationSchema = z.object({
    name: z.string().trim().min(1, 'Name is required').max(100),
    collegeName: z.string().trim().min(1, 'College name is required'),
    enrollmentNumber: z.string().trim().min(1, 'Enrollment number is required'),
    email: z.string().trim().email('Invalid email address'),
    branch: z.string().trim().min(1, 'Branch is required'),
    course: z.string().trim().min(1, 'Course is required'),
    batch: z.string().trim().min(1, 'Batch is required'),
    semester: z.coerce.number().int().min(1, 'Semester must be at least 1').max(8, 'Semester cannot be more than 8'),
    cgpa: z.coerce.number().min(0, 'CGPA must be a positive number').max(10, 'CGPA cannot be more than 10'),
    resumeUrl: z.string().trim().url('Invalid URL format for resume'),
    phoneNumber: z.string().trim().min(10, 'Phone number must be at least 10 digits').max(15),
    password: z.string()
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

export const externalStudentLoginSchema = z.object({
    email: z.string().trim().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
}); 

export type ExternalStudentRegistrationFormData = z.infer<typeof externalStudentRegistrationSchema>;
export type ExternalStudentLoginFormData = z.infer<typeof externalStudentLoginSchema>;