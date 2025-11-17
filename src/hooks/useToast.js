"use client";
import { useState } from "react";
import Toast from "../components/toast";

export default function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success", duration = 30000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    // Automatically remove toast after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const ToastContainer = () => (
    <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 z-50 space-y-3">
      {toasts.map((t) => (
        <Toast
          key={t.id}
          message={t.message}
          type={t.type}
          onClose={() => removeToast(t.id)}
        />
      ))}
    </div>
  );

  return { showToast, ToastContainer };
}
