"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { List, X } from "@phosphor-icons/react";
import { brand } from "@/lib/brand";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/groups", label: "Groups" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
];

const sectionIds = ["hero", "about", "events", "facebook", "groups", "scripture", "cta"];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        if (id === "events" || id === "facebook" || id === "groups") {
          setTheme("light");
        } else {
          setTheme("dark");
        }
        break;
      }
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: "-40% 0px -55% 0px",
      threshold: 0,
    });

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [handleObserver]);

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
              src="/images/BlueWhitePill.svg"
              alt="Salt and Light United"
              className="h-full w-full object-contain"
            />
          </div>
          <span
            className={`hidden text-sm font-semibold sm:inline ${
              isDark ? "text-white" : "text-slu-black"
            }`}
          >
            {brand.name}
          </span>
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
