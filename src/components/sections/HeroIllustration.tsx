"use client";
import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

/**
 * The greeting's thread, become Sanya: a line illustration of a woman in a
 * hijab with a steaming cup at her glowing laptop. Three-phase reveal, one
 * pen at a time: ink sketch → colored echoes → steam (which then keeps
 * drifting via CSS, reduced-motion aware). The whole drawing leans a few
 * springy pixels toward the cursor; hovering wakes the colored lines.
 * Master lines stroke var(--ink) so the drawing lives in the world's light.
 */

type Stroke = {
  d: string;
  /** draw duration in seconds */
  dur: number;
  thin?: boolean;
  /** echo color (omit for master ink) */
  color?: string;
};

const PINK = "oklch(0.72 0.16 350)";
const GOLD = "oklch(0.78 0.13 85)";
const ROSE = "oklch(0.55 0.11 15)";

/** Phase 1 — the ink sketch, in pen order. */
const MASTER: Stroke[] = [
  // desk (left), then the laptop rises from it
  { d: "M 24 522 Q 150 512 288 516", dur: 0.35 },
  { d: "M 210 302 Q 208 296 214 295 L 348 284 Q 355 284 356 290 L 374 444 L 226 460 Q 212 380 210 302", dur: 0.55 },
  { d: "M 226 460 L 374 444 L 452 478 L 288 500 Q 254 480 226 460", dur: 0.35 },
  // hijab: outer wrap, then the face opening
  { d: "M 496 214 Q 496 148 550 128 Q 606 108 640 148 Q 664 178 660 226 Q 656 268 630 302 Q 606 330 570 336 Q 538 342 518 322 Q 500 306 496 270 Q 494 240 496 214", dur: 0.8 },
  { d: "M 546 176 Q 524 194 522 230 Q 520 264 538 280 Q 556 294 576 280 Q 592 266 592 230 Q 591 194 573 178 Q 558 166 546 176", dur: 0.55 },
  { d: "M 578 140 Q 604 158 612 188", dur: 0.2, thin: true },
  { d: "M 540 176 Q 564 166 586 174", dur: 0.2, thin: true },
  // the face, feature by feature
  { d: "M 536 216 Q 544 211 554 214", dur: 0.12, thin: true },
  { d: "M 566 212 Q 575 209 583 213", dur: 0.12, thin: true },
  { d: "M 538 231 Q 545 236 553 231", dur: 0.12, thin: true },
  { d: "M 567 229 Q 574 234 582 229", dur: 0.12, thin: true },
  { d: "M 559 234 Q 558 245 555 250 Q 559 253 563 251", dur: 0.15, thin: true },
  { d: "M 550 264 Q 556 260 560 264 Q 564 260 570 264", dur: 0.14, thin: true },
  { d: "M 551 266 Q 560 273 569 266", dur: 0.14, thin: true },
  // fabric in motion: cascade + the tail flowing off-canvas
  { d: "M 654 250 Q 678 292 682 336 Q 686 378 676 416", dur: 0.4 },
  { d: "M 624 116 Q 668 100 704 116 Q 740 132 762 120 Q 776 112 790 116", dur: 0.4 },
  // body
  { d: "M 516 320 Q 502 356 502 392 Q 502 412 508 428", dur: 0.35 },
  { d: "M 676 416 Q 684 458 678 505", dur: 0.3 },
  { d: "M 668 424 Q 674 458 648 472 Q 617 484 586 464 Q 570 452 556 440 Q 549 436 544 438", dur: 0.5 },
  { d: "M 508 428 Q 496 440 488 434", dur: 0.15, thin: true },
  { d: "M 480 430 Q 473 436 478 444", dur: 0.12, thin: true },
  // the cup
  { d: "M 480 424 Q 508 413 536 424", dur: 0.15 },
  { d: "M 482 424 L 485 445 Q 487 456 508 456 Q 529 456 531 445 L 534 424", dur: 0.3 },
  { d: "M 500 462 Q 493 484 497 505", dur: 0.2 },
  // desk (right)
  { d: "M 470 514 Q 600 508 700 515 Q 744 518 788 510", dur: 0.35 },
];

