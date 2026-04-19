"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    { role: "user" | "bot"; content: string }[]
  >([
    {
      role: "bot",
      content:
        "Hi! I'm your Palate AI Chef. Tell me your ingredients, diet, servings, and skill level for tailored recipes. You can also say: 'cook mode', 'scale to 6', 'substitute eggs', or 'next step'.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [messages, loading]);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    const nextMessages = [
      ...messages,
      { role: "user" as const, content: userMessage },
    ];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          history: nextMessages.slice(-8),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [...prev, { role: "bot", content: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: `Error: ${data.error}` },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Sorry, I couldn't reach the backend server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[20rem] sm:w-[22rem] h-[30rem] max-h-[75vh] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden transition-all duration-300">
          <div className="bg-orange-500 text-white p-4 flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2">
              <MessageCircle size={18} />
              Palate AI Assistant
            </h3>
            <button
              onClick={toggleChat}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div
            ref={messagesContainerRef}
            className="flex-1 min-h-0 p-4 overflow-y-auto overflow-x-hidden bg-gray-50 flex flex-col gap-3"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[85%] p-3 rounded-2xl whitespace-pre-wrap break-words ${
                  msg.role === "user"
                    ? "bg-orange-500 text-white self-end rounded-tr-none"
                    : "bg-white border text-gray-800 self-start rounded-tl-none"
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="bg-white border text-gray-800 self-start rounded-2xl rounded-tl-none p-3 truncate">
                Thinking...
              </div>
            )}
          </div>

          <form
            onSubmit={sendMessage}
            className="p-3 bg-white border-t flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What are you craving?"
              className="flex-1 px-3 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center h-10 w-10"
            >
              <Send size={18} className="-ml-0.5" />
            </button>
          </form>
        </div>
      )}

      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-xl transition-transform hover:scale-105"
        >
          <MessageCircle size={28} />
        </button>
      )}
    </div>
  );
}
