import { getCars } from "../../lib/getCars";
import Link from "next/link";

export default async function CarsPage() {
  const cars = await getCars();

  return (
    <section className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white py-20 px-6 sm:px-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-red-500">
        Available Cars
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {cars.map((car) => (
          <Link key={car.id} href={`/cars/${car.id}`}>
            <div className="bg-zinc-800 p-4 rounded-xl shadow-lg hover:scale-[1.03] transition cursor-pointer">
              <img
                src={car.image_url || "/fallback.jpg"}
                alt={car.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              <h2 className="text-2xl font-semibold mt-4 text-red-400">
                {car.name}
              </h2>
              <p className="text-gray-300">Color: {car.color || "N/A"}</p>

              <p className="text-lg text-red-500 font-bold mt-2">
                Rs. {car.price_per_hour} / hour
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
