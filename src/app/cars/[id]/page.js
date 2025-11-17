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
  const [currentImage, setCurrentImage] = useState(0);

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

  // Trim URLs to avoid leading/trailing spaces
  const images =
    car.image_url && car.image_url.length > 0
      ? car.image_url.map((url) => url.trim())
      : ["/fallback.jpg"];

  const prevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

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
        {/* Carousel container */}
        <div className="w-full lg:w-1/2 relative rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src={images[currentImage]}
            alt={car.name}
            width={600}
            height={400}
            className="w-full h-80 object-cover transform hover:scale-105 transition duration-500"
          />

          {/* Carousel controls */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-white text-3xl font-bold p-1 hover:text-red-500 transition"
              >
                ◀
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-3xl font-bold p-1 hover:text-red-500 transition"
              >
                ▶
              </button>
            </>
          )}

          {/* Image indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    currentImage === index ? "bg-red-500" : "bg-gray-400/50"
                  }`}
                ></span>
              ))}
            </div>
          )}
        </div>

        {/* Car info */}
        <div className="flex-1 flex flex-col gap-3">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-red-500 mb-2">
            {car.name}
          </h1>

          <p className="text-gray-300 mb-4 text-lg leading-relaxed">
            {car.description || "No description available."}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-200 text-lg">
            <p>
              <strong>Price per hour:</strong> Rs. {car.price_per_hour}
            </p>
            <p>
              <strong>Color:</strong> {car.color || "N/A"}
            </p>
            <p>
              <strong>Brand:</strong> {car.brand || "N/A"}
            </p>
            <p>
              <strong>Transmission:</strong> {car.transmission || "N/A"}
            </p>
            <p>
              <strong>Fuel:</strong> {car.fuel_type || "N/A"}
            </p>
            <p>
              <strong>Engine:</strong> {car.engine_capacity || "N/A"}
            </p>
            <p>
              <strong>Seats:</strong> {car.seating_capacity || "N/A"}
            </p>
            <p>
              <strong>Mileage:</strong> {car.mileage || "N/A"}
            </p>
            <p>
  <strong>Status:</strong> {car.status || "N/A"}
</p>

            <p>
              <strong>Other info:</strong> {car.other_info || "N/A"}
            </p>
          </div>

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
