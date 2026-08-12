"use client";

import Link from "next/link";
import { Reveal } from "@/components/animation/Reveal";

export function AboutStrip() {
  return (
    <section className="border-b border-slu-gray-200 bg-white py-16 sm:py-20">
      <Reveal className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <span className="mx-auto mb-5 block h-px w-24 bg-gradient-to-r from-transparent via-slu-blue to-transparent" />
        <h2 className="text-3xl font-bold text-slu-black sm:text-4xl">
          We don&apos;t walk alone.
        </h2>
        <p className="mt-4 text-lg text-slu-gray-600">
          Salt and Light United is a family of young believers in {""}
          Baliwag City — united by faith, growing together in Christ, and
          carrying His light into our schools, homes, and streets. You were
          never meant to follow Him by yourself.
        </p>
        <Link
          href="/about"
          className="mt-6 inline-block text-sm font-semibold text-slu-blue transition-colors hover:text-slu-blue-dark"
        >
          Learn more about us &rarr;
        </Link>
      </Reveal>
    </section>
  );
}
