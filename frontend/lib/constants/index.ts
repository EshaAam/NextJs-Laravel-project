export const STORAGE_KEYS = {
  AUTH_USER: "app_auth_user",
  AUTH_TOKEN: "app_auth_token",
} as const;

export const API_ENDPOINTS = {
  LOGIN: "/login",
  REGISTER: "/register",
  LOGOUT: "/logout",
  PROFILE: "/profile",
  PRODUCTS: "/products",
} as const;

export const ROUTES = {
  HOME: "/",
  AUTH: "/auth",
  DASHBOARD: "/dashboard",
} as const;
