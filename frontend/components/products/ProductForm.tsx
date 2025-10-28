import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Product } from "@/lib/types";

interface ProductFormProps {
  editingProduct: Product | null;
  onSubmit: (data: {
    name: string;
    description: string;
    cost: string;
    banner_image: File | null;
  }) => Promise<void>;
  onCancel: () => void;
  submitting: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  editingProduct,
  onSubmit,
  onCancel,
  submitting,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setDescription(editingProduct.description || "");
      setCost(editingProduct.cost?.toString() || "");
      setBannerPreview(
        editingProduct.banner_image
          ? `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}${
              editingProduct.banner_image
            }`
          : null
      );
      setBannerFile(null);
    } else {
      resetForm();
    }
  }, [editingProduct]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setCost("");
    setBannerFile(null);
    setBannerPreview(null);
    const fileInput = document.getElementById("bannerInput") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ name, description, cost, banner_image: bannerFile });
    resetForm();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h4 className="text-xl font-semibold mb-4">
        {editingProduct ? "Edit Product" : "Add Product"}
      </h4>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2 p-2 border border-gray-300 rounded w-full"
          placeholder="Title"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          className="form-control mb-2 p-2 border border-gray-300 rounded w-full"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        <input
          className="form-control mb-2 p-2 border border-gray-300 rounded w-full"
          placeholder="Cost"
          type="number"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
        />

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

        <input
          className="form-control mb-2 p-2 border border-gray-300 rounded w-full"
          type="file"
          id="bannerInput"
          accept="image/*"
          onChange={handleFileChange}
        />

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
              onClick={onCancel}
              className="btn bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
