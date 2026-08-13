"use client";

interface WaveTransitionProps {
  from: "dark" | "light" | "blue";
  to: "dark" | "light" | "blue";
  className?: string;
}

const COLORS = {
  dark: "#0A0A0A",
  light: "#F0F0F0",
  blue: "#0770BD",
} as const;

// Wide, tileable wave so the parallax drift never reveals a gap.
const WAVE =
  "M-200,42 C40,92 280,2 520,46 C760,92 1000,2 1240,46 C1400,76 1520,22 1640,46 L1640,120 L-200,120 Z";

export function WaveTransition({ from, to, className = "" }: WaveTransitionProps) {
  const fromColor = COLORS[from];
  const toColor = COLORS[to];

  return (
    <div className={`relative -mt-px ${className}`} aria-hidden>
      <svg
        className="slu-wave block h-20 w-full sm:h-28"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        shapeRendering="auto"
      >
        <g className="parallax">
          <path d={WAVE} fill={fromColor} fillOpacity="0.35" />
          <path d={WAVE} fill={fromColor} fillOpacity="0.55" transform="translate(0,8)" />
          <path d={WAVE} fill={toColor} fillOpacity="0.75" transform="translate(0,16)" />
          <path d={WAVE} fill={toColor} transform="translate(0,24)" />
        </g>
      </svg>
    </div>
  );
}

