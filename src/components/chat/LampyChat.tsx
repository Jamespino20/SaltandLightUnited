"use client";

import { useState, useRef, useEffect } from "react";
import {
  PaperPlaneRight,
  Sparkle,
  BookOpen,
  Users,
  Calendar,
  SpinnerGap,
  SealCheck,
  X,
  Minus,
} from "@phosphor-icons/react";
import { brand } from "@/lib/brand";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const suggestedPrompts = [
  { icon: <BookOpen size={14} />, text: "What is SLU's mission?" },
  { icon: <Users size={14} />, text: "How can I join?" },
  { icon: <Calendar size={14} />, text: "Upcoming events?" },
];

interface LampyChatProps {
  open: boolean;
  onClose: () => void;
}

export function LampyChat({ open, onClose }: LampyChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && !minimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open, minimized]);

  useEffect(() => {
    if (open && !minimized) {
      inputRef.current?.focus();
    }
  }, [open, minimized]);

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
          content: "Sorry, I couldn't reach the server. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed bottom-20 right-5 z-50 sm:bottom-24 sm:right-7">
      <div
        className={`w-[340px] sm:w-[380px] overflow-hidden rounded-2xl border border-slu-gray-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.25)] transition-all duration-300 ${
          minimized ? "h-14" : "h-[480px]"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-slu-blue px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
              <Sparkle size={14} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{brand.shortName} Assistant</p>
              <p className="flex items-center gap-1 text-[11px] text-white/70">
                <SealCheck size={10} /> Here to help
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setMinimized(!minimized)}
              className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
              aria-label={minimized ? "Expand" : "Minimize"}
            >
              <Minus size={16} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body — hidden when minimized */}
        {!minimized && (
          <>
            {/* Messages */}
            <div className="h-[340px] overflow-y-auto p-4">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slu-blue/10 text-slu-blue">
                    <Sparkle size={24} />
                  </div>
                  <p className="font-semibold text-slu-black">How can we help?</p>
                  <p className="mt-1 text-xs text-slu-gray-500">Ask anything about {brand.name}.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.role === "assistant" && (
                        <div className="mr-2 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slu-blue/10 text-slu-blue">
                          <Sparkle size={12} />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed ${
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
                      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-slu-gray-200 bg-slu-offwhite px-3 py-2 text-[13px] text-slu-gray-500">
                        <SpinnerGap size={14} className="animate-spin" />
                        Thinking...
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Suggested prompts */}
            {messages.length === 0 && (
              <div className="flex flex-wrap gap-1.5 px-4 pb-2">
                {suggestedPrompts.map((p) => (
                  <button
                    key={p.text}
                    type="button"
                    onClick={() => setInput(p.text)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slu-gray-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slu-gray-600 transition-colors hover:border-slu-blue hover:text-slu-blue"
                  >
                    {p.icon}
                    {p.text}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t border-slu-gray-200 bg-slu-offwhite px-3 py-2.5"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-full bg-white px-3 py-2 text-[13px] text-slu-black placeholder:text-slu-gray-400 focus:outline-none focus:ring-2 focus:ring-slu-blue/30"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slu-blue text-white transition-colors hover:bg-slu-blue-dark disabled:opacity-40"
              >
                {isLoading ? (
                  <SpinnerGap size={14} className="animate-spin" />
                ) : (
                  <PaperPlaneRight size={14} />
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
