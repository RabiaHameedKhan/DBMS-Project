"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // REAL SUPABASE AUTH LOGIC
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignIn) {
      // -------------------------------
      // LOGIN
      // -------------------------------
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      alert("Logged in successfully!");
      router.push("/");
    } else {
      // -------------------------------
      // SIGNUP
      // -------------------------------
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            phone: formData.phone,
          },
        },
      });

      if (error) {
        alert(error.message);
        return;
      }

      alert("Account created! Please check your email for verification.");
      router.push("/");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f] px-4">
      <div className="bg-[#121212] p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-800">
        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-white mb-2">
          Welcome to <span className="text-[#c62828]">Rent-A-Car</span>
        </h2>
        <p className="text-gray-400 text-center mb-6">
          {isSignIn
            ? "Sign in or create an account to start renting"
            : "Create your account and start your journey today"}
        </p>

        {/* Toggle Buttons */}
        <div className="flex mb-6 bg-[#1a1a1a] rounded-lg p-1">
          <button
            onClick={() => setIsSignIn(true)}
            className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${
              isSignIn
                ? "bg-[#c62828] text-white shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignIn(false)}
            className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${
              !isSignIn
                ? "bg-[#c62828] text-white shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Additional fields only for Sign Up */}
          {!isSignIn && (
            <>
              <div>
                <label className="text-gray-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md bg-[#1f1f1f] text-white border border-gray-700 focus:border-[#c62828] outline-none"
                  required={!isSignIn}
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="+92 300 1234567"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md bg-[#1f1f1f] text-white border border-gray-700 focus:border-[#c62828] outline-none"
                />
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="text-gray-300 block mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-[#1f1f1f] text-white border border-gray-700 focus:border-[#c62828] outline-none"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-300 block mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-[#1f1f1f] text-white border border-gray-700 focus:border-[#c62828] outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 bg-[#c62828] text-white font-semibold rounded-md hover:bg-[#e53935] transition-all"
          >
            {isSignIn ? "Sign In" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
