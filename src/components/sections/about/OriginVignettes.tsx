"use client";
import { motion } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { ABOUT } from "@/content/content";
import { EASE } from "@/lib/motion";
import { QuestionHeading } from "@/components/ui/QuestionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Glyph } from "./glyphs";

export function OriginVignettes() {
  const reduce = useReducedMotionSafe();
  return (
    <div className="relative">
      <QuestionHeading className="max-w-[15ch]">{ABOUT.originQuestion}</QuestionHeading>
      <Reveal delay={0.1}>
        <p className="mt-8 max-w-[48ch] text-lg leading-relaxed text-muted">
          {ABOUT.originIntro}
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
        {ABOUT.moments.map((m, i) => (
          <Reveal key={m.title} delay={i * 0.1} className={["md:mt-0", "md:mt-10", "md:mt-4"][i]}>
            <GlassPanel className="flex h-full flex-col p-7">
              <Glyph name={m.glyph} delay={0.3 + i * 0.25} />
              <p className="mt-5 text-xs uppercase tracking-[0.18em] text-muted">{m.kicker}</p>
              <h3 className="mt-2 font-display text-2xl tracking-tight">{m.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{m.body}</p>
              <p className="mt-auto pt-6 font-hand text-2xl text-ink">{m.tagline}</p>
            </GlassPanel>
          </Reveal>
        ))}
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
