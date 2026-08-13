"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const emblem = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const sub = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        glow.current,
        { scale: 0.3, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.8, ease: "power2.out" }
      )
        .fromTo(
          emblem.current,
          { scale: 0.5, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.2, ease: "back.out(1.4)" },
          "-=1.0"
        )
        .fromTo(
          heading.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.0 },
          "-=0.5"
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
      className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-[#0A0A0A] text-center"
    >
      {/* Blue atmospheric glow */}
      <div
        ref={glow}
        aria-hidden
        className="absolute left-1/2 top-1/2 -z-10 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
        style={{
          background:
            "radial-gradient(circle, rgba(7,112,189,0.45) 0%, rgba(0,180,255,0.25) 30%, rgba(0,200,255,0.08) 55%, transparent 75%)",
          filter: "blur(40px)",
        }}
      />

      {/* SLU pill logo */}
      <div
        ref={emblem}
        className="relative mb-8 w-36 flex-shrink-0 opacity-0 sm:w-44"
      >
        <img
          src="/images/SaltandLightBlueWhite.svg"
          alt="Salt and Light United"
          className="h-full w-full object-contain"
        />
      </div>

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
