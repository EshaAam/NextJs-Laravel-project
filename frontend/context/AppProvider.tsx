"use client";
import React, { createContext, useState, useEffect, useMemo, useCallback, ReactNode } from "react";
import axios from "axios";
import Cookies from "js-cookie";

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
const TOKEN_KEY = "app_auth_token";

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
    // hydrate from cookies on mount and validate token
    const initializeAuth = async () => {
      try {
        const token = Cookies.get(TOKEN_KEY);
        const userData = Cookies.get(STORAGE_KEY);
        
        if (token && userData) {
          const parsed = JSON.parse(userData);
          
          // Set the token in axios headers
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          
          try {
            // Validate token by fetching profile
            const profile = await api.get("/profile");
            const freshUserData = profile.data?.data;
            if (freshUserData) {
              setUserState({ ...freshUserData, token });
            } else {
              // Token is invalid, clear auth
              clearAuth();
            }
          } catch {
            // Token is invalid or expired, clear auth
            clearAuth();
          }
        }
      } catch (err) {
        console.warn("Failed to read auth from cookies", err);
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const clearAuth = useCallback(() => {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(STORAGE_KEY);
    delete api.defaults.headers.common["Authorization"];
    setUserState(null);
  }, []);

  const persist = useCallback((nextUser: User) => {
    setUserState(nextUser);
    try {
      if (nextUser) {
        // Store token and user data in separate cookies with security options
        Cookies.set(TOKEN_KEY, nextUser.token!, {
          expires: 7, // 7 days
          secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
          sameSite: 'strict', // CSRF protection
          path: '/'
        });
        
        // Store user data (without token for security)
        const userDataWithoutToken = { ...nextUser };
        delete userDataWithoutToken.token;
        
        Cookies.set(STORAGE_KEY, JSON.stringify(userDataWithoutToken), {
          expires: 7, // 7 days
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/'
        });
        
        if (nextUser.token) {
          api.defaults.headers.common["Authorization"] = `Bearer ${nextUser.token}`;
        }
      } else {
        clearAuth();
      }
    } catch (err) {
      console.warn("Failed to persist auth", err);
      clearAuth();
    }
  }, [clearAuth]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post("/login", { email, password });
      const { token, user: userData } = res.data;
      
      if (!token) throw new Error("No token returned from server");

      // set header for subsequent requests
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const nextUser: User = { ...userData, token };
      persist(nextUser);
    } catch (err) {
      // Clear any existing auth on login failure
      persist(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [persist]);

  const register = useCallback(async (payload: { name: string; email: string; password: string }) => {
    setLoading(true);
    try {
      await api.post("/register", payload);
      // auto-login after successful registration
      await login(payload.email, payload.password);
    } finally {
      setLoading(false);
    }
  }, [login]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      // call backend logout if available
      try {
        await api.post("/logout");
      } catch {
        // ignore network / server errors on logout
      }
      persist(null);
    } finally {
      setLoading(false);
    }
  }, [persist]);

  const setUser = useCallback((u: User) => {
    persist(u);
  }, [persist]);

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
    [user, loading, login, register, logout, setUser]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};