"use client";
import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { GREETING } from "@/content/content";
import { useSectionLight } from "@/components/light/LightProvider";
import { TEMP } from "@/lib/lightScript";
import { EASE } from "@/lib/motion";
import { HeroIllustration } from "./HeroIllustration";

export function Greeting() {
  const ref = useRef<HTMLElement>(null);
  useSectionLight(ref, TEMP.greeting);
  const reduce = useReducedMotionSafe();

  return (
    <section
      id="hello"
      ref={ref}
      className="relative mx-auto flex min-h-[100dvh] max-w-content flex-col justify-between px-6 pb-16 pt-8 md:px-10"
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="text-xs uppercase tracking-[0.18em] text-muted"
      >
        {GREETING.label}
      </motion.p>

      {/* Sanya's own continuous line draws itself into her, then travels on
          through every beat of the site. Overlaps the atmosphere's glow so it
          feels lit, not placed. */}
      <HeroIllustration className="absolute right-0 top-1/2 hidden aspect-[571/434] w-[54%] max-w-[680px] -translate-y-1/2 md:block" />

      {/* M1: the line leaves the drawing and heads for the story below */}
      <M1Stub />

      <div className="max-w-[24ch]">
        <motion.h1
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.1, delay: 0.4, ease: EASE }}
          className="font-display text-6xl leading-[0.98] tracking-tight md:text-8xl"
        >
          {GREETING.hello}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9, ease: EASE }}
          className="mt-6 max-w-[38ch] text-lg leading-relaxed text-muted md:text-xl"
        >
          {GREETING.premise}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="mt-14 text-sm italic text-muted"
          aria-hidden
        >
          {GREETING.cue} ↓
        </motion.p>
      </div>
    </section>
  );
}

function M1Stub() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.55", "end 0.1"] });
  const pathLength = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute -bottom-[18vh] right-[16%] hidden h-[30vh] w-16 md:block"
    >
      <svg viewBox="0 0 64 240" fill="none" className="h-full w-full overflow-visible">
        <motion.path
          d="M 48 0 C 60 60, 16 110, 32 160 C 44 196, 24 220, 32 240"
          stroke="var(--hf-orchid)"
          strokeWidth={1.5}
          strokeLinecap="round"
          style={{ pathLength: reduce ? 1 : pathLength }}
        />
      </svg>
    </div>
  );
}
