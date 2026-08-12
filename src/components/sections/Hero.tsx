"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { brand } from "@/lib/brand";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-slu-blue">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Be the Light.
              <br />
              <span className="text-slu-offwhite/80">Be the Salt.</span>
            </h1>
            <p className="max-w-lg text-lg text-white/80">
              {brand.name} is a Christ-centered community of students and young
              people based in Baliwag City. Join our family of young believers
              making a difference.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/groups"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slu-blue transition-all hover:bg-slu-offwhite hover:shadow-lg"
              >
                Join Us
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-white hover:bg-white/10"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Visual — Logo Mark */}
          <div className="hidden lg:flex lg:justify-end">
            <div className="relative">
              <div className="flex h-64 w-64 items-center justify-center rounded-full border-4 border-white/20 bg-white/10 backdrop-blur-sm">
                <span className="text-8xl font-black text-white/90">SLU</span>
              </div>
              {/* Decorative rings */}
              <div className="absolute -inset-8 rounded-full border border-white/10" />
              <div className="absolute -inset-16 rounded-full border border-white/5" />
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-slu-blue-dark/30 blur-3xl" />
      <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-slu-blue-light/20 blur-3xl" />
    </section>
  );
}
