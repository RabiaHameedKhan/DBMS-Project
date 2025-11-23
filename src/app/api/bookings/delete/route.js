import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  try {
    const body = await req.json();
    const { booking_id } = body;

    if (!booking_id) {
      return new Response(JSON.stringify({ error: "Booking ID is required" }), { status: 400 });
    }

    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return new Response(JSON.stringify({ error: "No token provided" }), { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "User not authenticated" }), { status: 401 });
    }

    // Delete booking where booking_id AND user_id match
    const { data, error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", booking_id)
      .eq("user_id", user.id); // ensures user can only delete their own booking

    if (error) {
      console.log(error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: "Booking deleted", booking: data[0] }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
