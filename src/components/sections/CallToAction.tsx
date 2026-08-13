"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { Reveal } from "@/components/animation/Reveal";

export function CallToAction() {
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
        <p className="text-base text-white/50">You&apos;ve seen who we are.</p>

        <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Now come be part of it.
        </h2>

        {/* SLU pill logo */}
        <div className="mt-8 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/WhiteBluePill.svg"
            alt="Salt and Light United"
            className="h-12 w-auto sm:h-14"
          />
        </div>

        <p className="mt-8 text-2xl font-bold tracking-tight text-[#D4A843] sm:text-3xl">
          Be the Light.
          <br />
          Be the Salt.
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
