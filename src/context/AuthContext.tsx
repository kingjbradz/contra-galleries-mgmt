"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type ActionResult = { error: string | null };

type User = {
  id: string;
  username: string;
  role: string;
};

type AuthContextState = {
  user: User | null;
  loading: boolean;
  setUser: (u: User | null) => void;
  logout: () => Promise<ActionResult>
};

const AuthContext = createContext<AuthContextState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        const res = await fetch("/api/me");
        if (!mounted) return;
        if (!res.ok) {
          setUser(null);
        } else {
          const data = await res.json();
          setUser(data.user ?? null);
        }
      } catch (err) {
        setUser(null);
        const error = err instanceof Error ? err : new Error("setUser error.")
        return { error: error.message };
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  async function logout(): Promise<ActionResult>  {
    try {
      await fetch("/api/logout", { method: "POST" });
      return { error: null };
    } catch (err) {
    const error = err instanceof Error ? err : new Error("Logout error.")
    return { error: error.message };
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
