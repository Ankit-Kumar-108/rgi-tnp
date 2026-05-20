"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn, getUser, type UserRole, logout, getToken, saveAuth } from "@/lib/auth-client";

export function useAuth(role: UserRole, redirectTo?: string) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const scheduleRefresh = () => {
      const token = getToken(role)
      if (!token) return

      const payload = JSON.parse(atob(token.split('.')[1]))
      const expiresAt = payload.exp * 1000
      const refreshedAt = expiresAt - (5*60*1000)  // refresh 5 min before expiry
      const timeUntilRefresh = refreshedAt - Date.now()

      if(timeUntilRefresh > 0){
        setTimeout(async() => {
          try {
            const response = await fetch('/api/auth/refresh', {method: 'POST'})
            const data = await response.json() as any
            
            if (response.ok && data.token) {
              // Get current user data and save with new token
              const user = getUser(role)
              saveAuth(role, data.token, user)
              scheduleRefresh() // reschedule
            } else {
              logout(role)
              router.replace('/login')
            }
          } catch (error: any) {
            logout(role)
            router.replace('/login')
          }
        }, timeUntilRefresh);
      }
    }
    scheduleRefresh()
  }, [role])

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
