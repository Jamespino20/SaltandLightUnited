"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal } from "@/components/animation/Reveal";
import { Sparkle } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

const staticVerses = [
  {
    text: '"Your word is a lamp to my feet and a light to my path. I have sworn an oath and confirmed it, to observe your righteous rules."',
    ref: "Psalm 119:105",
  },
  {
    text: '"You are the salt of the earth. But if the salt loses its saltiness, how can it be made salty again? It is no longer good for anything, except to be thrown out and trampled underfoot."',
    ref: "Matthew 5:13",
  },
];

interface VotdData {
  text: string;
  ref: string;
  loading: boolean;
  error: boolean;
}

export function ScriptureBanner() {
  const t = useTranslations("home.scripture");
  const root = useRef<HTMLElement>(null);
  const [votd, setVotd] = useState<VotdData>({
    text: "",
    ref: "",
    loading: true,
    error: false,
  });

  useEffect(() => {
    async function fetchVotd() {
      try {
        const { fetchVerseOfTheDay } = await import("@/lib/youversion");
        const result = await fetchVerseOfTheDay();
        if (!result) throw new Error("No VOTD");
        const cleanText = result.content
          .replace(/<[^>]*>/g, "")
          .replace(/\s+/g, " ")
          .trim();
        setVotd({
          text: `"${cleanText}"`,
          ref: result.reference,
          loading: false,
          error: false,
        });
      } catch {
        setVotd({
          text: '"For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future."',
          ref: "Jeremiah 29:11",
          loading: false,
          error: true,
        });
      }
    }

    fetchVotd();
  }, []);

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
  }, [votd]);

  const allVerses: Array<{ text: string; ref: string; isVotd: boolean }> = [];

  if (votd.text) {
    allVerses.push({ text: votd.text, ref: votd.ref, isVotd: true });
  }

  staticVerses.forEach((v) => {
    allVerses.push({ text: v.text, ref: v.ref, isVotd: false });
  });

  return (
    <section
      ref={root}
      id="scripture"
      className="relative isolate overflow-hidden bg-[#0A0A0A] py-24 sm:py-32"
    >
      <Reveal className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          {t("title")}
        </h2>
      </Reveal>

      <div className="mx-auto mt-12 grid max-w-5xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
        {allVerses.map((verse, i) => (
          <div
            key={i}
            className={`scripture-card rounded-2xl border p-8 shadow-lg transition-all hover:shadow-xl ${
              verse.isVotd
                ? "border-slu-blue/30 bg-gradient-to-br from-[#E8E4D8] to-[#D4E8F0]"
                : "border-slu-gray-200 bg-[#E8E4D8]"
            }`}
          >
            {verse.isVotd && (
              <div className="mb-3 flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slu-blue">
                <Sparkle size={12} weight="fill" />
                Verse of the Day
              </div>
            )}
            <p className="text-center text-base italic leading-relaxed text-slu-gray-700">
              {votd.loading && verse.isVotd ? (
                <span className="inline-block animate-pulse">Loading...</span>
              ) : (
                verse.text
              )}
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
