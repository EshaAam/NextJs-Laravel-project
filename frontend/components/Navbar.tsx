"use client";
import Link from "next/link";
import { useState, useContext } from "react";
import { AppContext } from "@/context/AppProvider";
import toast from "react-hot-toast";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout, loading } = useContext(AppContext);

  return (
    //remove underline from all navbar links

    <nav className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-semibold tracking-wide text-blue-500 hover:text-indigo-400 transition no-underline">
          MyApp
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link href="/" className="hover:text-indigo-400 transition no-underline">Home</Link>
          
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="hover:text-indigo-400 transition no-underline">Dashboard</Link>
              <button
                onClick={async () => {
                  try {
                    await logout();
                    toast.success("Logged out successfully");
                  } catch (err) {
                    console.error(err);
                    toast.error("Failed to logout");
                  }
                }}
                className="hover:text-indigo-400 transition no-underline bg-transparent border-none cursor-pointer text-white"
                disabled={loading}
              >
                {loading ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <Link href="/auth" className="hover:text-indigo-400 transition no-underline">Login</Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center text-gray-300 hover:text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 px-4 py-3 space-y-2">
          <Link href="/" className="block hover:text-indigo-400">Home</Link>
          
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="block hover:text-indigo-400">Dashboard</Link>
              <button
                onClick={async () => {
                  try {
                    await logout();
                    toast.success("Logged out successfully");
                    setIsOpen(false); // Close mobile menu after logout
                  } catch (err) {
                    console.error(err);
                    toast.error("Failed to logout");
                  }
                }}
                className="block hover:text-indigo-400 bg-transparent border-none cursor-pointer text-white text-left w-full"
                disabled={loading}
              >
                {loading ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <Link href="/auth" className="block hover:text-indigo-400">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
