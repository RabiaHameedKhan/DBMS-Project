"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";


export default function CarsPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/auth"); // redirect to login if not logged in
      } else {
        setUser(user);
      }
    });
  }, [router]);

  if (!user) return null; // prevent page flash before redirect

  return (
    <section className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white py-20 px-6 sm:px-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-red-500">
        Available Cars
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {cars.map((car) => {
          // Safely get the first image URL
          const firstImage =
            car.image_url && car.image_url.length > 0
              ? car.image_url[0].trim() // remove any leading/trailing spaces
              : "/fallback.jpg";

          return (
            <Link
              key={car.id}
              href={`/cars/${car.id}`}
              className="block bg-zinc-800 p-4 rounded-xl shadow-lg hover:scale-[1.03] transition cursor-pointer"
            >
              <Image
                src={firstImage}
                alt={car.name}
                width={500}
                height={300}
                className="w-full h-48 object-cover rounded-lg"
              />

              <h2 className="text-2xl font-semibold mt-4 text-red-400">
                {car.name}
              </h2>
              <p className="text-gray-300">Color: {car.color || "N/A"}</p>
              <p className="text-lg text-red-500 font-bold mt-2">
                Rs. {car.price_per_hour} / hour
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
