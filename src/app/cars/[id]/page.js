"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";

export default function CarDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [car, setCar] = useState(null);

  useEffect(() => {
    async function fetchCar() {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("id", Number(id))
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
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="text-gray-400 mb-6 hover:text-red-500 transition duration-300"
      >
        ← Back
      </button>

      {/* Main car section */}
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-start gap-10">
        {/* Car image */}
        <div className="w-full lg:w-1/2 rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src={car.image_url || "/fallback.jpg"}
            alt={car.name}
            width={600}
            height={400}
            className="w-full h-80 object-cover transform hover:scale-105 transition duration-500"
          />
        </div>

        {/* Car info */}
        <div className="flex-1 flex flex-col gap-3">
          {/* Car name */}
          <h1 className="text-4xl lg:text-5xl font-extrabold text-red-500 mb-2">
            {car.name}
          </h1>

          {/* Car description */}
          <p className="text-gray-300 mb-4 text-lg leading-relaxed">
            {car.description || "No description available."}
          </p>

          {/* Other car details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-200 text-lg">
            <p><strong>Price per hour:</strong> Rs. {car.price_per_hour}</p>
            <p><strong>Color:</strong> {car.color || "N/A"}</p>
            <p><strong>Brand:</strong> {car.brand || "N/A"}</p>
            <p><strong>Transmission:</strong> {car.transmission || "N/A"}</p>
            <p><strong>Fuel:</strong> {car.fuel_type || "N/A"}</p>
            <p><strong>Engine:</strong> {car.engine_capacity || "N/A"}</p>
            <p><strong>Seats:</strong> {car.seating_capacity || "N/A"}</p>
            <p><strong>Mileage:</strong> {car.mileage || "N/A"}</p>
            <p><strong>Other info:</strong> {car.other_info || "N/A"}</p>
          </div>

          {/* Book Now button */}
          <Link href="/booking">
            <button className="mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-red-600/50">
              Book Now
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
