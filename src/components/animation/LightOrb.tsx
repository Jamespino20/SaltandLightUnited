"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * The recurring "light" motif: a single warm glow that travels down the
 * viewport as the visitor scrolls — Christ's light spreading through the page.
 * Purely decorative; hidden from assistive tech and disabled under reduced motion.
 */
export function LightOrb() {
  const orb = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = orb.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: "-12vh" },
        {
          y: "112vh",
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={orb}
      aria-hidden
      className="pointer-events-none fixed left-1/2 top-0 z-40 -translate-x-1/2 h-[42vh] w-[42vh] rounded-full"
      style={{
        background:
          "radial-gradient(circle, rgba(255,221,150,0.30) 0%, rgba(7,112,189,0.10) 42%, transparent 70%)",
        filter: "blur(36px)",
        mixBlendMode: "screen",
      }}
    />
  );
}
