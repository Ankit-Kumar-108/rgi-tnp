import z from 'zod';

export const alumniRegistrationSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    enrollmentNumber: z.string().min(1, 'Enrollment number is required').regex(/^[A-Za-z0-9]+$/, 'Enrollment number must be alphanumeric'),
    personalEmail: z.string().email('Invalid email address'),
    course: z.string().min(1, 'Course is required'),
    batch: z.string().min(1, 'Batch is required'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters long')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[@$!%*?&]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
    profileImageUrl: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export const alumniLoginSchema = z.object({
    personalEmail: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
}, {
    message: 'Invalid email or password'
});

export type AlumniRegistrationFormData = z.infer<typeof alumniRegistrationSchema>;
export type AlumniLoginFormData = z.infer<typeof alumniLoginSchema>;
