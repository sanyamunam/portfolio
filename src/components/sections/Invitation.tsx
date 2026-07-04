"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { CURSOR, INVITATION } from "@/content/content";
import { useSectionLight } from "@/components/light/LightProvider";
import { TEMP } from "@/lib/lightScript";
import { EASE } from "@/lib/motion";
import { QuestionHeading } from "@/components/ui/QuestionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { useMagnetic } from "@/lib/useMagnetic";

/** The thread ties itself into a small bow beside the CTA. */
function ThreadBow() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduce = useReducedMotionSafe();
  return (
    <svg
      ref={ref}
      aria-hidden
      viewBox="0 0 120 80"
      fill="none"
      className="h-14 w-20 overflow-visible"
    >
      <motion.path
        d="M 6 44 C 30 20, 50 20, 58 40 C 64 55, 44 66, 36 52 C 28 38, 54 30, 70 38 C 90 48, 96 60, 114 50"
        stroke="var(--accent)"
        strokeWidth={2}
        strokeLinecap="round"
        initial={{ pathLength: reduce ? 1 : 0 }}
        animate={inView ? { pathLength: 1 } : undefined}
        transition={{ duration: 1.4, ease: EASE, delay: 0.4 }}
      />
    </svg>
  );
}

export function Invitation() {
  const ref = useRef<HTMLElement>(null);
  useSectionLight(ref, TEMP.invitation);
  const magnet = useMagnetic(6);

  return (
    <section
      id="talk"
      ref={ref}
      className="mx-auto flex min-h-[100dvh] max-w-content flex-col justify-center px-6 py-24 md:px-10"
    >
      <QuestionHeading className="max-w-[16ch]">
        {INVITATION.question}
      </QuestionHeading>
      <Reveal delay={0.1}>
        <p className="mt-8 max-w-[44ch] text-lg leading-relaxed text-muted md:text-xl">
          {INVITATION.answer}
        </p>
      </Reveal>
      <Reveal delay={0.2}>
        <div className="mt-14 flex items-center gap-5">
          <motion.a
            href={`mailto:${INVITATION.email}`}
            data-cursor="absorb"
            data-cursor-label={CURSOR.labels.say}
            className="pressable glass cta-glow inline-block px-8 py-4 text-lg font-medium"
            style={{ x: magnet.x, y: magnet.y }}
            {...magnet.handlers}
          >
            {INVITATION.cta}
          </motion.a>
          <ThreadBow />
        </div>
      </Reveal>
      <footer className="mt-auto pt-24">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">
          {INVITATION.footer}
        </p>
      </footer>
    </section>
  );
}
