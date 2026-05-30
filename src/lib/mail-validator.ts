const TYPO_MAP = new Map([
    ["gamil.com", "gmail.com"],
    ["gmaol.com", "gmail.com"],
    ["yaho.com", "yahoo.com"],     
    ["hotmai.com", "hotmail.com"],
    ["gmai.com", "gmail.com"],
    ["hotma.com", "hotmail.com"],
    ["hotmai.com", "hotmail.com"],

]);

interface ValidationResult {
    valid: boolean;
    error?: string;
}

export function validateEmail(email: string): ValidationResult {
    const trimmedEmail = (email || "").trim();
    if (trimmedEmail.length === 0) {
        return { valid: false, error: "Recipient email is empty" };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
        return { valid: false, error: "Recipient email format is invalid" };
    }
    const domain = trimmedEmail.split("@")[1].toLowerCase();
    if (TYPO_MAP.has(domain)) {
        const correctDomain = TYPO_MAP.get(domain);
        return { 
            valid: false, 
            error: `Domain typo detected. Did you mean ${correctDomain}?` 
        };
    }

    return { valid: true};
}