"use client";

interface WaveTransitionProps {
  from: "dark" | "light";
  to: "dark" | "light";
  className?: string;
}

export function WaveTransition({ from, to, className = "" }: WaveTransitionProps) {
  if (from === "dark" && to === "light") {
    return (
      <div className={`relative -mt-px ${className}`} aria-hidden>
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="block h-16 w-full sm:h-24"
        >
          <path
            d="M0,0 C240,100 480,0 720,60 C960,120 1200,20 1440,80 L1440,120 L0,120 Z"
            fill="#F0F0F0"
          />
          <path
            d="M0,40 C300,110 600,10 900,70 C1100,110 1300,30 1440,60 L1440,120 L0,120 Z"
            fill="#0770BD"
            opacity="0.15"
          />
        </svg>
      </div>
    );
  }

  if (from === "light" && to === "dark") {
    return (
      <div className={`relative -mt-px ${className}`} aria-hidden>
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="block h-16 w-full sm:h-24"
        >
          <path
            d="M0,120 C240,20 480,120 720,60 C960,0 1200,100 1440,40 L1440,0 L0,0 Z"
            fill="#0A0A0A"
          />
          <path
            d="M0,120 C300,50 600,110 900,50 C1100,10 1300,90 1440,60 L1440,0 L0,0 Z"
            fill="#0770BD"
            opacity="0.2"
          />
        </svg>
      </div>
    );
  }

  return null;
}
