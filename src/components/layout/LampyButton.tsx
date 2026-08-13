"use client";

import Link from "next/link";
import { Sparkle } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";

export function LampyButton() {
  const pathname = usePathname();

  if (pathname === "/chat" || pathname.startsWith("/admin")) return null;

  return (
    <Link
      href="/chat"
      aria-label="Open Lampy assistant"
      className="group fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full border border-white/25 bg-slu-blue px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(7,112,189,0.45)] transition-all hover:-translate-y-1 hover:bg-slu-blue-light hover:shadow-[0_12px_36px_rgba(0,180,255,0.5)] sm:bottom-7 sm:right-7"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
        <Sparkle size={16} weight="fill" />
      </span>
      <span>Lampy</span>
    </Link>
  );
}
