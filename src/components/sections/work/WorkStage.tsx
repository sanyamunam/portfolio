"use client";
import { useRef, useState } from "react";
import type Lenis from "lenis";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { CASES, WORK } from "@/content/content";
import { useLight } from "@/components/light/LightProvider";
import { EASE } from "@/lib/motion";
import { QuestionHeading } from "@/components/ui/QuestionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { LiveFrame, ConfidentialFrame } from "@/components/sections/CaseMediaFrames";
import { StageThread } from "./StageThread";

export type Phase = "mess" | "turn" | "resolve";
const CASE_SPAN = 0.24;
const CASE_STRIDE = 0.253;

function locate(p: number): { idx: number; local: number } | null {
  for (let i = 0; i < CASES.length; i++) {
    const start = i * CASE_STRIDE;
    if (p >= start && p <= start + CASE_SPAN) return { idx: i, local: (p - start) / CASE_SPAN };
  }
  return null;
}
function phaseOf(local: number): Phase {
  return local < 0.38 ? "mess" : local < 0.7 ? "turn" : "resolve";
}
function valleyTemp(local: number, depth: number): number {
  const xs = [0, 0.38, 0.8, 1];
  const ys = [1.1, depth, 0.75, 0.55];
  for (let s = 0; s < xs.length - 1; s++) {
    if (local <= xs[s + 1]) {
      const f = (local - xs[s]) / (xs[s + 1] - xs[s]);
      return ys[s] + (ys[s + 1] - ys[s]) * f;
    }
  }
  return ys[ys.length - 1];
}

/** Deterministic fragment scatter (offset %, rotate deg) by index. */
const FRAG_POSE: [number, number, number][] = [
  [-6, -12, -5], [10, 6, 4], [-12, 14, 3], [8, -18, -3],
];

export function WorkStage() {
  const sectionRef = useRef<HTMLElement>(null);
  const { temp } = useLight();
  const reduce = useReducedMotion() ?? false;
  const [active, setActive] = useState<{ idx: number; phase: Phase } | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const loc = locate(p);
    if (loc && p > 0.001 && p < 0.999) {
      temp.set(valleyTemp(loc.local, CASES[loc.idx].depth));
      const next = { idx: loc.idx, phase: phaseOf(loc.local) };
      setActive((cur) =>
        cur && cur.idx === next.idx && cur.phase === next.phase ? cur : next
      );
    } else if (!loc) {
      setActive((cur) => (cur === null ? cur : null)); // breather: stage empties
    }
  });

  const jumpTo = (i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const span = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const target = top + (i * CASE_STRIDE + 0.02) * span;
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (lenis) lenis.scrollTo(target, { duration: 1.2 });
    else window.scrollTo({ top: target, behavior: reduce ? "auto" : "smooth" });
  };

  const c = active ? CASES[active.idx] : null;
  const mediaTilt = useTransform(scrollYProgress, (p) => {
    const loc = locate(p);
    if (!loc || reduce) return 0;
    return loc.local < 0.38 ? -6 : loc.local < 0.7 ? -3 : 0;
  });

  return (
    <section id="work" ref={sectionRef} className="relative hidden md:block md:h-[420vh]">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <div className="mx-auto w-full max-w-content px-10 pt-10">
          <QuestionHeading className="max-w-[18ch] !text-3xl lg:!text-4xl">
            {WORK.question}
          </QuestionHeading>
        </div>

        <div className="relative mx-auto grid w-full max-w-content flex-1 grid-cols-[180px_minmax(0,1fr)_minmax(0,420px)] items-center gap-10 px-10 pb-14">
          <StageThread phase={active?.phase ?? "resolve"} />

          {/* left rail */}
          <nav aria-label="Case studies" className="relative z-10 space-y-5">
            {CASES.map((cs, i) => {
              const current = active?.idx === i;
              return (
                <button
                  key={cs.id}
                  type="button"
                  onClick={() => jumpTo(i)}
                  aria-current={current ? "true" : undefined}
                  className="pressable block text-left"
                >
                  <span
                    className={`text-xs tracking-[0.18em] transition-colors duration-300 ${
                      current ? "text-accent" : "text-muted"
                    }`}
                  >
                    {cs.n}
                  </span>
                  <span
                    className={`block text-sm transition-colors duration-300 ${
                      current ? "text-ink" : "text-muted"
                    }`}
                  >
                    {cs.client}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* center narrative: crossfades in place */}
          <div className="relative z-10 grid min-h-[380px]">
            <AnimatePresence mode="wait" initial={false}>
              {c && active && (
                <motion.div
                  key={`${active.idx}-${active.phase}`}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -14 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="col-start-1 row-start-1 self-center"
                >
                  {active.phase === "mess" && (
                    <div className="relative min-h-[300px]">
                      <p className="text-xs uppercase tracking-[0.18em] text-muted">The mess</p>
                      <div className="relative mt-6">
                        {c.fragments.map((f, fi) => {
                          const [dx, dy, rot] = FRAG_POSE[fi % FRAG_POSE.length];
                          return (
                            <motion.p
                              key={f}
                              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.15 + fi * 0.12, duration: 0.5, ease: EASE }}
                              style={
                                reduce
                                  ? undefined
                                  : { transform: `translate(${dx}%, ${dy}%) rotate(${rot}deg)` }
                              }
                              className="glass mb-4 inline-block px-6 py-4 font-display text-xl tracking-tight lg:text-2xl"
                            >
                              {f}
                            </motion.p>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {active.phase === "turn" && (
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted">What I did</p>
                      <p className="mt-6 max-w-[44ch] text-xl leading-relaxed lg:text-2xl">{c.turn}</p>
                    </div>
                  )}
                  {active.phase === "resolve" && (
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted">What changed</p>
                      <p className="mt-6 max-w-[42ch] text-xl leading-relaxed lg:text-2xl">
                        {c.resolution}
                      </p>
                      <p className="mt-6 inline-block border-b pb-1 text-sm tracking-wide text-accent [border-color:var(--accent)]">
                        {c.outcome}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* media panel: keyed by case only, tilts by phase */}
          <div className="relative z-10 [perspective:1200px]">
            <AnimatePresence mode="wait" initial={false}>
              {c && (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ rotateY: mediaTilt }}
                >
                  {c.media ? <LiveFrame url={c.url} media={c.media} /> : <ConfidentialFrame url={c.url} />}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mx-auto w-full max-w-content px-10 pb-8">
          <Reveal>
            <p className="max-w-[44ch] text-sm leading-relaxed text-muted">{WORK.intro}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
