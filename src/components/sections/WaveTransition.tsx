"use client";

interface WaveTransitionProps {
  from: "dark" | "light";
  to: "dark" | "light";
  className?: string;
}

const COLORS = {
  dark: "#0A0A0A",
  light: "#F0F0F0",
} as const;

export function WaveTransition({ to, className = "" }: WaveTransitionProps) {
  const fill = COLORS[to];

  return (
    <div className={`relative -mt-px ${className}`} aria-hidden>
      <svg
        className="slu-wave block h-16 w-full sm:h-24"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        shapeRendering="auto"
      >
        <defs>
          <path
            id="gentle-wave"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          />
        </defs>
        <g className="parallax">
          <use href="#gentle-wave" x="48" y="0" fill={fill} fillOpacity="0.7" />
          <use href="#gentle-wave" x="48" y="3" fill={fill} fillOpacity="0.5" />
          <use href="#gentle-wave" x="48" y="5" fill={fill} fillOpacity="0.3" />
          <use href="#gentle-wave" x="48" y="7" fill={fill} />
        </g>
      </svg>
    </div>
  );
}
