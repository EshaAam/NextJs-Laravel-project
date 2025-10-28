export interface User {
  id?: string;
  name?: string;
  email?: string;
  token?: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  banner_image?: string;
  cost?: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface CreateProductPayload {
  name: string;
  description?: string;
  cost?: string;
  banner_image?: File;
}
