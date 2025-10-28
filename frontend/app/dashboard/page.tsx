"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { useProducts } from "@/lib/hooks/useProducts";
import ProductForm from "@/components/products/ProductForm";
import ProductTable from "@/components/products/ProductTable";
import { Product } from "@/lib/types";

const Dashboard: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const {
    products,
    loading: loadingProducts,
    submitting,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, loading, router]);

  const handleSubmit = async (data: {
    name: string;
    description: string;
    cost: string;
    banner_image: File | null;
  }) => {
    const payload = {
      ...data,
      banner_image: data.banner_image ?? undefined,
    };
    if (editingProduct) {
      await updateProduct(editingProduct.id, payload);
      setEditingProduct(null);
    } else {
      await createProduct(payload);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-4 px-4">
      {/* User Details Section */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-2xl font-bold mb-4">Welcome to Dashboard</h2>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-semibold">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <h3 className="text-xl font-semibold">{user?.name || "User"}</h3>
            <p className="text-gray-600">{user?.email || "No email"}</p>
            <p className="text-sm text-gray-500">ID: {user?.id || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Inventory Management Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Inventory Management</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-1/2">
            <ProductForm
              editingProduct={editingProduct}
              onSubmit={handleSubmit}
              onCancel={() => setEditingProduct(null)}
              submitting={submitting}
            />
          </div>

          <div className="md:w-1/2">
            <ProductTable
              products={products}
              loading={loadingProducts}
              onEdit={setEditingProduct}
              onDelete={deleteProduct}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
