"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
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
    { name: "Profile", href: "/profile" },
  ];

  const navLinks = user ? loggedInLinks : loggedOutLinks;

  return (
    <nav
      style={{ backgroundColor: "#1C1C1E" }}
      className="text-white shadow-lg sticky top-0 z-50 border-b border-[#E63946]/30 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Brand */}
        <Link
          href="/"
          className="text-3xl font-extrabold tracking-wide"
          style={{ color: "#E63946" }}
        >
          Rent<span className="text-gray-200">-A-Car</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-lg font-semibold transition-all duration-300"
              style={{ color: "#D1D5DB" }}
              onMouseEnter={(e) => (e.target.style.color = "#E63946")}
              onMouseLeave={(e) => (e.target.style.color = "#D1D5DB")}
            >
              {link.name}
            </Link>
          ))}

          {/* Logout button as modern standalone button */}
          {user && (
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition-all shadow-md"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden focus:outline-none"
        >
          {isOpen ? (
            <X className="w-8 h-8 text-[#E63946]" />
          ) : (
            <Menu className="w-8 h-8 text-[#E63946]" />
          )}
        </button>
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

          {user && (
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="block text-lg font-medium text-gray-300 hover:text-[#E63946] transition-all mx-auto px-4 py-2 bg-red-600 rounded-lg"
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
