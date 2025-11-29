"use client";

import useToast from "../hooks/useToast";

export default function ToastProvider() {
  const { ToastContainer } = useToast();

  return <ToastContainer />;
}
