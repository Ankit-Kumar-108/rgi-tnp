// Client-side auth token helpers (localStorage)

const TOKEN_KEYS: Record<string, string> = {
  student: "student_token",
  recruiter: "recruiter_token",
  alumni: "alumni_token",
};

const USER_KEYS: Record<string, string> = {
  student: "student_user",
  recruiter: "recruiter_user",
  alumni: "alumni_user",
};

export type UserRole = "student" | "recruiter" | "alumni";

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
  return user ? JSON.parse(user) : null;
};

export const isLoggedIn = (role: UserRole): boolean => {
  return !!getToken(role);
};

export const logout = (role: UserRole) => {
  localStorage.removeItem(TOKEN_KEYS[role]);
  localStorage.removeItem(USER_KEYS[role]);
};
