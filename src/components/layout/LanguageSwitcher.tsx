"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Globe } from "@phosphor-icons/react";

interface LanguageSwitcherProps {
  isDark?: boolean;
}

export function LanguageSwitcher({ isDark = false }: LanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();

  const toggleLocale = () => {
    const newLocale = locale === "en" ? "fil" : "en";
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={toggleLocale}
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
        isDark
          ? "text-white/80 hover:bg-white/15 hover:text-white"
          : "text-slu-gray-600 hover:bg-slu-blue/10 hover:text-slu-blue"
      }`}
      aria-label={`Switch to ${locale === "en" ? "Filipino" : "English"}`}
    >
      <Globe size={14} />
      <span>{locale === "en" ? "EN" : "FIL"}</span>
    </button>
  );
}
