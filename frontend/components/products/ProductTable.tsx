import React from "react";
import Image from "next/image";
import { Product } from "@/lib/types";

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}
// Displays a table of products with options to edit or delete each product
const ProductTable: React.FC<ProductTableProps> = ({
  products,
  loading,
  onEdit,
  onDelete,
}) => {
  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      onDelete(id);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading products...</div>;
  }

  return (
    <div className="overflow-x-auto">
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
                  {product.banner_image ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL?.replace(
                        "/api",
                        ""
                      )}${product.banner_image}`}
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
                  <button
                    onClick={() => onEdit(product)}
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
    </div>
  );
};

export default ProductTable;
