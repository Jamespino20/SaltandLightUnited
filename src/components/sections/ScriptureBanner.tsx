"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal } from "@/components/animation/Reveal";

gsap.registerPlugin(ScrollTrigger);

const verses = [
  {
    title: "Bible Verses",
    passages: [
      {
        text: '"For you created my inmost being; you knit me together in my mother\'s womb. I praise you because I am fearfully and wonderfully made; your works are wonderful, I know that full well."',
        ref: "Psalm 139:13-14",
      },
      {
        text: '"So God created man in His own image, in the image of God he created him; male and female he created them."',
        ref: "Genesis 1:27",
      },
      {
        text: '"Before I formed you in your mother\'s body I chose you. Before you were born I set you apart to serve me. I appointed you to be a prophet to the nations."',
        ref: "Jeremiah 1:5",
      },
    ],
  },
  {
    title: "Bible Verses",
    passages: [
      {
        text: '"Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight."',
        ref: "Proverbs 3:5-6",
      },
      {
        text: '"I can do all things through Christ who strengthens me."',
        ref: "Philippians 4:13",
      },
      {
        text: '"Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go."',
        ref: "Joshua 1:9",
      },
    ],
  },
  {
    title: "Bible Verses",
    passages: [
      {
        text: '"For I know the plans I have for you," declares the LORD, "plans to prosper you and not to harm you, plans to give you hope and a future."',
        ref: "Jeremiah 29:11",
      },
      {
        text: '"The LORD is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul."',
        ref: "Psalm 23:1-3",
      },
      {
        text: '"Come to me, all you who are weary and burdened, and I will give you rest."',
        ref: "Matthew 11:28",
      },
    ],
  },
];

export function ScriptureBanner() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cards = el.querySelectorAll(".scripture-card");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
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

      <div className="mx-auto mt-12 grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
        {verses.map((card, i) => (
          <div
            key={i}
            className="scripture-card rounded-2xl border border-slu-gray-200 bg-[#E8E4D8] p-6 opacity-0 sm:p-8"
          >
            <h3 className="mb-4 text-center text-lg font-bold text-[#5A7A6A]">
              {card.title}
            </h3>
            <div className="space-y-4">
              {card.passages.map((passage, j) => (
                <div key={j}>
                  <p className="text-sm italic leading-relaxed text-slu-gray-700">
                    {passage.text}
                  </p>
                  <p className="mt-1 text-center text-sm font-bold text-slu-blue">
                    {passage.ref}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
