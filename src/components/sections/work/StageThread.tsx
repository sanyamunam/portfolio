"use client";
import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";

type Phase = "mess" | "turn" | "resolve";

/** Horizontal thread behind the stage: knotted in the mess, straight at resolve. */
export function StageThread({ phase }: { phase: Phase }) {
  const knotted = phase === "mess";
  return (
    <svg
      viewBox="0 0 1200 160"
      fill="none"
      aria-hidden
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 bottom-[18%] h-40 w-full overflow-visible opacity-70"
    >
      <motion.path
        d="M -20 80 C 200 80, 300 20, 420 90 C 500 135, 460 30, 560 60 C 660 90, 620 130, 720 80 C 840 20, 900 130, 1000 80 L 1220 80"
        stroke="var(--hf-orchid)"
        strokeWidth={1.5}
        strokeLinecap="round"
        initial={{ opacity: knotted ? 1 : 0 }}
        animate={{ opacity: knotted ? 1 : 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      />
      <motion.path
        d="M -20 80 L 1220 80"
        strokeWidth={1.5}
        strokeLinecap="round"
        initial={{
          opacity: knotted ? 0 : 1,
          stroke: phase === "resolve" ? "var(--accent)" : "var(--hf-champagne)",
        }}
        animate={{
          opacity: knotted ? 0 : 1,
          stroke: phase === "resolve" ? "var(--accent)" : "var(--hf-champagne)",
        }}
        transition={{ duration: 0.7, ease: EASE }}
      />
    </svg>
  );
}
