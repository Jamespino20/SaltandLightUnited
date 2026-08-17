"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { Reveal } from "@/components/animation/Reveal";
import { useTranslations } from "next-intl";

export function CallToAction() {
  const t = useTranslations("home.cta");
  return (
    <section
      id="cta"
      className="relative isolate overflow-hidden bg-[#0A0A0A] py-24 text-center text-white sm:py-32"
    >
      {/* Subtle gradient backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at center top, rgba(7,112,189,0.12) 0%, transparent 60%)",
        }}
      />

      <Reveal className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="text-base text-white/50">{t("seen")}</p>

        <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          {t("title")}
        </h2>

        <p className="mt-8 text-2xl font-bold tracking-tight sm:text-3xl">
          <span className="text-white">{t("salt")}</span>
          <br />
          <span className="text-slu-blue-light">{t("light")}</span>
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-slu-blue px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-slu-blue-dark hover:shadow-lg"
          >
            Get in Touch
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/groups"
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-8 py-3 text-sm font-semibold text-white transition-all hover:border-white hover:bg-white/10"
          >
            Browse Groups
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
