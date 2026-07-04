"use client";
import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GREETING } from "@/content/content";
import { useSectionLight } from "@/components/light/LightProvider";
import { TEMP } from "@/lib/lightScript";
import { EASE } from "@/lib/motion";
import { ThreadSegment } from "@/components/thread/ThreadSegment";

export function Greeting() {
  const ref = useRef<HTMLElement>(null);
  useSectionLight(ref, TEMP.greeting);
  const reduce = useReducedMotion();

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

      <ThreadSegment
        variant="curl"
        className="absolute right-4 top-24 hidden h-[70vh] w-40 md:block lg:right-16"
      />

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
