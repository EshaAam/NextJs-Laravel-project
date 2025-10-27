"use client";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AppContext } from "@/context/AppProvider";
import toast from "react-hot-toast";
import api from "@/lib/api"; //  Import API utility for making authenticated requests

// NEW: Product interface for TypeScript type safety
interface Product {
  id: number;
  name: string;
  description?: string;
  banner_image?: string;
  cost?: number;
}


const Dashboard: React.FC = () => {
  const { user, isAuthenticated, loading } = useContext(AppContext);
  const router = useRouter();

  // NEW: State for managing products list
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  //  NEW: Form state for add/edit product
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  //  NEW: Edit state - tracks which product is being edited
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Redirect to auth if not authenticated (but wait for loading to finish)
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, loading, router]);

  //  NEW: Fetch products when component mounts and user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  //  NEW: Function to fetch all products from API
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const response = await api.get("/products");
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoadingProducts(false);
    }
  };

  //  NEW: Handle file input change and generate preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  //  NEW: Reset form to initial state
  const resetForm = () => {
    setName("");
    setDescription("");
    setCost("");
    setBannerFile(null);
    setBannerPreview(null);
    setEditingProduct(null);
    // Reset file input
    const fileInput = document.getElementById("bannerInput") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  //  NEW: Handle form submission for both add and edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      if (description) formData.append("description", description);
      if (cost) formData.append("cost", cost);
      if (bannerFile) formData.append("banner_image", bannerFile);

      if (editingProduct) {
        // Update existing product
        await api.post(`/products/${editingProduct.id}?_method=PUT`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product updated successfully");
      } else {
        // Create new product
        await api.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product added successfully");
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Failed to save product:", error);
      const message = 
        error && typeof error === 'object' && 'response' in error 
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to save product"
          : "Failed to save product";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // NEW: Handle edit button click - populate form with product data
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description || "");
    setCost(product.cost?.toString() || "");
    setBannerPreview(product.banner_image ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${product.banner_image}` : null);
    setBannerFile(null);
  };

  // NEW: Handle delete button click with confirmation
  const handleDelete = async (productId: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.delete(`/products/${productId}`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product");
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg">Loading...</div>
    </div>;
  }

  // Show redirecting message if not authenticated
  if (!isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg">Redirecting to login...</div>
    </div>;
  }

  return (
    <>
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
            {/* Left Side: Form */}
            <div className="md:w-1/2">
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="text-xl font-semibold mb-4">
                  {/* ✅ UPDATED: Dynamic title based on edit state */}
                  {editingProduct ? "Edit Product" : "Add Product"}
                </h4>
                <form onSubmit={handleSubmit}>
                  {/* ✅ UPDATED: Controlled input with state */}
                  <input
                    className="form-control mb-2 p-2 border border-gray-300 rounded w-full"
                    name="name"
                    placeholder="Title"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  {/* ✅ UPDATED: Textarea for description */}
                  <textarea
                    className="form-control mb-2 p-2 border border-gray-300 rounded w-full"
                    name="description"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                  {/* ✅ UPDATED: Controlled number input */}
                  <input
                    className="form-control mb-2 p-2 border border-gray-300 rounded w-full"
                    name="cost"
                    placeholder="Cost"
                    type="number"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                  />

                  <div className="mb-2">
                    {/* ✅ UPDATED: Use bannerPreview state */}
                    {bannerPreview && (
                      <div className="mb-2">
                        <Image
                          src={bannerPreview}
                          alt="Preview"
                          width={100}
                          height={100}
                          className="rounded"
                        />
                      </div>
                    )}
                  </div>

                  {/* ✅ UPDATED: File input with onChange handler */}
                  <input
                    className="form-control mb-2 p-2 border border-gray-300 rounded w-full"
                    type="file"
                    id="bannerInput"
                    accept="image/*"
                    onChange={handleFileChange}
                  />

                  {/* ✅ UPDATED: Dynamic button with loading state and cancel button */}
                  <div className="flex gap-2">
                    <button
                      className="btn btn-primary bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
                      type="submit"
                      disabled={submitting}
                    >
                      {submitting
                        ? editingProduct
                          ? "Updating..."
                          : "Adding..."
                        : editingProduct
                        ? "Update Product"
                        : "Add Product"}
                    </button>
                    {editingProduct && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="btn bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Right Side: Table */}
            <div className="md:w-1/2">
              {/* ✅ UPDATED: Show loading state while fetching products */}
              <div className="overflow-x-auto">
                {loadingProducts ? (
                  <div className="text-center py-4">Loading products...</div>
                ) : (
                  <table className="table-auto w-full border border-gray-300">
                    <thead className="text-center">
                      <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-2 py-2">ID</th>
                        <th className="border border-gray-300 px-4 py-2">Title</th>
                        <th className="border border-gray-300 px-4 py-2">Banner</th>
                        <th className="border border-gray-300 px-4 py-2">Cost</th>
                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-center">
                      {/* ✅ UPDATED: Map over products array or show empty state */}
                      {products.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="border border-gray-300 px-4 py-4">
                            No products found. Add your first product!
                          </td>
                        </tr>
                      ) : (
                        products.map((product) => (
                          <tr key={product.id}>
                            <td className="border border-gray-300 px-2 py-2">
                              {product.id}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {product.name}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {/* ✅ UPDATED: Display product image from backend */}
                              {product.banner_image ? (
                                <Image
                                  src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${product.banner_image}`}
                                  alt={product.name}
                                  width={50}
                                  height={50}
                                  className="mx-auto rounded"
                                />
                              ) : (
                                <div className="w-[50px] h-[50px] bg-gray-100 rounded mx-auto flex items-center justify-center text-xs">
                                  No Image
                                </div>
                              )}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              ${product.cost || 0}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {/* ✅ UPDATED: Working edit and delete buttons */}
                              <button
                                onClick={() => handleEdit(product)}
                                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition text-sm me-2"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
        </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;