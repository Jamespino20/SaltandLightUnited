"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { brand } from "@/lib/brand";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const spark = useRef<HTMLDivElement>(null);
  const line1 = useRef<HTMLSpanElement>(null);
  const line2 = useRef<HTMLSpanElement>(null);
  const sub = useRef<HTMLParagraphElement>(null);
  const cta = useRef<HTMLDivElement>(null);
  const people = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        spark.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.3, ease: "power2.out" }
      )
        .from(line1.current, { opacity: 0, y: 26, duration: 0.9 }, "-=0.45")
        .from(line2.current, { opacity: 0, y: 26, duration: 0.9 }, "+=0.3")
        .from(people.current, { opacity: 0, duration: 1.4 }, "-=0.7")
        .from(sub.current, { opacity: 0, y: 18, duration: 0.8 }, "-=0.9")
        .from(cta.current, { opacity: 0, y: 18, duration: 0.7 }, "-=0.5");
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative isolate overflow-hidden bg-[#05070d] text-white"
    >
      {/* Cinematic light: the spark that expands */}
      <div
        ref={spark}
        aria-hidden
        className="absolute left-1/2 top-1/2 -z-10 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,224,160,0.55) 0%, rgba(10,143,224,0.18) 40%, transparent 70%)",
          filter: "blur(24px)",
        }}
      />

      {/* Community silhouettes — fade in as the light spreads */}
      <div ref={people} aria-hidden className="absolute inset-x-0 bottom-0 -z-10 opacity-0">
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <svg
          viewBox="0 0 1200 200"
          preserveAspectRatio="xMidYMax meet"
          className="absolute inset-x-0 bottom-0 h-40 w-full text-white/10"
        >
          <g fill="currentColor">
            <circle cx="180" cy="120" r="26" />
            <rect x="154" y="146" width="52" height="60" rx="20" />
            <circle cx="320" cy="110" r="30" />
            <rect x="290" y="140" width="60" height="66" rx="22" />
            <circle cx="470" cy="128" r="24" />
            <rect x="446" y="152" width="48" height="56" rx="18" />
            <circle cx="610" cy="104" r="34" />
            <rect x="576" y="138" width="68" height="70" rx="24" />
            <circle cx="770" cy="126" r="25" />
            <rect x="745" y="151" width="50" height="58" rx="19" />
            <circle cx="920" cy="112" r="29" />
            <rect x="891" y="141" width="58" height="64" rx="21" />
            <circle cx="1060" cy="122" r="27" />
            <rect x="1033" y="149" width="54" height="60" rx="20" />
          </g>
        </svg>
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-28 text-center sm:px-6 sm:py-36 lg:px-8 lg:py-44">
        <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
          <span
            ref={line1}
            className="block bg-gradient-to-b from-white to-amber-100/80 bg-clip-text text-transparent"
          >
            Be the Light.
          </span>
          <span ref={line2} className="mt-2 block text-slu-blue-light">
            Be the Salt.
          </span>
        </h1>

        <p ref={sub} className="mx-auto mt-8 max-w-xl text-lg text-white/75">
          {brand.name} is a Christ-centered community of students and young
          people in {brand.city}. We encounter Christ, grow together, and shine
          His light in our schools and streets.
        </p>

        <div
          ref={cta}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <Link
            href="/groups"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-semibold text-slu-blue transition-all hover:bg-amber-100 hover:shadow-[0_0_30px_rgba(255,221,150,0.5)]"
          >
            Join Us
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-7 py-3 text-sm font-semibold text-white transition-all hover:border-white hover:bg-white/10"
          >
            Learn More
          </Link>
        </div>
      </div>

      {/* Scroll cue — the light begins to travel */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-white/40">
        <span className="block h-9 w-5 rounded-full border-2 border-white/40">
          <span className="mx-auto mt-1.5 block h-1.5 w-1.5 rounded-full bg-white/60" />
        </span>
      </div>
    </section>
  );
}
