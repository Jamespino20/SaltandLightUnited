"use client";

import Link from "next/link";
import { Reveal } from "@/components/animation/Reveal";

export function AboutStrip() {
  return (
    <section
      id="about"
      className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden"
    >
      {/* Background photo with dark overlay */}
      <div className="absolute inset-0 -z-20">
        <img
          src="/images/history/seventh_pic.jpg"
          alt="SLU group gathering"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0A0A0A]/70 via-[#0A0A0A]/50 to-[#0A0A0A]/80" />

      <Reveal className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
          We don&apos;t walk{" "}
          <span className="text-slu-blue-light">alone.</span>
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
          Salt and Light United is a family of young believers in Baliwag City —
          united by faith, growing together in Christ, and carrying His light
          into our schools, homes, and streets. You were never meant to follow
          Him by yourself.
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
