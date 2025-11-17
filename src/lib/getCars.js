import { supabase } from "./supabaseClient";

export async function getCars() {
  console.log("PROD SUPABASE URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("PROD ANON KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "exists" : "missing");

  const { data, error } = await supabase
    .from("cars")
    .select("*");

  if (error) {
    console.error("Error loading cars:", error);
    return [];
  }

  return data;
}
