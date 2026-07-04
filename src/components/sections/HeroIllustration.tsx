"use client";
import { useEffect, useId } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { HERO_PATHS, HERO_VIEWBOX } from "./heroArt";

/**
 * Sanya's own continuous-line illustration (Illustrator export), integrated
 * as living line art: one stroke draws the whole figure, a slow gradient
 * flows through the line like light through glass, the drawing breathes,
 * and it leans a few springy pixels toward the cursor. The source shapes are
 * expanded outlines — rendered fill-none + stroked they read as the original
 * single line while enabling pathLength draw-on.
 */

/** The main continuous line draws first; details follow while it finishes. */
const MAIN_DUR = 3.1;
const START = 0.5;
const DETAIL_START = START + MAIN_DUR * 0.72;
const DETAIL_STAGGER = 0.22;
const DETAIL_DUR = 0.5;

// Uneven keyframe pacing: the pen accelerates through long sweeps and slows
// into detail — organic, not linear.
const MAIN_TIMES = [0, 0.18, 0.31, 0.52, 0.63, 0.85, 1];
const MAIN_KEYS = [0, 0.1, 0.27, 0.44, 0.66, 0.85, 1];

export function HeroIllustration({ className = "" }: { className?: string }) {
  const reduce = useReducedMotionSafe();
  const gradId = useId();
  const maskId = useId();

  // Cursor proximity: the drawing leans gently toward the pointer.
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 45, damping: 18 });
  const y = useSpring(rawY, { stiffness: 45, damping: 18 });

  useEffect(() => {
    if (reduce) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * 10);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 6);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, rawX, rawY]);

  return (
    <motion.div aria-hidden className={`hero-art ${className}`} style={{ x, y }}>
      {/* breathing: an almost imperceptible scale swell once drawn */}
      <motion.div
        className="h-full w-full"
        animate={reduce ? undefined : { scale: [1, 1.006, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: START + MAIN_DUR }}
      >
        <svg viewBox={HERO_VIEWBOX} fill="none" className="h-full w-full overflow-visible">
          <defs>
            <linearGradient
              id={gradId}
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2="571"
              y2="434"
            >
              <stop offset="0" style={{ stopColor: "var(--hf-blush)" }} />
              <stop offset="0.22" style={{ stopColor: "var(--hf-orchid)" }} />
              <stop offset="0.45" style={{ stopColor: "var(--hf-champagne)" }} />
              <stop offset="0.62" style={{ stopColor: "var(--hf-ivory)" }} />
              <stop offset="0.8" style={{ stopColor: "var(--hf-lavender)" }} />
              <stop offset="1" style={{ stopColor: "var(--hf-turquoise)" }} />
              {/* the light travels: a slow drift of the whole gradient field */}
              {!reduce && (
                <animateTransform
                  attributeName="gradientTransform"
                  type="translate"
                  values="0 0; 90 50; 0 0; -70 -40; 0 0"
                  dur="18s"
                  repeatCount="indefinite"
                />
              )}
            </linearGradient>
          </defs>

          {/* laptop's faint ambient light (lower-left of the artwork);
              framer fades the group in, CSS pulses the ellipse */}
          <motion.g
            initial={{ opacity: reduce ? 1 : 0 }}
            animate={{ opacity: 1 }}
            transition={reduce ? { duration: 0 } : { delay: START + 1.6, duration: 1.6 }}
          >
            <ellipse className="hero-glow" cx="120" cy="330" rx="85" ry="55" />
          </motion.g>

          {/* The reveal mask: the same paths stroked wide in white, drawing
              along the line's own trajectory. The FILLED artwork below is
              uncovered pen-stroke by pen-stroke — original solid line weight,
              still hand-drawn on load. */}
          <mask id={maskId}>
            <g
              stroke="#fff"
              strokeWidth={10}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            >
              <motion.path
                d={HERO_PATHS[0]}
                initial={{ pathLength: reduce ? 1 : 0 }}
                animate={{ pathLength: reduce ? 1 : MAIN_KEYS }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { delay: START, duration: MAIN_DUR, times: MAIN_TIMES, ease: "easeInOut" }
                }
              />
              {HERO_PATHS.slice(1).map((d, i) => (
                <motion.path
                  key={d.slice(0, 24)}
                  d={d}
                  initial={{ pathLength: reduce ? 1 : 0 }}
                  animate={{ pathLength: 1 }}
                  transition={
                    reduce
                      ? { duration: 0 }
                      : {
                          delay: DETAIL_START + i * DETAIL_STAGGER,
                          duration: DETAIL_DUR,
                          ease: "easeInOut",
                        }
                  }
                />
              ))}
            </g>
          </mask>

          {/* the artwork itself: filled exactly like the Illustrator original,
              inked in the flowing gradient */}
          <g fill={`url(#${gradId})`} mask={`url(#${maskId})`}>
            {HERO_PATHS.map((d) => (
              <path key={d.slice(0, 24)} d={d} />
            ))}
          </g>
        </svg>
      </motion.div>
    </motion.div>
  );
}
