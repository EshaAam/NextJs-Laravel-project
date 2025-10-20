"use client";
import React, { useContext, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AppContext } from "@/context/AppProvider";


const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useContext(AppContext);
  const router = useRouter();

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, router]);

  // Example: replace with your real preview URL when available
  const bannerPreviewSrc: string | null = null; // set to a real URL or import when available
  const productImageSrc: string | null = null; // set to a real URL or import when available
  
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
              <h4 className="text-xl font-semibold mb-4">Add Product</h4>
              <form>
                <input className="form-control mb-2 p-2 border border-gray-300 rounded w-full" name="title" placeholder="Title" required />
                <input className="form-control mb-2 p-2 border border-gray-300 rounded w-full" name="description" placeholder="Description" required />
                <input className="form-control mb-2 p-2 border border-gray-300 rounded w-full" name="cost" placeholder="Cost" type="number" required />

                <div className="mb-2">
                  {bannerPreviewSrc ? (
                    <Image src={bannerPreviewSrc} alt="Preview" width={100} height={100} />
                  ) : (
                    <div className="w-[100px] h-[100px] bg-gray-100 rounded" style={{ display: "none" }} />
                  )}
                </div>

                <input className="form-control mb-2 p-2 border border-gray-300 rounded w-full" type="file" id="bannerInput" />
                <button className="btn btn-primary bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition" type="submit">Add Product</button>
              </form>
            </div>
          </div>

          {/* Right Side: Table */}
          <div className="md:w-1/2">
            <table className="table-auto w-full border border-gray-300">
              <thead className="text-center">
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-6 py-2">ID</th>
                  <th className="border border-gray-300 px-4 py-2">Title</th>
                  <th className="border border-gray-300 px-4 py-2">Banner</th>
                  <th className="border border-gray-300 px-4 py-2">Cost</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="text-center">
                <tr>
                  <td>1</td>
                  <td>Sample Product</td>
                  <td>
                    {productImageSrc ? (
                      <Image src={productImageSrc} alt="Product" width={50} height={50} />
                    ) : (
                      <div className="w-[50px] h-[50px] bg-gray-100 rounded" />
                    )}
                  </td>
                  <td>$100</td>
                  <td>
                    <button className="btn btn-warning btn-sm me-2">Edit</button>
                    <button className="btn btn-danger btn-sm">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;