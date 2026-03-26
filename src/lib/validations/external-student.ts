import z from 'zod';

export const externalStudentRegistrationSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    collegeName: z.string().min(1, 'College name is required'),
    enrollmentNumber: z.string().min(1, 'Enrollment number is required'),
    email: z.string().email('Invalid email address'),
    branch: z.string().min(1, 'Branch is required'),
    course: z.string().min(1, 'Course is required'),
    batch: z.string().min(1, 'Batch is required'),
    cgpa: z.coerce.number().min(0, 'CGPA must be a positive number').max(10, 'CGPA cannot be more than 10'),
    resumeUrl: z.string().url('Invalid URL format for resume'),
    phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits').max(15),
    password: z.string()
        .min(8, 'Password must be at least 8 characters long')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[@$!%*?&]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export const externalStudentLoginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
}, {
    message: 'Invalid email or password'
});

export type ExternalStudentRegistrationFormData = z.infer<typeof externalStudentRegistrationSchema>;
export type ExternalStudentLoginFormData = z.infer<typeof externalStudentLoginSchema>;
