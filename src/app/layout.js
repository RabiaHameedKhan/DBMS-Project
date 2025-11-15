import './globals.css';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

export const metadata = {
  title: 'Rent-A-Car',
  description: 'A modern car rental web app built with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#111] text-white">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
