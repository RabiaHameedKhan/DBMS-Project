"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, User } from "lucide-react";
import useUser from "../utils/useUser";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  const loggedOutLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/#about" },
    { name: "Login", href: "/auth" },
  ];

  const loggedInLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/#about" },
    { name: "Cars", href: "/cars" },
  ];

  const navLinks = user ? loggedInLinks : loggedOutLinks;

  return (
    <nav
      style={{ backgroundColor: "#1C1C1E" }}
      className="text-white shadow-lg sticky top-0 z-50 border-b border-[#E63946]/30 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="text-3xl font-extrabold tracking-wide"
          style={{ color: "#E63946" }}
        >
          Rent<span className="text-gray-200">-A-Car</span>
        </Link>

        {/* Desktop Menu Links */}
        <div className="hidden md:flex flex-1 justify-center space-x-10 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-lg font-semibold transition-colors duration-300"
              style={{ color: "#D1D5DB" }}
              onMouseEnter={(e) => (e.target.style.color = "#E63946")}
              onMouseLeave={(e) => (e.target.style.color = "#D1D5DB")}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Profile Icon on Small + Large Screen */}
        <div className="flex items-center space-x-4">
          {user && (
            <Link href="/profile" className="relative group hidden md:block">
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Profile"
                  className="w-12 h-12 rounded-full border-2 border-red-500 object-cover shadow-md hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-md hover:scale-105 transition-transform duration-300">
                  <User className="w-6 h-6 text-white" />
                </div>
              )}
            </Link>
          )}

          {/* Logout on Desktop */}
          {user && (
            <button
              onClick={handleLogout}
              className="hidden md:block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-red-600/50"
            >
              Logout
            </button>
          )}

          {/* Mobile Profile Iconn */}
          {user && (
            <Link
              href="/profile"
              className="md:hidden"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shadow-md">
                <User className="w-5 h-5 text-white" />
              </div>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden focus:outline-none ml-2"
          >
            {isOpen ? (
              <X className="w-8 h-8 text-[#E63946]" />
            ) : (
              <Menu className="w-8 h-8 text-[#E63946]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          style={{ backgroundColor: "#2C2C2E" }}
          className="md:hidden py-6 space-y-4 text-center border-t border-gray-700"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block text-lg font-medium text-gray-300 hover:text-[#E63946] transition-all"
            >
              {link.name}
            </Link>
          ))}

          {/* Logout Button (Only if Logged In) */}
          {user && (
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-red-600/50"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
