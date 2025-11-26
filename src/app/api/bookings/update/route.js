import { createClient } from "@supabase/supabase-js";

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, date, start_time, end_time, with_driver, payment_met } = body;

    if (!id) return new Response(JSON.stringify({ error: "Booking ID is required" }), { status: 400 });

    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return new Response(JSON.stringify({ error: "No token provided" }), { status: 401 });

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) return new Response(JSON.stringify({ error: "User not authenticated" }), { status: 401 });

    const { data, error } = await supabase
      .from("bookings")
      .update({ date, start_time, end_time, with_driver, payment_met })
      .eq("id", id)
      .eq("user_id", user.id)
      .select();

    if (error || !data || data.length === 0)
      return new Response(JSON.stringify({ error: "Booking not found" }), { status: 404 });

    return new Response(JSON.stringify({ message: "Booking updated", booking: data[0] }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
