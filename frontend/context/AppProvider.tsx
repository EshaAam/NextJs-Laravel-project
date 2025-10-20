"use client";
import React, { createContext, useState, useEffect, useMemo, ReactNode, useContext } from "react";
import axios from "axios";

type User = {
  id?: string;
  name?: string;
  email?: string;
  token?: string;
} | null;

interface AppContextProps {
  user: User;
  setUser: (user: User) => void;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const STORAGE_KEY = "app_auth_user";

export const AppContext = createContext<AppContextProps>({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
  loading: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

// Build API URL from NEXT_PUBLIC_API_URL injected by Next.js / dotenv
const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // hydrate from localStorage on mount
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setUserState(parsed);
        if (parsed?.token) {
          api.defaults.headers.common["Authorization"] = `Bearer ${parsed.token}`;
        }
      }
    } catch (err) {
      console.warn("Failed to read auth from storage", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const persist = (nextUser: User) => {
    setUserState(nextUser);
    try {
      if (nextUser) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
        if (nextUser.token) api.defaults.headers.common["Authorization"] = `Bearer ${nextUser.token}`;
      } else {
        localStorage.removeItem(STORAGE_KEY);
        delete api.defaults.headers.common["Authorization"];
      }
    } catch (err) {
      console.warn("Failed to persist auth", err);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post("/login", { email, password });
      const token = res.data?.token;
      if (!token) throw new Error("No token returned from server");

      // set header for subsequent requests
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // fetch profile to get user data
      const profile = await api.get("/profile");
      const userData = profile.data?.data || { email };
      const nextUser: User = { ...userData, token };
      persist(nextUser);
    } catch (err) {
      // rethrow so caller can show error
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: { name: string; email: string; password: string }) => {
    setLoading(true);
    try {
      await api.post("/register", payload);
      // auto-login after successful registration
      await login(payload.email, payload.password);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      // call backend logout if available
      try {
        await api.post("/logout");
      } catch (_) {
        // ignore network / server errors on logout
      }
      delete api.defaults.headers.common["Authorization"];
      persist(null);
    } finally {
      setLoading(false);
    }
  };

  const setUser = (u: User) => {
    persist(u);
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      isAuthenticated: !!user?.token,
      loading,
      login,
      register,
      logout,
    }),
    [user, loading] 
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
// ...existing code...