export async function POST(req) {
  try {
    const { message } = await req.json();

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), { status: 400 });
    }

    const prompt = `You are a helpful assistant for a car rental app.
Answer politely and give clear guidance to users about renting cars, booking, or general inquiries.
User: ${message}`;

    const res = await fetch(
      "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    const data = await res.json();

    let reply = "";

    // Handle different response formats
    if (data?.generated_text) {
      reply = data.generated_text;
    } else if (Array.isArray(data) && data[0]?.generated_text) {
      reply = data[0].generated_text;
    } else if (data?.error) {
      reply = "Sorry, the assistant is loading. Please try again in a few seconds.";
    } else {
      reply = "Sorry, I couldn't generate a response.";
    }

    return new Response(JSON.stringify({ reply }), { status: 200 });
  } catch (err) {
    console.error("Chatbot error:", err);
    return new Response(JSON.stringify({ reply: "Sorry, something went wrong!" }), { status: 500 });
  }
}
