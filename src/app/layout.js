// src/app/layout.js
import './globals.css';
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import ToastProvider from "../components/ToastProvider"; // client wrapper
import SupabaseProvider from './supabase-provider';

export const metadata = {
  title: "Rent-A-Car",
  description: "Premium car rentals built with Next.js",
};

export default function RootLayout({ children }) {
  return (
            

    <html lang="en">
      <body className="bg-[#111] text-white">
      <SupabaseProvider>
        <Navbar />
        <ToastProvider /> {/* Client-side mounted toast */}
        <main>{children}</main>
        <Footer />
      </SupabaseProvider>

      </body>
    </html>
  );
}
