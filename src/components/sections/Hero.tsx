"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useTranslations } from "next-intl";

export function Hero() {
  const t = useTranslations("home.hero");
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
      className="relative isolate flex min-h-[80svh] flex-col items-center justify-center overflow-hidden bg-transparent text-center sm:min-h-[100svh]"
    >
      {/* Intense blue atmospheric glow — the moving backdrop */}
      <div
        aria-hidden
        className="slu-hero-glow absolute left-1/2 top-1/2 -z-20 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-[75vmin] sm:w-[75vmin] md:h-[92vmin] md:w-[92vmin]"
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
        <span className="text-white">{t("title1")} </span>
        <span className="text-slu-blue-light">{t("title2")}</span>
      </h1>

      {/* Supporting copy */}
      <p
        ref={sub}
        className="relative z-10 mx-auto mt-6 max-w-xl px-4 text-base leading-relaxed text-white/70 sm:text-lg"
      >
        {t("subtitle")}
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
