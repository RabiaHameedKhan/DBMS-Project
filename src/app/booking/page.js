"use client";

export const dynamic = "force-dynamic";



import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // import useRouter
import { supabase } from "../../lib/supabaseClient";

/* ---------------- CUSTOM DROPDOWN COMPONENT ---------------- */
function CustomDropdown({ label, name, value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const selectedLabel =
    options.find((option) => option.value === value)?.label || "Select";

  return (
    <div className="relative">
      <label className="block text-gray-300 mb-1">{label}</label>
      <div
        onClick={() => setOpen(!open)}
        className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white
        cursor-pointer flex justify-between items-center hover:bg-zinc-800 transition-all duration-300"
      >
        <span>{selectedLabel}</span>
        <span className="text-gray-400">▼</span>
      </div>

      {open && (
        <ul className="absolute z-20 w-full bg-zinc-900 border border-zinc-700 rounded-lg mt-1 shadow-xl overflow-hidden">
          {options.map((item) => (
            <li
              key={item.value}
              onClick={() => {
                onChange({ target: { name, value: item.value } });
                setOpen(false);
              }}
              className="p-3 text-white hover:bg-zinc-700 cursor-pointer transition-all duration-200"
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------------------- MAIN PAGE ---------------------- */
export default function BookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter(); // initialize router

  const [formData, setFormData] = useState({
    date: "",
    start_time: "",
    end_time: "",
    with_driver: "",
    payment_method: "",
  });

  const [userId, setUserId] = useState(null);
  const [carId, setCarId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Get logged-in user + car_id from URL
  useEffect(() => {
    async function init() {
      // Get user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);

      // Get car_id from URL
      const cid = searchParams.get("car_id");
      if (cid) setCarId(cid);
    }
    init();
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!userId || !carId) {
      setMessage("User or car not found. Please login and select a car.");
      setLoading(false);
      return;
    }

    const payload = {
      car_id: carId,
      date: formData.date,
      start_time: formData.start_time,
      end_time: formData.end_time,
      with_driver: formData.with_driver,
      payment_method: formData.payment_method,
    };

    // Get token
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;

    const res = await fetch("/api/bookings/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Something went wrong.");
    } else {
      setMessage("Booking successful!");
      setFormData({
        date: "",
        start_time: "",
        end_time: "",
        with_driver: "",
        payment_method: "",
      });

      // Redirect to Profile page after successful booking
      router.push("/profile");
    }

    setLoading(false);
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white flex flex-col items-center justify-center px-6 py-20">
      <div className="bg-zinc-800/70 border border-zinc-700 rounded-2xl p-8 sm:p-10 w-full max-w-lg shadow-lg backdrop-blur-sm">
        <h1 className="text-4xl font-bold text-center text-red-500 mb-6">
          Book Your Ride
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Date */}
          <div>
            <label className="block text-gray-300 mb-1">Select Date</label>
            <input
              type="date"
              name="date"
              onChange={handleChange}
              value={formData.date}
              required
              className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white"
            />
          </div>

          {/* Start Time */}
          <div>
            <label className="block text-gray-300 mb-1">Start Time</label>
            <input
              type="time"
              name="start_time"
              onChange={handleChange}
              value={formData.start_time}
              required
              className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white"
            />
          </div>

          {/* End Time */}
          <div>
            <label className="block text-gray-300 mb-1">End Time</label>
            <input
              type="time"
              name="end_time"
              onChange={handleChange}
              value={formData.end_time}
              required
              className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white"
            />
          </div>

          {/* With Driver */}
          <CustomDropdown
            label="With Driver?"
            name="with_driver"
            value={formData.with_driver}
            onChange={handleChange}
            options={[
              { value: "no", label: "No" },
              { value: "yes", label: "Yes (+ extra cost)" },
            ]}
          />

          {/* Payment Method */}
          <CustomDropdown
            label="Payment Method"
            name="payment_method"
            value={formData.payment_method}
            onChange={handleChange}
            options={[
              { value: "cash", label: "Cash" },
              { value: "card", label: "Credit / Debit Card" },
              { value: "easypaisa", label: "EasyPaisa" },
              { value: "jazzcash", label: "JazzCash" },
            ]}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900 text-white font-semibold py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-red-600/40"
          >
            {loading ? "Processing..." : "Confirm Booking"}
          </button>

          {message && (
            <p className="text-center mt-3 text-gray-300">{message}</p>
          )}
        </form>
      </div>
    </section>
  );
}
