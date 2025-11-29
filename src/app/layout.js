import './globals.css';
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import ToastProvider from "../components/ToastProvider"; 
import SupabaseProvider from './supabase-provider';
import Chatbot from '../components/chatbot';

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
        <ToastProvider /> 
        <main>{children}</main>
        <Chatbot/>
        <Footer />
      </SupabaseProvider>

      </body>
    </html>
  );
}
