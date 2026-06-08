"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn, getUser, type UserRole, logout } from "@/lib/auth-client";

export function useAuth(role: UserRole, redirectTo?: string) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = isLoggedIn(role);
      if (!loggedIn) {
        logout(role)
        if(redirectTo) router.replace(redirectTo)
        setAuthenticated(false)
      } else {
        setAuthenticated(loggedIn);
        setUser(getUser(role));
      }
      setLoading(false);
    }
    
    checkAuth()
    const interval = setInterval(checkAuth, 60000)
    return () => clearInterval(interval)
  }, [role, redirectTo, router]);

  return { loading, authenticated, user };
}
