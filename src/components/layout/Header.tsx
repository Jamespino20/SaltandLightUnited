"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { List, X } from "@phosphor-icons/react";
import { brand } from "@/lib/brand";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { useTranslations } from "next-intl";

const navLinks = [
  { href: "/about", key: "about" },
  { href: "/events", key: "events" },
  { href: "/groups", key: "community" },
  { href: "/resources", key: "resources" },
  { href: "/bible", key: "bible" },
  { href: "/contact", key: "contact" },
];

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

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const t = useTranslations("nav");

  useEffect(() => {
    let raf = 0;
    const probeY = 90;

    const update = () => {
      raf = 0;

      // Walk through all sections and find which one is at the probe Y position
      const sections = document.querySelectorAll("section");
      let bg = "#F0F0F0";

      for (const section of Array.from(sections)) {
        const rect = (section as HTMLElement).getBoundingClientRect();
        if (rect.top <= probeY && rect.bottom > probeY) {
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
              src={
                isDark
                  ? "/images/SaltandLightWhiteTransparent.svg"
                  : "/images/SaltandLightBlueTransparent.svg"
              }
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
              {t(link.key)}
            </Link>
          ))}
          <div
            className={`ml-2 border-l ${isDark ? "border-white/20" : "border-slu-gray-200"}`}
          >
            <LanguageSwitcher isDark={isDark} />
          </div>
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
              {t(link.key)}
            </Link>
          ))}
          <div
            className={`mt-2 border-t ${isDark ? "border-white/20" : "border-slu-gray-200"} pt-2`}
          >
            <LanguageSwitcher isDark={isDark} />
          </div>
        </nav>
      )}
    </div>
  );
}
