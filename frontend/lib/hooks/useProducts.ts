import { useState, useEffect } from "react";
import { productService } from "@/lib/services/product.service";
import { Product, CreateProductPayload } from "@/lib/types";
import toast from "react-hot-toast";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (payload: CreateProductPayload) => {
    setSubmitting(true);
    try {
      await productService.create(payload);
      toast.success("Product added successfully");
      await fetchProducts();
    } catch (error) {
      const message =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message || "Failed to add product"
          : "Failed to add product";
      toast.error(message);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const updateProduct = async (id: number, payload: CreateProductPayload) => {
    setSubmitting(true);
    try {
      await productService.update(id, payload);
      toast.success("Product updated successfully");
      await fetchProducts();
    } catch (error) {
      const message =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message || "Failed to update product"
          : "Failed to update product";
      toast.error(message);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await productService.delete(id);
      toast.success("Product deleted successfully");
      await fetchProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    submitting,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
