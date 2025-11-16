import { supabase } from "./supabaseClient";



export async function getCars() {
  const { data, error } = await supabase
    .from("cars")   // lowercase, no quotes needed
    .select("*");

  if (error) {
    console.error("Error loading cars:", error);
    return [];
  }

  return data;
}


