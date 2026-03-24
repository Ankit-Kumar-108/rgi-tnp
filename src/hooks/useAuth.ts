"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn, getUser, type UserRole } from "@/lib/auth-client";

export function useAuth(role: UserRole, redirectTo?: string) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loggedIn = isLoggedIn(role);
    if (!loggedIn && redirectTo) {
      router.replace(redirectTo);
    } else {
      setAuthenticated(loggedIn);
      setUser(getUser(role));
    }
    setLoading(false);
  }, [role, redirectTo, router]);

  return { loading, authenticated, user };
}
