"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal } from "@/components/animation/Reveal";

gsap.registerPlugin(ScrollTrigger);

const verses = [
  {
    text: '"You are the light of the world. A town built on a hill cannot be hidden. In the same way, let your light shine before others, that they may see your good deeds and glorify your Father in heaven."',
    ref: "Matthew 5:14, 16",
  },
  {
    text: '"Your word is a lamp to my feet and a light to my path. I have sworn an oath and confirmed it, to observe your righteous rules."',
    ref: "Psalm 119:105",
  },
  {
    text: '"You are the salt of the earth. But if the salt loses its saltiness, how can it be made salty again? It is no longer good for anything, except to be thrown out and trampled underfoot."',
    ref: "Matthew 5:13",
  },
];

export function ScriptureBanner() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cards = el.querySelectorAll<HTMLElement>(".scripture-card");

    const ctx = gsap.context(() => {
      if (!cards.length) return;
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 65%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="scripture"
      className="relative isolate overflow-hidden bg-[#0A0A0A] py-24 sm:py-32"
    >
      <Reveal className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          A little reminder for you to{" "}
          <span className="text-slu-blue-light">read your Bible today.</span>
        </h2>
      </Reveal>

      <div className="mx-auto mt-12 grid max-w-5xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
        {verses.map((verse, i) => (
          <div
            key={i}
            className="scripture-card rounded-2xl border border-slu-gray-200 bg-[#E8E4D8] p-8 shadow-lg"
          >
            <p className="text-center text-base italic leading-relaxed text-slu-gray-700">
              {verse.text}
            </p>
            <p className="mt-4 text-center text-sm font-bold text-slu-blue">
              {verse.ref}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