/** Phase 2 — colored pencils over the ink. */
const ECHOES: Stroke[] = [
  { d: "M 218 310 Q 216 302 224 301 L 344 291", dur: 0.3, color: ROSE },
  { d: "M 662 240 Q 686 288 690 338 Q 694 384 682 424", dur: 0.35, color: PINK },
  { d: "M 546 118 Q 598 100 634 130", dur: 0.25, color: GOLD },
  { d: "M 494 340 Q 484 372 486 404", dur: 0.25, color: PINK },
  { d: "M 660 434 Q 664 460 642 472", dur: 0.25, color: GOLD },
  { d: "M 30 530 Q 150 520 284 524", dur: 0.3, color: ROSE },
  { d: "M 480 521 Q 610 515 720 522", dur: 0.3, color: GOLD },
];

/** Phase 3 — steam, which then drifts forever. */
const STEAM: Stroke[] = [
  { d: "M 496 412 Q 489 396 497 380 Q 504 366 498 352", dur: 0.35, thin: true },
  { d: "M 518 410 Q 512 396 518 382 Q 523 369 519 358", dur: 0.35, thin: true },
];

function schedule(strokes: Stroke[], from: number, overlap: number) {
  let t = from;
  return strokes.map((s) => {
    const delay = t;
    t += s.dur - overlap;
    return { ...s, delay, end: t };
  });
}

const START = 0.7;
const TIMED_MASTER = schedule(MASTER, START, 0.12);
const MASTER_END = TIMED_MASTER[TIMED_MASTER.length - 1].end + 0.12;
const TIMED_ECHOES = schedule(ECHOES, MASTER_END - 0.5, 0.1);
const ECHOES_END = TIMED_ECHOES[TIMED_ECHOES.length - 1].end + 0.1;
const TIMED_STEAM = schedule(STEAM, ECHOES_END - 0.2, 0.1);
const DRAW_END = TIMED_STEAM[TIMED_STEAM.length - 1].end + 0.1;

function DrawnPath({
  s,
  reduce,
}: {
  s: Stroke & { delay: number };
  reduce: boolean;
}) {
  return (
    <motion.path
      d={s.d}
      stroke={s.color ?? "var(--ink)"}
      strokeWidth={s.color ? 1.8 : s.thin ? 1.6 : 2.4}
      className={s.color ? "hero-echo" : undefined}
      initial={{ pathLength: reduce ? 1 : 0 }}
      animate={{ pathLength: 1 }}
      transition={
        reduce ? { duration: 0 } : { delay: s.delay, duration: s.dur, ease: "easeInOut" }
      }
    />
  );
}

export function HeroIllustration({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion() ?? false;

  // Cursor proximity: the drawing leans a few pixels toward the pointer.
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 50, damping: 18 });
  const y = useSpring(rawY, { stiffness: 50, damping: 18 });

  useEffect(() => {
    if (reduce) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * 12);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 8);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, rawX, rawY]);

  return (
    <motion.div aria-hidden className={`hero-art ${className}`} style={{ x, y }}>
      <svg viewBox="0 0 800 640" fill="none" className="h-full w-full overflow-visible">
        {/* laptop screen ambient glow — fades in once the laptop is drawn */}
        <motion.g
          initial={{ opacity: reduce ? 1 : 0 }}
          animate={{ opacity: 1 }}
          transition={reduce ? { duration: 0 } : { delay: START + 1.0, duration: 1.4 }}
        >
          <ellipse className="hero-glow" cx="300" cy="390" rx="70" ry="60" />
        </motion.g>

        <g strokeLinecap="round" strokeLinejoin="round">
          {TIMED_MASTER.map((s) => (
            <DrawnPath key={s.d} s={s} reduce={reduce} />
          ))}
          {TIMED_ECHOES.map((s) => (
            <DrawnPath key={s.d} s={s} reduce={reduce} />
          ))}
          {/* steam draws last, then keeps drifting (CSS float, reduced-motion aware) */}
          <g className="hero-steam" style={{ animationDelay: `${DRAW_END + 0.4}s` }}>
            {TIMED_STEAM.map((s) => (
              <DrawnPath key={s.d} s={s} reduce={reduce} />
            ))}
          </g>
        </g>
      </svg>
    </motion.div>
  );
}
