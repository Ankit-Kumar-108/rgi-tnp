import { z } from 'zod'; 

export const alumniRegistrationSchema = z.object({
    name: z.string().trim().min(1, 'Name is required').max(100),
    enrollmentNumber: z.string()
        .trim() 
        .min(1, 'Enrollment number is required')
        .regex(/^[A-Za-z0-9]+$/, 'Enrollment number must be alphanumeric'),
    personalEmail: z.string().trim().email('Invalid email address'),
    branch: z.string().trim().min(1, 'Branch is required'),
    course: z.string().trim().min(1, 'Course is required'),
    batch: z.string().trim().min(1, 'Batch is required'),
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

export const alumniLoginSchema = z.object({
    personalEmail: z.string().trim().email('Invalid email address'), 
    password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export const referralSchema = z.object({
    companyName: z.string().trim().min(1, 'Company name is required').max(100),
    jobType: z.string().trim().optional().transform(v => v === '' ? undefined : v),
    position: z.string().trim().min(1, 'Position is required').max(100),
    description: z.string().trim().min(10, 'Description must be at least 10 characters').max(2000),
    location: z.string().trim().optional().transform(v => v === '' ? undefined : v),
    minCGPA: z.string().trim().optional().transform(v => v === '' ? undefined : v).refine(
        (val) => !val || !isNaN(parseFloat(val)),
        'Min CGPA must be a valid number'
    ),
    experience: z.string().trim().optional().transform(v => v === '' ? undefined : v),
    batchEligible: z.string().trim().optional().transform(v => v === '' ? undefined : v),
    refrerralLink: z.string().trim().optional().transform(v => v === '' ? undefined : v).refine(
        (val) => !val || /^https?:\/\//.test(val),
        'Referral link must start with http:// or https://'
    ),
    referralCode: z.string().trim().optional().transform(v => v === '' ? undefined : v),
    deadline: z.string().trim().optional().transform(v => v === '' ? undefined : v),
    applyLink: z.string().trim().optional().transform(v => v === '' ? undefined : v).refine(
        (val) => {
            if (!val) return true;
            const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
            const isUrl = /^https?:\/\//.test(val);
            return isEmail || isUrl;
        },
        'Apply link must be a valid email or URL (starting with http:// or https://)'
    ),
});

export type AlumniRegistrationFormData = z.infer<typeof alumniRegistrationSchema>;
export type AlumniLoginFormData = z.infer<typeof alumniLoginSchema>;
export type ReferralFormData = z.infer<typeof referralSchema>;