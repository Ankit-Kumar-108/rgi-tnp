// Edge-compatible password hashing using Web Crypto API (PBKDF2)
const ITERATIONS = 100000;
const KEY_LENGTH = 64;

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBuffer(hex: string): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

export const hashPassword = async (password: string): Promise<string> => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const hash = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    keyMaterial, KEY_LENGTH * 8
  );
  return `${ITERATIONS}.${bufferToHex(salt.buffer)}.${bufferToHex(hash)}`;
}

export const verifyPassword = async (password: string, storedHash: string): Promise<boolean> => {
  const [iterStr, saltHex, hashHex] = storedHash.split('.');
  const iterations = parseInt(iterStr);
  const salt = hexToBuffer(saltHex);
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const hash = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    keyMaterial, KEY_LENGTH * 8
  );
  return bufferToHex(hash) === hashHex;
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