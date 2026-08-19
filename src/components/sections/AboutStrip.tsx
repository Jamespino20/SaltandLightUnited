"use client";

import Link from "next/link";
import { Reveal } from "@/components/animation/Reveal";
import { useTranslations } from "next-intl";
import { useSiteConfig } from "@/lib/useSiteConfig";

export function AboutStrip() {
  const t = useTranslations("home.about");
  const config = useSiteConfig();
  return (
    <section
      id="about"
      className="relative isolate flex min-h-[70svh] items-center justify-center overflow-hidden bg-[#0A0A0A] sm:min-h-[100svh]"
    >
      {/* Background photo — full bleed, no cropping */}
      <div className="absolute inset-0 -z-20">
        <img
          src="/images/history/seventh_pic.png"
          alt="SLU group gathering"
          className="h-full w-full object-cover object-top"
        />
      </div>

      <Reveal className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
          {config.aboutTitle || t("title")}
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
          {config.aboutDescription || t("description")}
        </p>

        <Link
          href="/about"
          className="mt-8 inline-block text-sm font-semibold text-white/70 transition-colors hover:text-white"
        >
          Learn more about us &rarr;
        </Link>
      </Reveal>
    </section>
  );
}
