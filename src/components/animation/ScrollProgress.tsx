"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Reset bar immediately
    gsap.set(el, { scaleX: 0 });

    // Delay to let Lenis + new page content settle
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();

      const ctx = gsap.context(() => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            transformOrigin: "left center",
            scrollTrigger: {
              trigger: document.documentElement,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.3,
              invalidateOnRefresh: true,
            },
          }
        );
      });

      // Extra refresh after animations settle
      const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 800);

      return () => {
        ctx.revert();
        clearTimeout(refreshTimer);
      };
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      aria-hidden
      className="fixed left-0 top-0 z-50 h-[3px] w-full bg-transparent"
    >
      <div
        ref={bar}
        className="h-full w-full origin-left bg-gradient-to-r from-slu-blue-light via-amber-200 to-slu-blue"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
