"use client";

import { Reveal } from "@/components/animation/Reveal";
import { FacebookLogo } from "@phosphor-icons/react";
import { brand } from "@/lib/brand";

export function FacebookSection() {
  return (
    <section id="facebook" className="bg-slu-blue py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Copy */}
          <Reveal>
            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Join the FB page to{" "}
              <span className="text-slu-blue-light">be updated and to join.</span>
            </h2>
            <p className="mt-6 text-lg text-white/80">
              Stay connected with Salt and Light United through our official
              Facebook page. Get the latest updates on events, fellowship
              nights, and community activities — straight from our feed.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={brand.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slu-blue transition-colors hover:bg-slu-offwhite"
              >
                <FacebookLogo size={20} />
                Visit our Facebook page
              </a>
              <a
                href={brand.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
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
              className="group flex items-center gap-4 rounded-2xl border border-white/20 bg-white/10 p-6 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-1 hover:bg-white/15"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white">
                <FacebookLogo size={32} weight="fill" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-lg font-bold text-white">
                  {brand.name}
                </p>
                <p className="truncate text-sm text-white/70">
                  facebook.com/profile.php?id=61577421402391
                </p>
                <p className="mt-1 text-sm font-medium text-slu-blue-light group-hover:underline">
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
