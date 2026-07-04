"use client";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";

const PATHS = {
  // knotted mess (case openings)
  tangle:
    "M 20 20 C 180 -20, 40 180, 200 140 C 340 105, 180 260, 60 220 C -40 185, 150 340, 260 300 C 350 268, 240 420, 120 380 C 40 353, 160 480, 240 460",
  // calm resolving curve (resolutions)
  smooth: "M 20 20 C 120 140, 60 280, 160 380 S 200 560, 240 640",
} as const;

export function ThreadSegment({
  variant = "smooth",
  d,
  viewBox = "0 0 280 660",
  className = "",
  stroke = "var(--glow-a)",
}: {
  variant?: keyof typeof PATHS;
  d?: string;
  viewBox?: string;
  className?: string;
  stroke?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.4"],
  });
  const pathLength = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

  return (
    <div ref={ref} aria-hidden className={`pointer-events-none ${className}`}>
      {/* overflow-visible: thread paths intentionally stray past the viewBox
          (tangle especially); the wrapper is decorative + pointer-events-none,
          so letting strokes bleed reads better than hard clipping. */}
      <svg viewBox={viewBox} fill="none" className="h-full w-full overflow-visible">
        <motion.path
          d={d ?? PATHS[variant]}
          stroke={stroke}
          strokeWidth={1.5}
          strokeLinecap="round"
          style={{ pathLength: reduce ? 1 : pathLength }}
        />
      </svg>
    </div>
  );
}
