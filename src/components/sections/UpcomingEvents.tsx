"use client";

import Link from "next/link";
import { CalendarBlank } from "@phosphor-icons/react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal } from "@/components/animation/Reveal";

gsap.registerPlugin(ScrollTrigger);

const sampleEvents = [
  {
    id: "1",
    title: "Friday Fellowship Night",
    short: "FRI · 6 PM",
    date: "Every Friday, 6:00 PM",
    description: "Join us for worship, the Word, and fellowship every Friday evening.",
  },
  {
    id: "2",
    title: "Sunday Worship Service",
    short: "SUN · 9 AM",
    date: "Every Sunday, 9:00 AM",
    description: "Start your week with praise and worship at our Sunday service.",
  },
  {
    id: "3",
    title: "Youth Camp 2026",
    short: "DEC 15–18",
    date: "December 15–18, 2026",
    description: "Our annual youth camp — three days of spiritual growth and fun.",
  },
];

export function UpcomingEvents() {
  const rail = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top center",
          scrollTrigger: {
            trigger: el.parentElement,
            start: "top 70%",
            end: "bottom 80%",
            scrub: 0.5,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="bg-slu-offwhite py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-slu-black sm:text-4xl">
            We gather.
          </h2>
          <p className="mt-2 text-slu-gray-500">
            Every week, light meets light. Here&apos;s where we come together.
          </p>
        </Reveal>

        <div className="relative">
          {/* growing rail */}
          <div className="absolute bottom-0 left-[22px] top-2 w-0.5 -translate-x-1/2 bg-slu-gray-200 sm:left-1/2" />
          <div
            ref={rail}
            aria-hidden
            className="absolute bottom-0 left-[22px] top-2 w-0.5 -translate-x-1/2 bg-gradient-to-b from-slu-blue-light to-amber-200 sm:left-1/2"
            style={{ transform: "scaleY(0)" }}
          />

          <div className="space-y-10">
            {sampleEvents.map((event) => (
              <Reveal
                key={event.id}
                className="relative flex items-start gap-5 pl-14 sm:pl-0 sm:justify-center"
                y={20}
              >
                {/* node */}
                <span className="absolute left-[14px] top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 border-amber-200 bg-slu-blue shadow-[0_0_16px_rgba(255,221,150,0.6)] sm:static sm:mx-0" />
                <div className="w-full rounded-2xl border border-slu-gray-200 bg-white p-6 transition-all hover:shadow-md sm:w-[28rem]">
                  <div className="mb-2 font-mono text-xs font-semibold tracking-widest text-slu-blue">
                    {event.short}
                  </div>
                  <div className="mb-2 flex items-center gap-2 text-sm text-slu-gray-500">
                    <CalendarBlank size={16} />
                    {event.date}
                  </div>
                  <h3 className="text-lg font-bold text-slu-black">
                    {event.title}
                  </h3>
                  <p className="mt-2 text-sm text-slu-gray-500">
                    {event.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-10 text-center">
          <Link
            href="/events"
            className="inline-block rounded-xl bg-slu-blue px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-slu-blue-dark hover:shadow-lg"
          >
            View All Events
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
