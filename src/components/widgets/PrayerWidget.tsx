"use client";

import { useState, useEffect } from "react";
import { HandsPraying, X, PaperPlaneRight, Check, Spinner } from "@phosphor-icons/react";
import { useSiteConfig } from "@/lib/useSiteConfig";

function getLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const linear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

function getEffectiveBg(el: HTMLElement | null): string {
  while (el && el !== document.body) {
    const bg = getComputedStyle(el).backgroundColor;
    if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
      const m = bg.match(/[\d.]+/g);
      if (m && m.length >= 3) {
        const r = parseInt(m[0]);
        const g = parseInt(m[1]);
        const b = parseInt(m[2]);
        return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
      }
    }
    el = el.parentElement;
  }
  return "#F0F0F0";
}

export function PrayerWidget() {
  const config = useSiteConfig();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const btn = document.querySelector("[data-prayer-btn]");
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const probeY = rect.top + rect.height / 2;
      const sections = document.querySelectorAll("section");
      let bg = "#F0F0F0";

      for (const section of Array.from(sections)) {
        const sRect = (section as HTMLElement).getBoundingClientRect();
        if (sRect.top <= probeY && sRect.bottom > probeY) {
          bg = getEffectiveBg(section as HTMLElement);
          break;
        }
      }

      const lum = getLuminance(bg);
      setTheme(lum < 0.4 ? "dark" : "light");
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

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
        data-prayer-btn
        className={`fixed bottom-20 right-5 z-40 inline-flex items-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold shadow-lg transition-all duration-500 hover:-translate-y-1 cursor-pointer sm:bottom-24 sm:right-7 ${
          theme === "dark"
            ? "border-white/25 bg-[#0A0A0A]/80 text-white shadow-[0_8px_30px_rgba(10,25,47,0.45)] hover:bg-[#0A0A0A]/90 hover:shadow-[0_12px_36px_rgba(10,25,47,0.5)]"
            : "border-slu-gray-200 bg-white/85 text-slu-gray-700 shadow-sm hover:bg-white/95"
        }`}
      >
        <span className={`flex h-7 w-7 items-center justify-center rounded-full ${
          theme === "dark" ? "bg-white/15" : "bg-slu-blue/10"
        }`}>
          <HandsPraying size={16} weight="fill" className={theme === "dark" ? "text-white" : "text-slu-blue"} />
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
            className="w-full max-w-sm max-h-[85vh] flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
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
            <div className="flex-1 overflow-y-auto p-5">
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
                    className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-slu-blue px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slu-navy/90 disabled:opacity-50 disabled:cursor-not-allowed"
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
