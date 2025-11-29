import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ---- SUPABASE CLIENT ----
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ---- STATIC TRAINING DATA ----
const STATIC_INFO = `
You are a Rent-A-Car Assistant for a real application.

The system has:
- Cars table (car_name, brand, model, rent_per_day, transmission, seats, fuel_type, ac)
- Bookings table (car_id, date, start_time, end_time, with_driver, payment_method)

Rules:
- If user asks about a car → fetch from cars table.
- If user asks about price → use rent_per_day.
- If user asks about availability → check bookings table.
- If user asks for all cars → return all cars.
- Always be accurate based on data provided.
- If database returns nothing → politely say it's not available.
`;

// ---- HELPER: Extract possible car name ----
function extractCarName(message) {
  const words = message.toLowerCase().split(" ");
  const possibleNames = [];

  for (let i = 0; i < words.length - 1; i++) {
    possibleNames.push(words[i] + " " + words[i + 1]); // bigrams (e.g., "honda civic")
  }

  return possibleNames;
}

// ---- MAIN DATABASE LOGIC ----
async function getDatabaseInfo(message) {
  const lower = message.toLowerCase();

  // 1. ALL CARS
  if (lower.includes("all cars") || lower.includes("available cars")) {
    const { data } = await supabase.from("cars").select("*");
    return data || "No cars found.";
  }

  // 2. Extract car name dynamically
  const possibleNames = extractCarName(lower);

  for (const name of possibleNames) {
    const { data: car } = await supabase
      .from("cars")
      .select("*")
      .ilike("car_name", `%${name}%`)
      .limit(1);

    if (car && car.length > 0) {
      // If question includes word "available", check bookings
      if (lower.includes("available") || lower.includes("availability")) {
        const { data: bookings } = await supabase
          .from("bookings")
          .select("*")
          .eq("car_id", car[0].id);

        return {
          car: car[0],
          bookings,
        };
      }

      // Else return car info only
      return { car: car[0] };
    }
  }

  // 3. If user talks about price but no car detected → return price list
  if (lower.includes("price") || lower.includes("rent")) {
    const { data } = await supabase.from("cars").select("car_name, rent_per_day");
    return data || "No price data found.";
  }

  return "No matching data found.";
}

// ---- MAIN API ENDPOINT ----
export async function POST(req) {
  try {
    const { message } = await req.json();

    // --- Fetch database data based on user query ---
    const dbInfo = await getDatabaseInfo(message);

    // --- Construct final prompt for LLM ---
    const finalPrompt = `
${STATIC_INFO}

User Message:
"${message}"

Database Info (must use this data in your answer):
${JSON.stringify(dbInfo, null, 2)}

Answer clearly, accurately, and politely.
`;

    // ---- ORIGINAL WORKING GROQ CALL (UNTOUCHED) ----
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: finalPrompt }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API Error:", errorText);
      return NextResponse.json({ error: "Groq API request failed" }, { status: 500 });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "No response from AI.";

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
