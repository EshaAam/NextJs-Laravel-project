import api from "@/lib/api";
import { Product, CreateProductPayload } from "@/lib/types";
import { API_ENDPOINTS } from "@/lib/constants";


// Service for managing products. 
export const productService = {
  getAll: async (): Promise<Product[]> => {
    const res = await api.get(API_ENDPOINTS.PRODUCTS);
    return res.data.products || [];
  },

  create: async (payload: CreateProductPayload) => {
    const formData = new FormData();
    formData.append("name", payload.name);
    if (payload.description) formData.append("description", payload.description);
    if (payload.cost) formData.append("cost", payload.cost);
    if (payload.banner_image) formData.append("banner_image", payload.banner_image);

    const res = await api.post(API_ENDPOINTS.PRODUCTS, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  update: async (id: number, payload: CreateProductPayload) => {
    const formData = new FormData();
    formData.append("name", payload.name);
    if (payload.description) formData.append("description", payload.description);
    if (payload.cost) formData.append("cost", payload.cost);
    if (payload.banner_image) formData.append("banner_image", payload.banner_image);

    const res = await api.post(`${API_ENDPOINTS.PRODUCTS}/${id}?_method=PUT`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  delete: async (id: number) => {
    await api.delete(`${API_ENDPOINTS.PRODUCTS}/${id}`);
  },
};
