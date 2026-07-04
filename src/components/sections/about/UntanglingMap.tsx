"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ABOUT } from "@/content/content";
import { EASE } from "@/lib/motion";

/** Organized layout: column per stage, 3 rows. Percent coordinates. */
const COL_X = [10, 37, 63, 90];
const ROW_Y = [18, 50, 82];
/** Messy deltas per node index: dx%, dy%, rotate deg (deterministic chaos). */
const MESS: [number, number, number][] = [
  [22, 30, -14], [45, 8, 9], [30, 52, -6], [-8, 38, 12], [18, -6, -9],
  [38, 26, 15], [-14, 12, -12], [8, 44, 7], [-20, -4, -15], [-32, 20, 10],
  [-12, 36, -8], [-40, 6, 13],
];

export function UntanglingMap() {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const [organized, setOrganized] = useState(reduce);
  const [seen, setSeen] = useState(false);

  // organize once, shortly after first entering view
  useEffect(() => {
    if (reduce || seen) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          const t = setTimeout(() => setOrganized(true), 900);
          io.disconnect();
          return () => clearTimeout(t);
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce, seen]);

  const replay = () => {
    if (reduce) return;
    setOrganized(false);
    setTimeout(() => setOrganized(true), 1100);
  };

  return (
    <div ref={ref} className="relative">
      {/* connectors: tangled ↔ straight crossfade */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      >
        <motion.g
          animate={{ opacity: organized ? 0 : 1 }}
          transition={{ duration: 0.9, ease: EASE }}
          stroke="var(--hf-orchid)"
          strokeWidth={0.35}
        >
          <path d="M 30 45 C 60 10, 20 80, 75 30 C 95 12, 40 95, 12 60 C 0 42, 70 70, 55 20" />
          <path d="M 20 25 C 70 55, 30 5, 80 70 C 95 88, 15 80, 45 40" />
        </motion.g>
        <motion.g
          animate={{ opacity: organized ? 1 : 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: organized ? 0.5 : 0 }}
          stroke="var(--hf-champagne)"
          strokeWidth={0.35}
        >
          <path d="M 10 18 L 90 18 M 10 50 L 90 50 M 10 82 L 90 82" />
        </motion.g>
      </svg>

      <div className="relative grid h-[380px] md:h-[420px]">
        {ABOUT.mapNodes.map((n, i) => {
          const col = COL_X[n.stage];
          const row = ROW_Y[i % 3];
          const [dx, dy, rot] = MESS[i];
          return (
            <motion.div
              key={n.id}
              className="glass absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-4 py-2 text-xs tracking-wide md:text-sm"
              style={{ left: `${col}%`, top: `${row}%` }}
              initial={false}
              animate={
                organized
                  ? { x: "0%", y: "0%", rotate: 0 }
                  : { x: `${dx}%`, y: `${dy}%`, rotate: rot }
              }
              transition={{ duration: 1.0, ease: EASE, delay: i * 0.045 }}
            >
              {n.label}
            </motion.div>
          );
        })}
      </div>

      {/* stage labels appear once organized */}
      <motion.div
        aria-hidden
        animate={{ opacity: organized ? 1 : 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="mt-4 hidden grid-cols-4 md:grid"
      >
        {ABOUT.mapStages.map((s) => (
          <p key={s} className="text-center text-xs uppercase tracking-[0.18em] text-muted">
            {s}
          </p>
        ))}
      </motion.div>

      {!reduce && (
        <button
          type="button"
          onClick={replay}
          className="pressable mt-4 text-sm italic text-muted underline-offset-4 hover:underline"
        >
          {ABOUT.replayLabel}
        </button>
      )}

      {/* screen-reader mirror */}
      <ul className="sr-only">
        {ABOUT.mapStages.map((s, si) => (
          <li key={s}>
            {s}: {ABOUT.mapNodes.filter((n) => n.stage === si).map((n) => n.label).join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
}
