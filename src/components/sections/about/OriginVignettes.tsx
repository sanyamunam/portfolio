"use client";
import { motion } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { ABOUT } from "@/content/content";
import { EASE } from "@/lib/motion";
import { QuestionHeading } from "@/components/ui/QuestionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Glyph } from "./glyphs";

/** M1: the thread strings the three origin moments like beads. */
function BeadThread() {
  const reduce = useReducedMotionSafe();
  return (
    <svg
      viewBox="0 0 1200 120"
      fill="none"
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-8 hidden h-24 w-full overflow-visible md:block"
      preserveAspectRatio="none"
    >
      <motion.path
        d="M 1190 8 C 1000 30, 900 90, 760 70 C 640 54, 560 92, 430 72 C 320 56, 220 96, 60 78"
        stroke="var(--hf-orchid)"
        strokeWidth={1.5}
        strokeLinecap="round"
        initial={{ pathLength: reduce ? 1 : 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={reduce ? { duration: 0 } : { duration: 1.6, ease: "easeInOut" }}
      />
    </svg>
  );
}

export function OriginVignettes() {
  const reduce = useReducedMotionSafe();
  return (
    <div className="relative">
      <QuestionHeading className="max-w-[15ch]">{ABOUT.originQuestion}</QuestionHeading>

      <div className="relative mt-14">
        <BeadThread />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {ABOUT.moments.map((m, i) => (
            <Reveal key={m.title} delay={i * 0.1} className={["md:mt-0", "md:mt-10", "md:mt-4"][i]}>
              <GlassPanel className="h-full p-7">
                <Glyph name={m.glyph} delay={0.3 + i * 0.25} />
                <h3 className="mt-5 font-display text-2xl tracking-tight">{m.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{m.body}</p>
              </GlassPanel>
            </Reveal>
          ))}
        </div>
      </div>

      {/* the bridge into Movement 2 — kinetic words */}
      <motion.p
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.6 }}
        transition={{ staggerChildren: reduce ? 0 : 0.06 }}
        className="mt-16 max-w-[26ch] font-display text-3xl leading-snug tracking-tight md:text-4xl"
      >
        {ABOUT.bridge.split(" ").map((w, i, arr) => (
          <motion.span
            key={`${w}-${i}`}
            className="inline-block whitespace-pre"
            variants={{
              hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 18 },
              shown: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
            }}
          >
            {w}
            {i < arr.length - 1 ? " " : ""}
          </motion.span>
        ))}
      </motion.p>
    </div>
  );
}
