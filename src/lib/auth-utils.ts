import bcryptjs from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcryptjs.genSalt(10);
    return await bcryptjs.hash(password, salt);
}

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcryptjs.compare(password, hashedPassword);
}

export const generateOTP = (): string => {
    const buffer = new Uint8Array(3);
    globalThis.crypto.getRandomValues(buffer);
    return Array.from(buffer)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
        .slice(0, 6)
        .toUpperCase();
}

export const generateVerificationToken = (): string => {
    const buffer = new Uint8Array(32);
    globalThis.crypto.getRandomValues(buffer);
    return Array.from(buffer)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

export const generateResetToken = (): string => {
    const buffer = new Uint8Array(32);
    globalThis.crypto.getRandomValues(buffer);
    return Array.from(buffer)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
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