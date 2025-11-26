import { createClient } from "@supabase/supabase-js";

// Format total price in PKR
function formatPKR(amount) {
  return `₨${amount.toLocaleString("en-PK")}`;
}

export async function GET(req) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token)
      return new Response(JSON.stringify({ error: "No token" }), { status: 401 });

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user)
      return new Response(JSON.stringify({ error: "User not authenticated" }), { status: 401 });

    const { data: bookingsData, error } = await supabase
      .from("bookings")
      .select("*, cars(*)")
      .eq("user_id", user.id)
      .order("date", { ascending: false });

    if (error)
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });

    const driverCost = 1000; // example driver cost

    const bookings = bookingsData.map((b) => {
      const start = new Date(`${b.date}T${b.start_time}`);
      const end = new Date(`${b.date}T${b.end_time}`);
      const hours = Math.ceil((end - start) / 1000 / 60 / 60);

      const totalPrice = (b.cars?.price_per_hour || 0) * hours + (b.with_driver ? driverCost : 0);

      // Handle image array
      let imageUrl = "/placeholder-car.png";
      if (b.cars?.image_url) {
        if (Array.isArray(b.cars.image_url) && b.cars.image_url.length > 0) {
          imageUrl = b.cars.image_url[0];
        } else if (typeof b.cars.image_url === "string") {
          imageUrl = b.cars.image_url;
        }
      }

      return {
        id: b.id,
        user_id: b.user_id,
        carName: b.cars?.name || "Unknown",
        car_type: b.cars?.car_type || "Unknown",
        color: b.cars?.color || "Unknown",
        image: imageUrl,
        date: b.date,
        start_time: b.start_time, // leave raw, ProfilePage will format
        end_time: b.end_time,     // leave raw, ProfilePage will format
        payment_method: b.payment_method,
        with_driver: b.with_driver,
        totalPrice: formatPKR(totalPrice),
        status: b.status,
      };
    });

    return new Response(JSON.stringify({ bookings }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
