"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient"; // <-- fixed import
import Link from "next/link";

export default function CarDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [car, setCar] = useState(null);

  useEffect(() => {
    async function fetchCar() {
      const { data, error } = await supabase
        .from("cars")
 // <-- exact table name
        .select("*")
        .eq("id", Number(id)) // <-- convert string to number
        .single();

      if (error) {
        console.error("Error fetching car:", error);
      } else {
        setCar(data);
      }
    }

    fetchCar();
  }, [id]);

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white py-20 px-6 sm:px-12">
      <button
        onClick={() => router.back()}
        className="text-gray-300 mb-6 hover:text-red-500 transition"
      >
        ← Back
      </button>

      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-10">
        <img
          src={car.image_url || "/fallback.jpg"}
          alt={car.name}
          className="w-full lg:w-1/2 h-80 object-cover rounded-2xl shadow-lg"
        />

        <div className="flex-1">
          <h1 className="text-4xl font-bold text-red-500 mb-4">{car.name}</h1>
          <p className="text-gray-300 mb-6 text-lg">
            {car.description || "No description available"}
          </p>

          <p className="text-xl font-semibold text-red-400 mb-6">
            Rs. {car.price_per_hour} / hour
          </p>

          <p className="text-gray-300 mb-1">
            <strong>Color:</strong> {car.color || "N/A"}
          </p>
          <p className="text-gray-300 mb-1">
            <strong>Brand:</strong> {car.brand || "N/A"}
          </p>
          <p className="text-gray-300 mb-1">
            <strong>Transmission:</strong> {car.transmission || "N/A"}
          </p>
          <p className="text-gray-300 mb-1">
            <strong>Fuel:</strong> {car.fuel_type || "N/A"}
          </p>
          <p className="text-gray-300 mb-1">
            <strong>Engine:</strong> {car.engine_capacity || "N/A"}
          </p>
          <p className="text-gray-300 mb-1">
            <strong>Seats:</strong> {car.seating_capacity || "N/A"}
          </p>

          <Link href="/booking">
            <button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-full mt-6 transition-all duration-300 shadow-md hover:shadow-red-600/40">
              Book Now
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
