"use client";

import { useState } from "react";
import {
  PaperPlaneRight,
  Sparkle,
  BookOpen,
  Users,
  Calendar,
  SpinnerGap,
} from "@phosphor-icons/react";
import { brand } from "@/lib/brand";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const suggestedPrompts = [
  {
    icon: <BookOpen size={18} />,
    text: "What is SLU's mission?",
  },
  {
    icon: <Users size={18} />,
    text: "How can I join a small group?",
  },
  {
    icon: <Calendar size={18} />,
    text: "What are the upcoming events?",
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    const history = messages.slice(-10);
    const payload = [...history, userMessage].map(({ role, content }) => ({
      role,
      content,
    }));

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
      });

      const data = await res.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.success
          ? data.data.content
          : data.error ?? "Sorry, something went wrong. Please try again.",
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "Sorry, I couldn't reach the server. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSuggestion(text: string) {
    setInput(text);
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-slu-blue">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
              Chat with {brand.shortName}
            </h1>
            <p className="mt-4 text-lg text-white/80">
              Ask questions about our fellowship, events, and community.
            </p>
          </div>
        </div>
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-slu-blue-dark/30 blur-3xl" />
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-slu-blue-light/20 blur-3xl" />
      </section>

      {/* Chat Interface */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          {/* Chat Window */}
          <div className="overflow-hidden rounded-2xl border border-slu-gray-200 bg-slu-offwhite">
            {/* Messages */}
            <div className="h-96 overflow-y-auto p-6">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slu-blue/10 text-slu-blue">
                    <Sparkle size={28} />
                  </div>
                  <p className="font-semibold text-slu-black">
                    How can we help you?
                  </p>
                  <p className="mt-1 text-sm text-slu-gray-500">
                    Ask anything about {brand.name}.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "bg-slu-blue text-white"
                            : "border border-slu-gray-200 bg-white text-slu-black"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex items-center gap-2 rounded-2xl border border-slu-gray-200 bg-white px-4 py-3 text-sm text-slu-gray-500">
                        <SpinnerGap size={16} className="animate-spin" />
                        Thinking...
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-3 border-t border-slu-gray-200 bg-white px-4 py-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-transparent text-sm text-slu-black placeholder:text-slu-gray-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slu-blue text-white transition-all hover:bg-slu-blue-dark disabled:opacity-40 disabled:hover:bg-slu-blue"
              >
                {isLoading ? (
                  <SpinnerGap size={16} className="animate-spin" />
                ) : (
                  <PaperPlaneRight size={16} />
                )}
              </button>
            </form>
          </div>

          {/* Suggested Prompts */}
          <div className="mt-6">
            <p className="mb-3 text-xs font-medium text-slu-gray-400 uppercase tracking-wide">
              Suggested
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt.text}
                  onClick={() => handleSuggestion(prompt.text)}
                  className="inline-flex items-center gap-2 rounded-full border border-slu-gray-200 bg-white px-4 py-2 text-xs font-medium text-slu-gray-600 transition-all hover:border-slu-blue hover:text-slu-blue"
                >
                  {prompt.icon}
                  {prompt.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
