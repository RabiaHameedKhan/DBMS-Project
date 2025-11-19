"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import useUser from "../utils/useUser";

const Footer = () => {
  const { user } = useUser();

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
    <footer
      style={{ backgroundColor: "#1C1C1E" }}
      className="text-gray-300 border-t border-[#E63946]/30 pt-14 pb-10 mt-20"
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Brand Section */}
        <div>
          <h2 className="text-3xl font-extrabold mb-3" style={{ color: "#E63946" }}>
            Rent-A-Car
          </h2>
          <p className="text-gray-400 text-base leading-relaxed">
            Premium car rentals that combine comfort, luxury, and style — 
            drive your dream today.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="md:mx-auto text-center">
          <h3 className="text-xl font-semibold mb-4 text-white">Explore</h3>
          <ul className="space-y-3 text-lg">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="hover:text-[#E63946] transition">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Media */}
        <div className="text-center md:text-right">
          <h3 className="text-xl font-semibold mb-4 text-white">Follow Us</h3>
          <div className="flex justify-center md:justify-end space-x-6">
            <Link href="#" className="hover:text-[#E63946] transition"><Facebook /></Link>
            <Link href="#" className="hover:text-[#E63946] transition"><Instagram /></Link>
            <Link href="#" className="hover:text-[#E63946] transition"><Twitter /></Link>
            <Link href="#" className="hover:text-[#E63946] transition"><Linkedin /></Link>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-700 pt-5 text-center text-sm text-gray-400">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-[#E63946]">Rent-A-Car.</span> • Reliable • Affordable • Comfortable •
        <span className="font-semibold text-[#E63946]"> Made by Rabia Khan</span>
      </div>
    </footer>
  );
};

export default Footer;
