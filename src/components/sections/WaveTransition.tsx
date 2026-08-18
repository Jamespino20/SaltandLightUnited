"use client";

import { useId } from "react";

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

const WAVE_PATH =
  "M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z";

export function WaveTransition({
  from,
  to,
  className = "",
}: WaveTransitionProps) {
  const waveId = useId();
  const fromColor = COLORS[from];
  const toColor = COLORS[to];

  return (
    <div
      className={`relative ${className}`}
      style={{ marginTop: "-1px", marginBottom: "-1px" }}
      aria-hidden
    >
      <svg
        className="slu-wave block w-full"
        style={{ height: "clamp(50px, 8vh, 90px)" }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        shape-rendering="auto"
      >
        <defs>
          <path id={waveId} d={WAVE_PATH} />
        </defs>

        {/* Background: fromColor — matches the section above */}
        <rect x="-160" y="24" width="1200" height="80" fill={fromColor} />

        <g className="parallax">
          <use href={`#${waveId}`} x="48" y="0" fill={toColor} opacity="0.7" />
          <use href={`#${waveId}`} x="48" y="3" fill={toColor} opacity="0.5" />
          <use href={`#${waveId}`} x="48" y="5" fill={toColor} opacity="0.3" />
          <use href={`#${waveId}`} x="48" y="7" fill={toColor} />
        </g>
      </svg>
    </div>
  );
}
