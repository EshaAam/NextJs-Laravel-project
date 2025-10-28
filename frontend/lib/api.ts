import axios from "axios";
import Cookies from "js-cookie";

//  Get API URL from environment variable
const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");

//  Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

//  Add interceptor to automatically attach authentication token to all requests
api.interceptors.request.use((config) => {
  try {
    // Get token from cookie (using js-cookie)
    const token = Cookies.get("app_auth_token");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.warn("Failed to attach auth token", err);
  }
  return config;
});

export default api;
