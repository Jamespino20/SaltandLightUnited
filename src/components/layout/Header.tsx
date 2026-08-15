"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { List, X } from "@phosphor-icons/react";
import { brand } from "@/lib/brand";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/groups", label: "Community" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
];

const sectionIds = [
  "hero",
  "about",
  "events",
  "facebook",
  "groups",
  "scripture",
  "cta",
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const sectionTheme: Record<string, "dark" | "light"> = {
    hero: "dark",
    about: "dark",
    events: "light",
    facebook: "light",
    groups: "light",
    scripture: "dark",
    cta: "dark",
  };

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const probe = 90;
      let current: "dark" | "light" = "dark";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) {
          current = sectionTheme[id] ?? "dark";
          break;
        }
      }
      setTheme(current);
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

  const isDark = theme === "dark";

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 sm:px-6">
      <header
        className={`flex w-full max-w-5xl items-center justify-between rounded-full px-4 py-2.5 backdrop-blur-md transition-all duration-500 sm:px-6 ${
          isDark
            ? "border border-white/10 bg-[#0A0A0A]/80"
            : "border border-slu-gray-200 bg-white/85 shadow-sm"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-9 w-9 flex-shrink-0">
            <img
              src={isDark ? "/images/SaltandLightWhiteTransparent.svg" : "/images/SaltandLightBlueTransparent.svg"}
              alt="Salt and Light United"
              className="h-full w-full object-contain"
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isDark
                  ? "text-white/70 hover:bg-white/10 hover:text-white"
                  : "text-slu-gray-600 hover:bg-slu-blue/10 hover:text-slu-blue"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button
          type="button"
          className={`rounded-lg p-2 md:hidden ${
            isDark
              ? "text-white/70 hover:bg-white/10"
              : "text-slu-gray-600 hover:bg-slu-gray-100"
          }`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={22} /> : <List size={22} />}
        </button>
      </header>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav
          className={`absolute top-16 left-4 right-4 max-w-5xl rounded-2xl border p-3 shadow-lg md:hidden ${
            isDark
              ? "border-white/10 bg-[#0A0A0A]/95 backdrop-blur-md"
              : "border-slu-gray-200 bg-white/95 backdrop-blur-md"
          }`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                isDark
                  ? "text-white/70 hover:bg-white/10 hover:text-white"
                  : "text-slu-gray-600 hover:bg-slu-blue/10 hover:text-slu-blue"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
