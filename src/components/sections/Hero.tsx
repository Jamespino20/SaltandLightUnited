"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const gradient = useRef<HTMLDivElement>(null);
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
        gradient.current,
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 1, duration: 2.0, ease: "power2.out" }
      )
        .fromTo(
          emblem.current,
          { scale: 0.7, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.6, ease: "power2.out" },
          "-=1.6"
        )
        .fromTo(
          heading.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.0 },
          "-=0.8"
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
      {/* Decorative gradients for attractiveness */}
      <div
        ref={gradient}
        aria-hidden
        className="absolute left-1/2 top-1/2 -z-20 h-[90vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
        style={{
          background:
            "radial-gradient(circle at 25% 25%, rgba(7,112,189,0.6) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,224,160,0.4) 0%, transparent 50%), conic-gradient(from 180deg at 50% 50%, #0A0A0A, #0770BD, #F0F0F0, #0770BD, #0A0A0A)",
          filter: "blur(60px) brightness(0.8)",
          animation: "pulse 8s ease-in-out infinite",
        }}
      />

      {/* Blue-white emblem glow — the centrepiece backdrop */}
      <div
        ref={emblem}
        aria-hidden
        className="absolute left-1/2 top-1/2 -z-10 h-[42vmin] w-[42vmin] -translate-x-1/2 -translate-y-1/2 opacity-0"
      >
        <div className="absolute inset-0 rounded-full bg-slu-blue/30 blur-3xl" />
        <img
          src="/images/SaltandLightBlueWhite.svg"
          alt=""
          className="relative h-full w-full object-contain drop-shadow-[0_0_45px_rgba(7,112,189,0.65)]"
        />
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }
      `}</style>

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
