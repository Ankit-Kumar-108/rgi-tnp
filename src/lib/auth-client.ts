
const TOKEN_KEYS: Record<string, string> = {
  student: "student_token",
  recruiter: "recruiter_token",
  alumni: "alumni_token",
  admin: "admin_token",
  external_student: "external_student_token",
};

const USER_KEYS: Record<string, string> = {
  student: "student_user",
  recruiter: "recruiter_user",
  alumni: "alumni_user",
  admin: "admin_user",
  external_student: "external_student_user",
};

export type UserRole = "student" | "recruiter" | "alumni" | "admin" | "external_student";

// Dummy export to satisfy legacy imports during transition
export const getToken = (role: UserRole): string | null => null;

export const saveAuth = (role: UserRole, expiresAt: number, user: any) => {
  localStorage.setItem(TOKEN_KEYS[role], expiresAt.toString());
  localStorage.setItem(USER_KEYS[role], JSON.stringify(user));
};

export const getUser = (role: UserRole): any | null => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem(USER_KEYS[role]);
  if (!user || user === "undefined" || user === "null") return null;
  try {
    return JSON.parse(user);
  } catch (e) {
    console.error(`Error parsing user from localStorage for role ${role}:`, e);
    return null;
  }
};

export const isTokenExpired = (role: UserRole): boolean => {
  if (typeof window === "undefined") return true;
  const expStr = localStorage.getItem(TOKEN_KEYS[role]);
  if (!expStr) return true;
  const expiresAt = parseInt(expStr, 10);
  if (isNaN(expiresAt)) return true;
  
  const bufferTime = 30 * 1000; // 30 seconds buffer
  return (Date.now() + bufferTime) > expiresAt;
}

export const isLoggedIn = (role: UserRole): boolean => {
  return !isTokenExpired(role);
};

export const logout = (role: UserRole) => {
  localStorage.removeItem(TOKEN_KEYS[role]);
  localStorage.removeItem(USER_KEYS[role]);
};
