"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** vertical offset in px */
  y?: number;
  /** delay before the reveal starts (s) */
  delay?: number;
  /** when true, direct children are revealed with a stagger */
  stagger?: boolean;
  /** start position for ScrollTrigger, e.g. "top 85%" */
  start?: string;
};

export function Reveal({
  children,
  className,
  y = 16,
  delay = 0,
  stagger = false,
  start = "top 85%",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const targets = stagger ? Array.from(el.children) : el;
      gsap.from(targets, {
        opacity: 0,
        y,
        duration: 0.7,
        delay,
        ease: "power2.out",
        stagger: stagger ? 0.12 : 0,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none reverse",
        },
      });
    }, el);

    return () => ctx.revert();
  }, [y, delay, stagger, start]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
