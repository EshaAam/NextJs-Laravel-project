import api from "@/lib/api";
import { LoginPayload, RegisterPayload } from "@/lib/types";
import { API_ENDPOINTS } from "@/lib/constants";

// Service for authentication-related operations.
export const authService = {
  login: async (payload: LoginPayload) => {
    const res = await api.post(API_ENDPOINTS.LOGIN, payload);
    return res.data;
  },

  register: async (payload: RegisterPayload) => {
    const res = await api.post(API_ENDPOINTS.REGISTER, payload);
    return res.data;
  },

  getProfile: async () => {
    const res = await api.get(API_ENDPOINTS.PROFILE);
    return res.data.data;
  },

  logout: async () => {
    await api.post(API_ENDPOINTS.LOGOUT);
  },
};
