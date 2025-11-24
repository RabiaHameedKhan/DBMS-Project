export async function POST(req) {
  try {
    const { message } = await req.json();

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), { status: 400 });
    }

    const prompt = `You are a helpful assistant for a car rental app.
Answer politely and give clear guidance to users about renting cars, booking, or general inquiries.
User: ${message}`;

    // Call Hugging Face Router API with wait_for_model
    const res = await fetch(
      "https://router.huggingface.co/models/tiiuae/falcon-7b-instruct",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
          "Accept": "application/json", // ensures JSON response
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { max_new_tokens: 150 },
          options: { wait_for_model: true } // waits until model is ready
        }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("HF API error:", text);
      return new Response(
        JSON.stringify({ reply: "Sorry, there was an error with the assistant." }),
        { status: 500 }
      );
    }

    const data = await res.json();
    let reply = "";

    if (Array.isArray(data) && data[0]?.generated_text) {
      reply = data[0].generated_text;
    } else {
      console.error("Unexpected HF response:", data);
      reply = "Sorry, I couldn't generate a response.";
    }

    return new Response(JSON.stringify({ reply }), { status: 200 });
  } catch (err) {
    console.error("Chatbot exception:", err);
    return new Response(JSON.stringify({ reply: "Sorry, something went wrong!" }), { status: 500 });
  }
}
