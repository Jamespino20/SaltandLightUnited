"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { CaretLeft, CaretRight, Pause, Play } from "@phosphor-icons/react";

interface Slide {
  id: string;
  label: string;
  caption: string;
  image: string;
}

const fallbackSlides: Slide[] = [
  { id: "1", label: "Teen Nights", caption: "Ages 13–17 · Hanging out and growing together", image: "/images/history/first_pic.jpg" },
  { id: "2", label: "Tween Hangout", caption: "Ages 10–12 · Games, faith, and friendships", image: "/images/history/second_pic.jpg" },
  { id: "3", label: "Jam Sessions", caption: "Music, songs, and creative worship", image: "/images/history/third_pic.jpg" },
  { id: "4", label: "Real Talk", caption: "Deep conversations about faith and life", image: "/images/history/fourth_pic.webp" },
  { id: "5", label: "Street Team", caption: "Serving the community together", image: "/images/history/fifth_pic.jpg" },
];

function wrapOffset(index: number, current: number, total: number) {
  let offset = index - current;
  if (offset > total / 2) offset -= total;
  if (offset < -total / 2) offset += total;
  return offset;
}

function useViewportWidth() {
  const [vw, setVw] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return vw;
}

export function SmallGroupsPreview() {
  const [slides, setSlides] = useState<Slide[]>(fallbackSlides);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStart = useRef<number | null>(null);
  const vw = useViewportWidth();

  const isMobile = vw < 640;
  const isTablet = vw >= 640 && vw < 768;

  const cardWidthPct = isMobile ? 70 : isTablet ? 80 : 85;
  const translateXUnit = isMobile ? 14 : isTablet ? 18 : 22;
  const rotateUnit = isMobile ? 5 : 7;
  const scaleUnit = isMobile ? 0.06 : 0.08;
  const cardHeight = isMobile ? 190 : isTablet ? 280 : 340;
  const perspective = isMobile ? "1200px" : "1400px";

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data?.carouselSlides) {
          const raw = res.data.carouselSlides;
          const parsed: Slide[] = Array.isArray(raw)
            ? raw
            : typeof raw === "string"
              ? (() => { try { return JSON.parse(raw); } catch { return fallbackSlides; } })()
              : fallbackSlides;
          if (parsed.length > 0) setSlides(parsed);
        }
      })
      .catch(() => {});
  }, []);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, [slides.length]);

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
      className="relative bg-[#F0F0F0] py-12 sm:py-20 md:py-24"
      style={{ overflow: "clip" }}
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
        <h2 className="mb-6 text-center text-xl font-bold text-slu-black sm:mb-10 sm:text-3xl md:text-4xl lg:text-5xl">
          Want to see us wave?{" "}
          <span className="text-slu-blue">
            Here&apos;s the Salt and Lampers for you.
          </span>
        </h2>

        {/* Carousel with outer arrows */}
        <div className="relative" style={{ overflow: "clip" }}>
          {/* Arrows */}
          <button
            type="button"
            onClick={prev}
            className="absolute left-0 top-[100px] z-[60] rounded-full bg-white p-2 text-slu-gray-600 shadow-lg transition-all hover:bg-slu-blue hover:text-white sm:left-0 sm:top-[160px] sm:p-3 md:top-[180px] md:p-4"
            aria-label="Previous slide"
          >
            <CaretLeft size={20} className="sm:hidden" />
            <CaretLeft size={24} className="hidden sm:block" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-0 top-[100px] z-[60] rounded-full bg-white p-2 text-slu-gray-600 shadow-lg transition-all hover:bg-slu-blue hover:text-white sm:right-0 sm:top-[160px] sm:p-3 md:top-[180px] md:p-4"
            aria-label="Next slide"
          >
            <CaretRight size={20} className="sm:hidden" />
            <CaretRight size={24} className="hidden sm:block" />
          </button>

          {/* Card-fan carousel */}
          <div
            className="relative mx-auto max-w-3xl"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            style={{ perspective }}
          >
            <div className={`relative ${isMobile ? "h-[200px]" : isTablet ? "h-[290px]" : "h-[350px]"}`}>
              {slides.map((slide, i) => {
                const offset = wrapOffset(i, current, slides.length);
                const abs = Math.abs(offset);
                const translateX = offset * translateXUnit;
                const rotate = offset * rotateUnit;
                const scale = 1 - abs * scaleUnit;
                const zIndex = 50 - abs * 10;

                return (
                  <div
                    key={slide.id}
                    className="absolute top-1/2 -translate-y-1/2 rounded-2xl shadow-xl transition-all duration-500 ease-out"
                    style={{
                      width: `${cardWidthPct}%`,
                      left: "50%",
                      transform: `translate(calc(-50% + ${translateX}%), -50%) rotate(${rotate}deg) scale(${scale})`,
                      zIndex,
                      opacity: abs <= (isMobile ? 2 : 3) ? 1 : 0,
                      pointerEvents: abs <= (isMobile ? 2 : 3) ? "auto" : "none",
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
                      <div className="absolute bottom-0 left-0 p-2 sm:p-4 md:p-5">
                        <span className="inline-block rounded-full bg-slu-blue px-2 py-0.5 text-[10px] font-semibold text-white sm:px-3 sm:py-1 sm:text-xs">
                          {slide.label}
                        </span>
                        <p className="mt-1 text-[10px] text-white/85 sm:mt-2 sm:text-sm">
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
            className="absolute right-2 top-2 z-[60] rounded-full bg-white/90 p-1.5 text-slu-gray-600 shadow-md transition-colors hover:bg-white sm:right-4 sm:top-4 sm:p-2"
            aria-label={paused ? "Resume autoplay" : "Pause autoplay"}
          >
            {paused ? <Play size={14} /> : <Pause size={14} />}
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
