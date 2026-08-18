"use client";

import { Reveal } from "@/components/animation/Reveal";
import { FacebookLogo } from "@phosphor-icons/react";
import { brand } from "@/lib/brand";
import { useTranslations } from "next-intl";

export function FacebookSection() {
  const t = useTranslations("home.facebook");
  return (
    <section id="facebook" className="bg-slu-blue py-12 sm:py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Copy */}
          <Reveal>
            <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl lg:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-4 text-base text-white/80 sm:mt-6 sm:text-lg">
              {t("description")}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center">
              <a
                href={brand.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slu-blue transition-colors hover:bg-slu-offwhite"
              >
                <FacebookLogo size={20} />
                Visit our Facebook page
              </a>
              <a
                href={brand.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
              >
                Send us a message
              </a>
            </div>
          </Reveal>

          {/* Profile card */}
          <Reveal>
            <a
              href={brand.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-1 hover:bg-white/15 sm:gap-4 sm:p-6"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white sm:h-16 sm:w-16">
                <FacebookLogo size={24} weight="fill" className="sm:hidden" />
                <FacebookLogo size={32} weight="fill" className="hidden sm:block" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-base font-bold text-white sm:text-lg">
                  {brand.name}
                </p>
                <p className="truncate text-xs text-white/70 sm:text-sm">
                  facebook.com/profile.php?id=61577421402391
                </p>
                <p className="mt-1 text-xs font-medium text-slu-blue-light group-hover:underline sm:text-sm">
                  Follow us &rarr;
                </p>
              </div>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
