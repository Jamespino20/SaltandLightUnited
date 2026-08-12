"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const verseLines = [
  "For God so loved the world",
  "that he gave his one and only Son,",
  "that whoever believes in him shall not perish but have eternal life.",
];

export function ScriptureBanner() {
  const root = useRef<HTMLElement>(null);
  const veil = useRef<HTMLDivElement>(null);
  const refLabel = useRef<HTMLDivElement>(null);
  const lines = useRef<HTMLDivElement>(null);
  const cite = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: el,
          start: "top 65%",
          toggleActions: "play none none reverse",
        },
      });
      tl.fromTo(veil.current, { opacity: 0 }, { opacity: 1, duration: 0.9 })
        .from(refLabel.current, { opacity: 0, y: 14, duration: 0.7 }, "-=0.3")
        .from(
          lines.current ? Array.from(lines.current.children) : [],
          { opacity: 0, y: 18, duration: 0.8, stagger: 0.35 },
          "-=0.2"
        )
        .from(cite.current, { opacity: 0, duration: 0.8 }, "-=0.3");
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative isolate overflow-hidden bg-[#05070d] py-24 text-center sm:py-32"
    >
      <div
        ref={veil}
        aria-hidden
        className="slu-scripture-veil absolute inset-0 -z-10"
        style={{ opacity: 0 }}
      />
      {/* ambient glow behind the verse */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 -z-10 h-[50vmin] w-[50vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,221,150,0.18), transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div
          ref={refLabel}
          className="mb-8 font-mono text-sm font-semibold tracking-[0.4em] text-amber-200/80"
        >
          JOHN 3:16
        </div>
        <div ref={lines} className="space-y-3">
          {verseLines.map((line, i) => (
            <p
              key={i}
              className="text-2xl font-light leading-relaxed text-white sm:text-3xl"
            >
              {line}
            </p>
          ))}
        </div>
        <cite
          ref={cite}
          className="mt-8 block text-base font-medium not-italic text-white/60"
        >
          — John 3:16
        </cite>
      </div>
    </section>
  );
}
