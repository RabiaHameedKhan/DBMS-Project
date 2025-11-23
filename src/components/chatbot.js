"use client";

import { useState, useRef, useEffect } from "react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input) return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botMessage = { role: "assistant", content: data.reply };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      const errorMsg = { role: "assistant", content: "Sorry, something went wrong!" };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  return (
    <>
      {/* Floating 3D Chat Icon */}
      <div
        onClick={() => setOpen(!open)}
        className="fixed bottom-8 right-8 bg-red-600 w-20 h-20 flex items-center justify-center text-white rounded-full shadow-2xl cursor-pointer transform hover:scale-110 transition-all duration-300 z-50"
        style={{
          boxShadow: "0 8px 20px rgba(255, 0, 0, 0.6), 0 4px 6px rgba(0,0,0,0.3)",
        }}
        title="Chat with us"
      >
        💬
      </div>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-36 right-8 w-96 h-[500px] bg-black/80 backdrop-blur-md rounded-xl shadow-2xl border border-red-600 flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-red-700/90 p-4 text-white font-bold text-center tracking-wide text-lg">
            Rent-A-Car Assistant
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl max-w-[75%] ${
                  m.role === "user"
                    ? "bg-red-600/90 text-white ml-auto shadow-lg"
                    : "bg-gray-800/80 text-white shadow-md"
                }`}
              >
                {m.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex border-t border-red-600">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 p-3 bg-black/70 text-white placeholder-gray-400 focus:outline-none"
            />
            <button
              onClick={sendMessage}
              className="bg-red-600 hover:bg-red-500 px-6 flex items-center justify-center text-white font-semibold"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
