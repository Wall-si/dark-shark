"use client";

import { useReducedMotion } from "framer-motion";

function pathFrom(series: number[], width: number, height: number) {
  const max = Math.max(...series);
  const min = Math.min(...series);
  const span = Math.max(1, max - min);
  return series
    .map((value, index) => {
      const x = (index / (series.length - 1)) * width;
      const y = height - 16 - ((value - min) / span) * (height - 32);
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

export function ActivityChart({
  primary,
  secondary,
  tone = "blood",
}: {
  primary: number[];
  secondary?: number[];
  tone?: "blood" | "void";
}) {
  const reduce = useReducedMotion();
  const width = 640;
  const height = 180;
  const primaryPath = pathFrom(primary, width, height);
  const secondaryPath = secondary ? pathFrom(secondary, width, height) : null;
  const stroke = tone === "blood" ? "#ff253a" : "#080808";
  const mute = tone === "blood" ? "rgba(244,241,234,0.45)" : "rgba(8,8,8,0.45)";
  const grid = tone === "blood" ? "rgba(244,241,234,0.15)" : "rgba(8,8,8,0.2)";

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" role="img" aria-label="Market activity over the last cycle">
      {[0, 1, 2, 3].map((row) => (
        <line
          key={row}
          x1="0"
          x2={width}
          y1={20 + row * 40}
          y2={20 + row * 40}
          stroke={grid}
        />
      ))}
      {secondaryPath && (
        <path d={secondaryPath} fill="none" stroke={mute} strokeWidth="1.5" />
      )}
      <path
        d={primaryPath}
        fill="none"
        stroke={stroke}
        strokeWidth="2.25"
        style={
          reduce
            ? undefined
            : {
                strokeDasharray: 1600,
                strokeDashoffset: 1600,
                animation: "draw 1.8s ease forwards",
              }
        }
      />
      <style>{`@keyframes draw { to { stroke-dashoffset: 0; } }`}</style>
    </svg>
  );
}
