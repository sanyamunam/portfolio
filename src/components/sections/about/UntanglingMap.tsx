"use client";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
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

/** Cursor proximity push: chips within ~22% of the pointer lean away ~6px. */
function usePerturb(
  px: MotionValue<number>,
  py: MotionValue<number>,
  colPct: number,
  rowPct: number
) {
  const raw = useTransform(() => {
    const dx = colPct - px.get();
    const dy = rowPct - py.get();
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d > 22 || d === 0) return { x: 0, y: 0 };
    const f = (6 * (1 - d / 22)) / d;
    return { x: dx * f, y: dy * f };
  });
  const x = useSpring(useTransform(raw, (v) => v.x), { stiffness: 120, damping: 16 });
  const y = useSpring(useTransform(raw, (v) => v.y), { stiffness: 120, damping: 16 });
  return { x, y };
}

function MapChip({
  label,
  colPct,
  rowPct,
  mess,
  organized,
  delay,
  px,
  py,
}: {
  label: string;
  colPct: number;
  rowPct: number;
  mess: [number, number, number];
  organized: boolean;
  delay: number;
  px: MotionValue<number>;
  py: MotionValue<number>;
}) {
  const [dx, dy, rot] = mess;
  const perturb = usePerturb(px, py, colPct, rowPct);
  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${colPct}%`, top: `${rowPct}%` }}
      initial={false}
      animate={
        organized ? { x: "0%", y: "0%", rotate: 0 } : { x: `${dx}%`, y: `${dy}%`, rotate: rot }
      }
      transition={{ duration: 1.0, ease: EASE, delay }}
    >
      {/* inner layer carries the cursor perturbation so it never fights the
          organize/scatter transform above */}
      <motion.span
        style={{ x: perturb.x, y: perturb.y }}
        className="glass block whitespace-nowrap rounded-full px-4 py-2 text-xs tracking-wide md:text-sm"
      >
        {label}
      </motion.span>
    </motion.div>
  );
}

export function UntanglingMap() {
  const reduce = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement>(null);
  const [organizedByTimer, setOrganizedByTimer] = useState(false);
  // Derived, not stored: `reduce` is deliberately `false` on the very first
  // client render (see useReducedMotionSafe), so mirroring it into state via
  // a useState initializer or a setState-in-effect can't be trusted — once
  // the real value arrives this must take effect on the very same render.
  const organized = organizedByTimer || reduce;
  // Ref (not state) so the "already observed" guard doesn't itself retrigger
  // this effect — a state-backed guard here would re-run the effect on the
  // very setSeen(true) that starts the organize timer, and the effect's own
  // cleanup would disconnect+clear that timer before it ever fires.
  const seenRef = useRef(false);

  // pointer position in the map's own % space (parked far away by default)
  const px = useMotionValue(-100);
  const py = useMotionValue(-100);

  // organize once, shortly after first entering view
  useEffect(() => {
    if (reduce || seenRef.current) return;
    const el = ref.current;
    if (!el) return;
    let t: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          seenRef.current = true;
          t = setTimeout(() => setOrganizedByTimer(true), 900);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (t) clearTimeout(t);
    };
  }, [reduce]);

  const replay = () => {
    if (reduce) return;
    setOrganizedByTimer(false);
    setTimeout(() => setOrganizedByTimer(true), 1100);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width) * 100);
    py.set(((e.clientY - r.top) / r.height) * 100);
  };
  const onPointerLeave = () => {
    px.set(-100);
    py.set(-100);
  };

  return (
    <div ref={ref}>
      {/* the living map (needs room — desktop/tablet only) */}
      <div className="relative hidden md:block">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        >
          <motion.g
            initial={{ opacity: organized ? 0 : 1 }}
            animate={{ opacity: organized ? 0 : 1 }}
            transition={{ duration: 0.9, ease: EASE }}
            stroke="var(--hf-orchid)"
            strokeWidth={0.35}
          >
            <path d="M 30 45 C 60 10, 20 80, 75 30 C 95 12, 40 95, 12 60 C 0 42, 70 70, 55 20" />
            <path d="M 20 25 C 70 55, 30 5, 80 70 C 95 88, 15 80, 45 40" />
          </motion.g>
          <motion.g
            initial={{ opacity: organized ? 1 : 0 }}
            animate={{ opacity: organized ? 1 : 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: organized ? 0.5 : 0 }}
            stroke="var(--hf-champagne)"
            strokeWidth={0.35}
          >
            <path d="M 10 18 L 90 18 M 10 50 L 90 50 M 10 82 L 90 82" />
          </motion.g>
        </svg>

        <div
          className="relative h-[420px]"
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
        >
          {ABOUT.mapNodes.map((n, i) => (
            <MapChip
              key={n.id}
              label={n.label}
              colPct={COL_X[n.stage]}
              rowPct={ROW_Y[i % 3]}
              mess={MESS[i]}
              organized={organized}
              delay={i * 0.045}
              px={px}
              py={py}
            />
          ))}
        </div>

        {/* stage labels appear once organized */}
        <motion.div
          aria-hidden
          initial={{ opacity: organized ? 1 : 0 }}
          animate={{ opacity: organized ? 1 : 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-4 grid grid-cols-4"
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
      </div>

      {/* mobile: the same information as a calm grouped list (chips can't fit 375px) */}
      <dl className="space-y-5 md:hidden">
        {ABOUT.mapStages.map((s, si) => (
          <div key={s}>
            <dt className="text-xs uppercase tracking-[0.18em] text-muted">{s}</dt>
            <dd className="mt-2 flex flex-wrap gap-2">
              {ABOUT.mapNodes
                .filter((n) => n.stage === si)
                .map((n) => (
                  <span key={n.id} className="glass rounded-full px-3 py-1.5 text-xs tracking-wide">
                    {n.label}
                  </span>
                ))}
            </dd>
          </div>
        ))}
      </dl>

      {/* screen-reader mirror for the visual map (desktop widths) */}
      <ul className="sr-only max-md:hidden">
        {ABOUT.mapStages.map((s, si) => (
          <li key={s}>
            {s}: {ABOUT.mapNodes.filter((n) => n.stage === si).map((n) => n.label).join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
}
