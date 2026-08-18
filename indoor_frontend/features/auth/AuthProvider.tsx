"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi, type AuthUser } from "@/lib/auth-api";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  setUser: (user: AuthUser | null, sessionExpiresAt?: string | null) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [sessionExpiresAt, setSessionExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi.me()
      .then(({ user: currentUser, sessionExpiresAt: expiresAt }) => { setUser(currentUser); setSessionExpiresAt(expiresAt); })
      .catch(() => { setUser(null); setSessionExpiresAt(null); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!user || !sessionExpiresAt) return;
    const remaining = new Date(sessionExpiresAt).getTime() - Date.now();
    const timer = window.setTimeout(() => {
      setUser(null);
      setSessionExpiresAt(null);
    }, Math.max(remaining, 0));
    return () => window.clearTimeout(timer);
  }, [sessionExpiresAt, user]);

  const updateUser = useCallback((nextUser: AuthUser | null, expiresAt?: string | null) => {
    setUser(nextUser);
    if (!nextUser) setSessionExpiresAt(null);
    else if (expiresAt !== undefined) setSessionExpiresAt(expiresAt);
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    updateUser(null);
  }, [updateUser]);

  const value = useMemo(() => ({ user, loading, setUser: updateUser, logout }), [loading, logout, updateUser, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
