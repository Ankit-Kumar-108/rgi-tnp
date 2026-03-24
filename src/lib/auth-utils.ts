import bcryptjs from 'bcryptjs';
import crypto from 'crypto';

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcryptjs.genSalt(10);
    return await bcryptjs.hash(password, salt);
}

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcryptjs.compare(password, hashedPassword);
}

export const generateOTP = (): string => {
    return crypto.randomBytes(3).toString('hex').toUpperCase();
}

export const generateVerificationToken = (): string => {
    return crypto.randomBytes(32).toString('hex');
}

export const generateResetToken = (): string => {
    return crypto.randomBytes(32).toString('hex');
}

export const getOTPExpiry = (): Date => {
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 10);  // OTP valid for 10 minutes
    return expiry;
}

export const getresetTokenExpiry = (): Date => {
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 30);    // Reset token valid for 30 minutes
    return expiry;
}

export const isTokenExpired = (expiry: Date): boolean => {
    return new Date() > expiry;
}