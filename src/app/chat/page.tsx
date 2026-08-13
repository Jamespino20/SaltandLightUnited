"use client";

import { useState } from "react";
import {
  PaperPlaneRight,
  Sparkle,
  BookOpen,
  Users,
  Calendar,
  SpinnerGap,
  SealCheck,
} from "@phosphor-icons/react";
import { brand } from "@/lib/brand";
import { WaveTransition } from "@/components/sections/WaveTransition";

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
      {/* Hero — matches the landing page treatment */}
      <section className="relative overflow-hidden bg-[#0A0A0A]">
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 h-[85vmin] w-[85vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-90"
          style={{
            background:
              "radial-gradient(circle, rgba(7,112,189,0.55) 0%, rgba(0,180,255,0.3) 30%, rgba(0,200,255,0.1) 55%, transparent 75%)",
            filter: "blur(40px)",
          }}
        />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-white/90">
              <Sparkle size={14} /> AI Assistant
            </span>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl">
              Chat with {brand.shortName}
            </h1>
            <p className="mt-4 text-lg text-white/80">
              Ask anything about our fellowship, events, groups, and community.
            </p>
          </div>
        </div>
      </section>

      <WaveTransition from="dark" to="light" />

      {/* Chat Interface */}
      <section className="bg-slu-offwhite py-12 sm:py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          {/* Chat Window */}
          <div className="overflow-hidden rounded-3xl border border-slu-gray-200 bg-white shadow-sm">
            {/* Window header */}
            <div className="flex items-center gap-3 border-b border-slu-gray-200 bg-slu-blue px-5 py-4 text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                <Sparkle size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">
                  {brand.name} Assistant
                </p>
                <p className="flex items-center gap-1 text-xs text-white/70">
                  <SealCheck size={12} /> Here to help with SLU questions
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="h-[26rem] overflow-y-auto p-5">
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
                      {msg.role === "assistant" && (
                        <div className="mr-2 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slu-blue/10 text-slu-blue">
                          <Sparkle size={16} />
                        </div>
                      )}
                      <div
                        className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "rounded-br-sm bg-slu-blue text-white"
                            : "rounded-bl-sm border border-slu-gray-200 bg-slu-offwhite text-slu-black"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-slu-gray-200 bg-slu-offwhite px-4 py-3 text-sm text-slu-gray-500">
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
              className="flex items-center gap-2 border-t border-slu-gray-200 bg-slu-offwhite px-3 py-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-full bg-white px-4 py-2.5 text-sm text-slu-black placeholder:text-slu-gray-400 focus:outline-none focus:ring-2 focus:ring-slu-blue/40"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slu-blue text-white transition-all hover:bg-slu-blue-dark disabled:opacity-40 disabled:hover:bg-slu-blue"
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

