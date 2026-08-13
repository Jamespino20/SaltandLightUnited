"use client";

import { Reveal } from "@/components/animation/Reveal";
import { FacebookLogo } from "@phosphor-icons/react";
import { brand } from "@/lib/brand";

export function FacebookSection() {
  return (
    <section id="facebook" className="bg-[#F0F0F0] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Copy */}
          <Reveal>
            <h2 className="text-3xl font-bold text-slu-black sm:text-4xl lg:text-5xl">
              Join the FB page to{" "}
              <span className="text-slu-blue">be updated and to join.</span>
            </h2>
            <p className="mt-6 text-lg text-slu-gray-600">
              Stay connected with Salt and Light United through our official
              Facebook page. Get the latest updates on events, fellowship
              nights, and community activities — straight from our feed.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={brand.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-slu-blue px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slu-blue-dark"
              >
                <FacebookLogo size={20} />
                Visit our Facebook page
              </a>
              <a
                href={brand.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slu-gray-300 px-6 py-3 text-sm font-semibold text-slu-blue transition-colors hover:border-slu-blue"
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
              className="group flex items-center gap-4 rounded-2xl border border-slu-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slu-blue/10 text-slu-blue">
                <FacebookLogo size={32} weight="fill" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-lg font-bold text-slu-black">
                  {brand.name}
                </p>
                <p className="truncate text-sm text-slu-gray-500">
                  facebook.com/profile.php?id=61577421402391
                </p>
                <p className="mt-1 text-sm font-medium text-slu-blue group-hover:underline">
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
