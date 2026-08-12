"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { Reveal } from "@/components/animation/Reveal";

export function CallToAction() {
  return (
    <section className="relative isolate overflow-hidden bg-slu-black py-20 text-center text-white sm:py-28">
      {/* the light returns — brightest at the invitation */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 -z-10 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,224,160,0.35), rgba(7,112,189,0.14) 45%, transparent 70%)",
          filter: "blur(28px)",
        }}
      />
      <Reveal className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="text-lg text-white/70">You&apos;ve seen who we are.</p>
        <h2 className="mt-2 text-4xl font-black sm:text-5xl">
          Now come be part of it.
        </h2>

        <div className="mt-10 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/WhiteBluePill.svg"
            alt="Salt and Light United"
            className="h-12 w-auto opacity-90 drop-shadow-[0_0_24px_rgba(255,221,150,0.45)]"
          />
        </div>

        <p className="mt-8 text-2xl font-bold tracking-tight text-amber-100 sm:text-3xl">
          Be the Light.
          <br />
          Be the Salt.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 text-sm font-semibold text-slu-blue transition-all hover:bg-amber-100 hover:shadow-[0_0_30px_rgba(255,221,150,0.5)]"
          >
            Get in Touch
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/groups"
            className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-8 py-3 text-sm font-semibold text-white transition-all hover:border-white hover:bg-white/10"
          >
            Browse Groups
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
