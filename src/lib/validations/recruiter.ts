import z from 'zod';

export const recruiterRegistrationSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    email: z.string().email('Invalid email address'),
    phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits').max(15),
    designation: z.string().min(1, 'Designation is required'),
    company: z.string().min(1, 'Company is required'),
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

export const recruiterLoginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
}, {
    message: 'Invalid email or password'
});

export type RecruiterRegistrationFormData = z.infer<typeof recruiterRegistrationSchema>;
export type RecruiterLoginFormData = z.infer<typeof recruiterLoginSchema>;
