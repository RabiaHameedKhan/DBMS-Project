"use client";

import { useState, useEffect } from "react";
import { User, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [bookings, setBookings] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const [cancelModal, setCancelModal] = useState(null);
  const [showAccountDetails, setShowAccountDetails] = useState(false);
  const [loading, setLoading] = useState(true);

  // Convert 24-hour time to 12-hour AM/PM
  function formatTime24to12(time24) {
    const [hourStr, minuteStr] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const minute = minuteStr;
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour}:${minute} ${ampm}`;
  }

  // Fetch user info + bookings
  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      // Fetch User Info
      const { data: userData } = await supabase.auth.getUser();

      if (userData?.user) {
        setUser({
          name: userData.user.user_metadata?.name || "User",
          email: userData.user.email,
          phone: userData.user.user_metadata?.phone || "Not provided",
        });
      }

      // Fetch Bookings
      const res = await fetch("/api/bookings/get", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) setBookings(data.bookings);
      setLoading(false);
    }

    fetchData();
  }, []);

  // Cancel booking
  const handleCancelBooking = async (bookingId) => {
    setLoading(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      await fetch("/api/bookings/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ booking_id: bookingId }),
      });

      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      setCancelModal(null);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111] text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-red-900/90 p-6 md:p-8 flex flex-col items-center shadow-2xl shadow-red-950/40 rounded-b-3xl md:rounded-r-3xl md:rounded-b-none">
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white/10 flex items-center justify-center border-4 border-white/10 shadow-xl">
          <User className="w-10 h-10 md:w-12 md:h-12 text-white" />
        </div>

        <h2 className="mt-4 text-xl md:text-2xl font-bold tracking-wide text-center">
          {user.name}
        </h2>

        <div className="mt-6 md:mt-8 space-y-4 w-full">
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
              <div className="mt-3 bg-black/30 border border-white/10 rounded-xl p-4 space-y-2 text-gray-200 animate-fadeIn text-sm md:text-base">
                <p>
                  <span className="font-semibold">Name:</span> {user.name}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {user.email}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span> {user.phone}
                </p>
              </div>
            )}
          </div>

          <Link
            href="/"
            className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl transition font-semibold flex justify-center items-center px-4 text-center"
          >
            Home
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-6 md:mb-8">
          My Bookings
        </h1>

        {loading ? (
          <p className="text-gray-300">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-300">No bookings found.</p>
        ) : (
          <div className="space-y-6 md:space-y-8">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="bg-[#1A1A1A] rounded-2xl shadow-xl shadow-black/40 p-4 md:p-6 hover:shadow-red-900/30 transition-all"
              >
                <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                  <img
                    src={b.image || "/placeholder-car.png"}
                    alt={b.carName}
                    className="w-full md:w-40 md:h-40 h-full rounded-xl object-cover shadow-lg"
                  />

                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold">{b.carName}</h3>
                    <p className="text-gray-300 mt-1">
                      Type: <span className="font-semibold">{b.car_type}</span>
                    </p>
                    <p className="text-gray-300">
                      Color: <span className="font-semibold">{b.color}</span>
                    </p>
                    <p className="text-red-400 font-semibold mt-1">
                      Status: {b.status}
                    </p>
                  </div>

                  <div className="flex flex-row md:flex-col justify-between gap-2 md:gap-3 mt-2 md:mt-0">
                    <button
                      onClick={() =>
                        setExpandedCard(expandedCard === b.id ? null : b.id)
                      }
                      className="px-4 py-2 md:px-5 md:py-2 rounded-xl bg-white/10 hover:bg-white/20 transition font-semibold shadow-md"
                    >
                      View Details
                    </button>

                    <button
                      onClick={() => setCancelModal(b.id)}
                      className="px-4 py-2 md:px-5 md:py-2 rounded-xl bg-red-700 hover:bg-red-800 transition font-semibold shadow-lg"
                    >
                      Cancel Booking
                    </button>
                  </div>
                </div>

                {expandedCard === b.id && (
                  <div className="mt-4 md:mt-6 p-4 md:p-6 bg-black/30 rounded-xl border border-white/10 text-sm md:text-base space-y-1 text-gray-300">
                    <p>
                      <span className="font-semibold">Date:</span> {b.date}
                    </p>
                    <p>
                      <span className="font-semibold">Start Time:</span>{" "}
                      {formatTime24to12(b.start_time)}
                    </p>
                    <p>
                      <span className="font-semibold">End Time:</span>{" "}
                      {formatTime24to12(b.end_time)}
                    </p>
                    <p>
                      <span className="font-semibold">Payment Method:</span>{" "}
                      {b.payment_method}
                    </p>
                    <p>
                      <span className="font-semibold">With Driver:</span>{" "}
                      {b.with_driver ? "Yes" : "No"}
                    </p>
                    <p>
                      <span className="font-semibold">Total Price:</span> ₹
                      {b.totalPrice}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Cancel Booking Modal */}
      {cancelModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-[#1C1C1E] p-6 md:p-8 rounded-2xl w-full max-w-md shadow-2xl border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Cancel Booking?</h2>
              <button onClick={() => setCancelModal(null)}>
                <X className="text-gray-300" />
              </button>
            </div>

            <p className="text-gray-300 mb-6">
              Are you sure you want to cancel this booking?
            </p>

            <div className="flex justify-end gap-4 flex-wrap">
              <button
                onClick={() => setCancelModal(null)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition font-semibold"
              >
                No
              </button>

              <button
                onClick={() => handleCancelBooking(cancelModal)}
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
