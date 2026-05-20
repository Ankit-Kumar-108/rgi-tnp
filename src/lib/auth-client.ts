
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

export const saveAuth = (role: UserRole, token: string, user: any) => {
  localStorage.setItem(TOKEN_KEYS[role], token);
  localStorage.setItem(USER_KEYS[role], JSON.stringify(user));
};

export const getToken = (role: UserRole): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEYS[role]);
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

export const isTokenExpired = (token: string): boolean => {
 const parts = token.split('.')
 if (parts.length !== 3){
  return true
 }

 const payload = JSON.parse(atob(parts[1]))
 const expiresAt = payload.exp* 1000
 const bufferTime = 30*1000 // buffer time
 return (Date.now() + bufferTime) > expiresAt
}

export const isLoggedIn = (role: UserRole): boolean => {
  const token = getToken(role)
  if (!token) return false
  return !isTokenExpired(token)
};

export const logout = (role: UserRole) => {
  localStorage.removeItem(TOKEN_KEYS[role]);
  localStorage.removeItem(USER_KEYS[role]);
};
