"use client";
import { useEffect } from "react";

export default function Toast({ message, type = "success", onClose }) {
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    type === "success"
      ? "bg-red-600"
      : type === "error"
      ? "bg-gray-800"
      : "bg-gray-700";

  return (
    <div
      className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg fixed top-5 right-5 z-50 animate-slideIn`}
      style={{ minWidth: "250px" }}
    >
      {message}
    </div>
  );
}
