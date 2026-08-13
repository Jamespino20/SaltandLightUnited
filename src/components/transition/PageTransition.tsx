"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const animating = useRef(false);

  // Keep the wave panel parked below the viewport when idle.
  useEffect(() => {
    const el = overlayRef.current;
    if (el) gsap.set(el, { yPercent: 100 });
  }, []);

  function onClickCapture(e: React.MouseEvent) {
    if (animating.current) {
      e.preventDefault();
      return;
    }
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;

    const anchor = (e.target as HTMLElement).closest("a");
    if (!anchor) return;

    const href = anchor.getAttribute("href");
    if (!href) return;
    if (
      anchor.target === "_blank" ||
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("#")
    ) {
      return;
    }

    let url: URL;
    try {
      url = new URL(href, window.location.href);
    } catch {
      return;
    }
    if (url.origin !== window.location.origin) return;

    const target = url.pathname + url.search + url.hash;
    if (target === pathname) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    e.preventDefault();
    flood(target);
  }

  function flood(path: string) {
    const el = overlayRef.current;
    if (!el) {
      router.push(path);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push(path);
      window.scrollTo(0, 0);
      return;
    }

    animating.current = true;
    el.style.pointerEvents = "auto";
    gsap.set(el, { yPercent: 100 });

    const tl = gsap.timeline({
      onComplete: () => {
        animating.current = false;
        el.style.pointerEvents = "none";
      },
    });

    tl.to(el, { yPercent: 0, duration: 0.55, ease: "power2.in" })
      .add(() => {
        router.push(path);
        window.scrollTo(0, 0);
      })
      .to(el, { yPercent: -100, duration: 0.6, ease: "power2.out", delay: 0.08 });
  }

  return (
    <div onClickCapture={onClickCapture}>
      {children}

      {/* Wave flood overlay — sits above everything (incl. the fixed header) */}
      <div
        ref={overlayRef}
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[120] h-screen"
        style={{ transform: "translateY(100%)" }}
      >
        {/* Solid flood body */}
        <div className="absolute inset-0 bg-slu-blue" />
        {/* Back crest (lighter, offset) */}
        <svg
          className="absolute left-0 top-0 w-full text-slu-blue-light"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          style={{ height: "110px", transform: "translateY(-104px)" }}
          fill="currentColor"
        >
          <path d="M0,30 C260,100 460,0 720,55 C980,110 1180,10 1440,70 L1440,120 L0,120 Z" />
        </svg>
        {/* Front crest */}
        <svg
          className="absolute left-0 top-0 w-full text-slu-blue"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          style={{ height: "90px", transform: "translateY(-84px)" }}
          fill="currentColor"
        >
          <path d="M0,50 C240,110 480,0 720,60 C960,120 1200,20 1440,80 L1440,120 L0,120 Z" />
        </svg>
      </div>
    </div>
  );
}
