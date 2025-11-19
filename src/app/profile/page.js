"use client";

import { useState } from "react";
import { User, X, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  // Dummy user (replace with real Supabase user later)
  const user = {
    name: "Rabia",
    email: "rabia@example.com",
    username: "rabia01",
  };

  // Dummy bookings until backend is ready
  const bookings = [
    {
      id: 1,
      carName: "Toyota Corolla 2021",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
      date: "2025-01-15",
      pickup: "Karachi",
      dropoff: "Hyderabad",
      price: "8500 PKR",
      status: "Confirmed",
    },
  ];

  const [expandedCard, setExpandedCard] = useState(null);
  const [cancelModal, setCancelModal] = useState(null);
  const [showAccountDetails, setShowAccountDetails] = useState(false);

  return (
    <div className="min-h-screen bg-[#111] text-white flex">
      {/* =========================
          SIDEBAR (DARKER RED)
      ========================== */}
      <aside className="w-72 bg-red-900/90 p-8 flex flex-col items-center shadow-2xl shadow-red-950/40 rounded-r-3xl">
        {/* Profile Avatar */}
        <div className="w-28 h-28 rounded-full bg-white/10 flex items-center justify-center border-4 border-white/10 shadow-xl">
          <User className="w-12 h-12 text-white" />
        </div>

        <h2 className="mt-4 text-2xl font-bold tracking-wide">{user.name}</h2>

        {/* Sidebar Buttons */}
        <div className="mt-8 space-y-4 w-full">
          {/* Account Details Dropdown */}
          <div className="w-full">
            <button
              onClick={() => setShowAccountDetails(!showAccountDetails)}
              className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl transition font-semibold flex justify-between items-center px-4"
            >
              Account Details
              <ChevronDown
                className={`transition-transform ${
                  showAccountDetails ? "rotate-180" : ""
                }`}
              />
            </button>

            {showAccountDetails && (
              <div className="mt-3 bg-black/30 border border-white/10 rounded-xl p-4 space-y-2 text-gray-200 animate-fadeIn">
                <p>
                  <span className="font-semibold">Name:</span> {user.name}
                </p>
                <p>
                  <span className="font-semibold">Username:</span>{" "}
                  {user.username}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {user.email}
                </p>
              </div>
            )}
          </div>

         <Link
  href="/"
  className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl transition font-semibold flex justify-between items-center px-4"
            
>
  Home
</Link>

        </div>
      </aside>

      {/* =========================
          MAIN CONTENT – BOOKINGS
      ========================== */}
      <main className="flex-1 p-12">
        <h1 className="text-4xl font-extrabold mb-8">My Bookings</h1>

        <div className="space-y-8">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-[#1A1A1A] rounded-2xl shadow-xl shadow-black/40 p-6 hover:shadow-red-900/30 transition-all"
            >
              {/* Booking Header */}
              <div className="flex gap-6">
                <img
                  src={b.image}
                  alt={b.carName}
                  className="w-40 h-28 rounded-xl object-cover shadow-lg"
                />

                <div className="flex-1">
                  <h3 className="text-2xl font-bold">{b.carName}</h3>
                  <p className="text-gray-300 mt-1">
                    Pickup: <span className="font-semibold">{b.pickup}</span>
                  </p>
                  <p className="text-gray-300">
                    Dropoff: <span className="font-semibold">{b.dropoff}</span>
                  </p>
                  <p className="text-red-400 font-semibold mt-1">
                    Status: {b.status}
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col justify-between gap-3">
                  <button
                    onClick={() =>
                      setExpandedCard(expandedCard === b.id ? null : b.id)
                    }
                    className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition font-semibold shadow-md"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => setCancelModal(b.id)}
                    className="px-5 py-2 rounded-xl bg-red-700 hover:bg-red-800 transition font-semibold shadow-lg"
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>

              {/* View Details Dropdown */}
              {expandedCard === b.id && (
                <div className="mt-6 p-6 bg-black/30 rounded-xl border border-white/10">
                  <p className="text-gray-300">📅 Date: {b.date}</p>
                  <p className="text-gray-300">💰 Price: {b.price}</p>
                  <p className="text-gray-300">🚗 Car: {b.carName}</p>
                  <p className="text-gray-300">📍 Pickup: {b.pickup}</p>
                  <p className="text-gray-300">🏁 Dropoff: {b.dropoff}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* =========================
          CANCEL BOOKING MODAL
      ========================== */}
      {cancelModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1C1C1E] p-8 rounded-2xl w-[400px] shadow-2xl border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Cancel Booking?</h2>
              <button onClick={() => setCancelModal(null)}>
                <X className="text-gray-300" />
              </button>
            </div>

            <p className="text-gray-300 mb-6">
              Are you sure you want to cancel this booking?
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setCancelModal(null)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition font-semibold"
              >
                No
              </button>

              <button
                className="px-5 py-2 rounded-xl bg-red-700 hover:bg-red-800 transition font-semibold shadow-lg"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
