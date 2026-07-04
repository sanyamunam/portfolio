"use client";
import { motion, useReducedMotion } from "framer-motion";

type GlyphName = "workshop" | "phone" | "book";

/** [d, strokeWidth][] per glyph — drawn in order. viewBox 0 0 64 64. */
const GLYPHS: Record<GlyphName, [string, number][]> = {
  workshop: [
    // board
    ["M 8 12 L 56 12 L 56 46 L 8 46 Z", 2],
    // sticky notes: three straight, one tilted (the opinion that moved)
    ["M 14 18 h 9 v 9 h -9 Z", 1.4],
    ["M 28 18 h 9 v 9 h -9 Z", 1.4],
    ["M 42 18 h 9 v 9 h -9 Z", 1.4],
    ["M 26 32 l 9 -2 l 2 9 l -9 2 Z", 1.4],
    // easel legs
    ["M 18 46 L 12 58 M 46 46 L 52 58", 2],
  ],
  phone: [
    // phone body
    ["M 22 6 h 20 q 4 0 4 4 v 44 q 0 4 -4 4 h -20 q -4 0 -4 -4 v -44 q 0 -4 4 -4", 2],
    // the tap: fingertip ring + delight sparks
    ["M 32 32 m -5 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0", 1.4],
    ["M 44 20 l 4 -4 M 47 28 l 5 0 M 40 14 l 1 -5", 1.4],
    // the tick of a payment landing
    ["M 28 33 l 3 3 l 6 -7", 2],
  ],
  book: [
    // open spread
    ["M 32 14 C 24 8, 12 8, 8 12 L 8 48 C 12 44, 24 44, 32 50 C 40 44, 52 44, 56 48 L 56 12 C 52 8, 40 8, 32 14", 2],
    // spine
    ["M 32 14 L 32 50", 1.4],
    // two lines of the idea sinking in
    ["M 14 22 C 20 20, 24 20, 27 22 M 14 30 C 20 28, 24 28, 27 30", 1.4],
    ["M 37 22 C 42 20, 47 20, 50 22", 1.4],
  ],
};

export function Glyph({ name, delay = 0 }: { name: GlyphName; delay?: number }) {
  const reduce = useReducedMotion();
  const paths = GLYPHS[name];
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-14 w-14 overflow-visible" aria-hidden>
      {paths.map(([d, w], i) => (
        <motion.path
          key={d}
          d={d}
          stroke="var(--ink)"
          strokeWidth={w}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: reduce ? 1 : 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={
            reduce ? { duration: 0 } : { delay: delay + i * 0.18, duration: 0.5, ease: "easeInOut" }
          }
        />
      ))}
    </svg>
  );
}
