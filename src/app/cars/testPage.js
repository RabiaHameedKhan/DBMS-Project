// src/app/cars/testPage.jsx
import { getCars } from "@/lib/getCars";

export default async function TestCars() {
  const cars = await getCars();

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Test Cars Data</h1>
      <pre>{JSON.stringify(cars, null, 2)}</pre>
    </div>
  );
}
