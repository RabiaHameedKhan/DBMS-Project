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

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "User not authenticated" }), { status: 401 });
    }

    const { data, error } = await supabase
      .from("bookings")
      .insert([
        {
          user_id: user.id,
          car_id,
          date,
          start_time,
          end_time,
          with_driver: with_driver === "yes", // convert to boolean
          payment_method, // fixed typo
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) {
      console.log(error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: "Booking successful!", booking: data }), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
