"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { CaretLeft, CaretRight, Pause, Play } from "@phosphor-icons/react";
import { Reveal } from "@/components/animation/Reveal";

const slides = [
  {
    id: "1",
    label: "Teen Nights",
    caption: "Ages 13–17 · Hanging out and growing together",
    image: "/images/history/first_pic.jpg",
  },
  {
    id: "2",
    label: "Tween Hangout",
    caption: "Ages 10–12 · Games, faith, and friendships",
    image: "/images/history/second_pic.jpg",
  },
  {
    id: "3",
    label: "Jam Sessions",
    caption: "Music, songs, and creative worship",
    image: "/images/history/third_pic.jpg",
  },
  {
    id: "4",
    label: "Real Talk",
    caption: "Deep conversations about faith and life",
    image: "/images/history/fourth_pic.webp",
  },
  {
    id: "5",
    label: "Street Team",
    caption: "Serving the community together",
    image: "/images/history/fifth_pic.jpg",
  },
];

function wrapOffset(index: number, current: number, total: number) {
  let offset = index - current;
  const half = Math.floor(total / 2);
  if (offset > half) offset -= total;
  if (offset < -half) offset += total;
  return offset;
}

export function SmallGroupsPreview() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStart = useRef<number | null>(null);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(next, 4500);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, next]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
    touchStart.current = null;
  };

  return (
    <section
      id="groups"
      className="relative overflow-hidden bg-[#F0F0F0] py-16 sm:py-24"
    >
      {/* Decorative waves */}
      <div className="absolute bottom-0 left-0 right-0 -z-10" aria-hidden>
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="block h-16 w-full sm:h-24"
        >
          <path
            d="M0,80 C180,120 360,40 540,80 C720,120 900,40 1080,80 C1260,120 1440,60 1440,80 L1440,120 L0,120 Z"
            fill="#0770BD"
            opacity="0.25"
          />
          <path
            d="M0,90 C240,50 480,110 720,70 C960,30 1200,90 1440,60 L1440,120 L0,120 Z"
            fill="#0770BD"
            opacity="0.15"
          />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-6 text-center sm:mb-10">
          <h2 className="text-2xl font-bold text-slu-black sm:text-3xl md:text-4xl lg:text-5xl">
            Want to see us wave?{" "}
            <span className="text-slu-blue">
              Here&apos;s the Salt and Lighters for you.
            </span>
          </h2>
        </Reveal>

        {/* Carousel with outer arrows */}
        <div className="relative">
          {/* Arrows at outer edges of the section */}
          <button
            type="button"
            onClick={prev}
            className="absolute -left-1 top-[120px] z-[60] rounded-full bg-white p-2 text-slu-gray-600 shadow-lg transition-all hover:bg-slu-blue hover:text-white sm:-left-2 sm:top-[180px] sm:p-3 md:top-[200px] md:p-4"
            aria-label="Previous slide"
          >
            <CaretLeft size={20} className="sm:hidden" />
            <CaretLeft size={24} className="hidden sm:block" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute -right-1 top-[120px] z-[60] rounded-full bg-white p-2 text-slu-gray-600 shadow-lg transition-all hover:bg-slu-blue hover:text-white sm:-right-2 sm:top-[180px] sm:p-3 md:top-[200px] md:p-4"
            aria-label="Next slide"
          >
            <CaretRight size={20} className="sm:hidden" />
            <CaretRight size={24} className="hidden sm:block" />
          </button>

          {/* Card-fan carousel */}
          <div
            className="relative mx-auto mt-12 max-w-3xl sm:mt-20 md:mt-24"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            style={{ perspective: "1400px" }}
          >
            <div className="relative h-[220px] sm:h-[300px] md:h-[360px]">
              {slides.map((slide, i) => {
                const offset = wrapOffset(i, current, slides.length);
                const abs = Math.abs(offset);
                const visible = abs <= 2;
                const translateX = offset * 46;
                const rotate = offset * 9;
                const scale = 1 - abs * 0.08;
                const zIndex = 50 - abs * 10;

                return (
                  <div
                    key={slide.id}
                    className="absolute top-1/2 w-[90%] max-w-md -translate-y-1/2 rounded-2xl shadow-xl transition-all duration-500 ease-out sm:w-[85%]"
                    style={{
                      left: "50%",
                      transform: `translate(calc(-50% + ${translateX}%), -50%) rotate(${rotate}deg) scale(${scale})`,
                      zIndex,
                      opacity: visible ? 1 : 0,
                      pointerEvents: visible ? "auto" : "none",
                    }}
                  >
                    <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-slu-gray-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={slide.image}
                        alt={slide.label}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-3 sm:p-4 md:p-5">
                        <span className="inline-block rounded-full bg-slu-blue px-2 py-0.5 text-[10px] font-semibold text-white sm:px-3 sm:py-1 sm:text-xs">
                          {slide.label}
                        </span>
                        <p className="mt-1 text-xs text-white/85 sm:mt-2 sm:text-sm">
                          {slide.caption}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pause/Play */}
          <button
            type="button"
            onClick={() => setPaused(!paused)}
            className="absolute right-0 top-0 z-[60] rounded-full bg-white/90 p-2 text-slu-gray-600 shadow-md transition-colors hover:bg-white"
            aria-label={paused ? "Resume autoplay" : "Pause autoplay"}
          >
            {paused ? <Play size={16} /> : <Pause size={16} />}
          </button>
        </div>

        {/* Dots */}
        <div className="mt-4 flex justify-center gap-1 sm:mt-6 sm:gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${
                i === current ? "w-6 bg-slu-blue" : "w-2 bg-slu-blue/30"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
