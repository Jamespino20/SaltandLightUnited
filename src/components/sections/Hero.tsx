"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const sub = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        heading.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.0 }
      )
        .fromTo(
          sub.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.9 },
          "-=0.4"
        );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="hero"
      className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-transparent text-center"
    >
      {/* Intense blue atmospheric glow — the moving backdrop */}
      <div
        aria-hidden
        className="slu-hero-glow absolute left-1/2 top-1/2 -z-20 h-[92vmin] w-[92vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(93,255,255,0.58) 0%, rgba(0,205,255,0.5) 18%, rgba(7,112,189,0.42) 42%, rgba(0,95,170,0.18) 62%, transparent 80%)",
          filter: "blur(34px)",
        }}
      />

      {/* Headline */}
      <h1
        ref={heading}
        className="relative z-10 text-4xl font-bold leading-tight tracking-tight opacity-0 sm:text-5xl lg:text-6xl"
      >
        <span className="text-white">Be the Salt. </span>
        <span className="text-slu-blue-light">Be the Light.</span>
      </h1>

      {/* Supporting copy */}
      <p
        ref={sub}
        className="relative z-10 mx-auto mt-6 max-w-xl px-4 text-base leading-relaxed text-white/70 sm:text-lg"
      >
        Salt and Light United is a Christ-centered community of students and
        young people in Baliwag City, Bulacan, Philippines. We encounter Christ,
        grow together, and shine His light in our schools and streets.
      </p>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/30">
        <span className="block h-9 w-5 rounded-full border-2 border-white/30">
          <span className="mx-auto mt-1.5 block h-1.5 w-1.5 rounded-full bg-white/50" />
        </span>
      </div>
    </section>
  );
}
