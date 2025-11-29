import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  try {
    const body = await req.json();
    const { car_id, date, start_time, end_time, with_driver, payment_method } = body;

    if (!car_id || !date || !start_time || !end_time) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return new Response(JSON.stringify({ error: "No token found" }), { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        global: {
          headers: { Authorization: `Bearer ${token}` },
        },
      }
    );

    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "User not authenticated" }), { status: 401 });
    }

    // CHECK FOR OVERLAPPING BOOKINGS
  const { data: overlappingBookings, error: overlapError } = await supabase
  .from("bookings")
  .select("*")
  .eq("car_id", car_id)
  .eq("date", date)
  .lt("start_time", end_time)   // existing start_time < new end_time
  .gt("end_time", start_time);  // existing end_time > new start_time


    if (overlapError) {
      return new Response(JSON.stringify({ error: overlapError.message }), { status: 500 });
    }

    if (overlappingBookings.length > 0) {
      return new Response(JSON.stringify({ error: "Car not available for this timing" }), { status: 400 });
    }

    // INSERT BOOKING
    const { data, error } = await supabase
      .from("bookings")
      .insert([
        {
          user_id: user.id,
          car_id,
          date,
          start_time,
          end_time,
          with_driver: with_driver === "yes",
          payment_method,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: "Booking successful!", booking: data }), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
