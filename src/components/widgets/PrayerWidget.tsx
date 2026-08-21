"use client";

import { useState } from "react";
import { HandsPraying, X, PaperPlaneRight, Check,Spinner } from "@phosphor-icons/react";
import { useSiteConfig } from "@/lib/useSiteConfig";

export function PrayerWidget() {
  const config = useSiteConfig();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/prayer-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim() }),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      // silent fail
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setMessage("");
    setSubmitted(false);
  };

  return (
    <>
      {/* Toggle button — stacked above Lampy */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open prayer request"
        className="fixed bottom-20 right-5 z-40 inline-flex items-center gap-2 rounded-full border border-white/25 bg-slu-navy px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(10,25,47,0.45)] transition-all hover:-translate-y-1 hover:bg-slu-navy/90 hover:shadow-[0_12px_36px_rgba(10,25,47,0.5)] sm:bottom-24 sm:right-7 cursor-pointer"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
          <HandsPraying size={16} weight="fill" />
        </span>
        <span className="hidden sm:inline">Pray for Us</span>
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-end bg-black/30 p-4 sm:items-center sm:justify-center sm:bg-black/40 sm:p-0"
          onClick={handleClose}
        >
          <div
            className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-slu-navy px-5 py-4">
              <div className="flex items-center gap-2">
                <HandsPraying size={18} className="text-slu-gold" weight="fill" />
                <h3 className="text-sm font-bold text-white">How can we pray for you?</h3>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg p-1 text-white/60 transition-colors hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5">
              {submitted ? (
                <div className="space-y-4 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                    <Check size={24} className="text-emerald-600" />
                  </div>
                  <p className="text-sm font-semibold text-slu-black">
                    Thank you for sharing.
                  </p>
                  <p className="text-sm text-slu-gray-500">
                    We&apos;d love to connect with you.
                  </p>
                  <a
                    href={config.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-slu-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slu-blue-dark"
                  >
                    Visit us on Facebook
                  </a>
                </div>
              ) : (
                <>
                  <label className="mb-3 block text-sm font-medium text-slu-gray-700">
                    Share your prayer request
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="Type your prayer request here..."
                    className="w-full resize-none rounded-xl border border-slu-gray-200 px-4 py-3 text-sm text-slu-black outline-none transition-colors placeholder:text-slu-gray-400 focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
                  />
                  <p className="mt-2 text-xs text-slu-gray-400">
                    This is anonymous. Only our admin team will see your request.
                  </p>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!message.trim() || submitting}
                    className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-slu-navy px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slu-navy/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <Spinner size={16} className="animate-spin" />
                    ) : (
                      <PaperPlaneRight size={16} />
                    )}
                    {submitting ? "Sending..." : "Submit Prayer Request"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
