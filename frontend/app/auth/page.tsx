"use client";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AppContext } from "@/context/AppProvider";

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, loading, logout, isAuthenticated } = useContext(AppContext);
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const resetFields = () => {
    setName("");
    setEmail("");
    setPassword("");
    setPasswordConfirmation("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // call login from context
        await login(email, password);
        toast.success("Login successful");

        //navigate to dashboard page
        router.push("/dashboard");
      } else {
        if (password !== passwordConfirmation) {
          toast.error("Passwords do not match");
          return;
        }
        await register({ name, email, password });
        toast.success("Registration successful");
        // After successful registration, navigate to dashboard (register auto-logs in)
        router.push("/dashboard");
      }
      resetFields();
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message || "An error occurred");
    }
  };

  return (
    <div className="container mx-auto flex justify-center items-center min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold">
            {isLogin ? "Login" : "Register"}
          </h3>
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              resetFields();
            }}
            className="text-sm text-blue-500 hover:underline"
          >
            {isLogin ? "Switch to Register" : "Switch to Login"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {!isLogin && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control mb-3 p-2 border border-gray-300 rounded w-full"
              name="name"
              type="text"
              placeholder="Name"
              required
            />
          )}

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control mb-3 p-2 border border-gray-300 rounded w-full"
            name="email"
            type="email"
            placeholder="Email"
            required
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control mb-3 p-2 border border-gray-300 rounded w-full"
            name="password"
            type="password"
            placeholder="Password"
            required
          />

          {!isLogin && (
            <input
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="form-control mb-3 p-2 border border-gray-300 rounded w-full"
              name="password_confirmation"
              type="password"
              placeholder="Confirm Password"
              required
            />
          )}

          <button
            className="btn btn-primary w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading
              ? isLogin
                ? "Logging in..."
                : "Registering..."
              : isLogin
              ? "Login"
              : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              resetFields();
            }}
            className="text-blue-500 font-medium hover:underline"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
        {/* create a logout button */}
        {isAuthenticated && (
          <div className="mt-4 text-center">
            <button
              onClick={async () => {
                try {
                 await logout();
                 toast.success("Logged out");
                 router.push("/");
                } catch (err) {
                  console.error(err);
                  toast.error("Failed to logout");
                }
              }}
              className="text-red-500 font-medium hover:underline"
              disabled={loading}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
