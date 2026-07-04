"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { ArrowUpRight } from "@phosphor-icons/react";
import { CURSOR, WORKBENCH } from "@/content/content";
import { useSectionLight } from "@/components/light/LightProvider";
import { TEMP } from "@/lib/lightScript";
import { QuestionHeading } from "@/components/ui/QuestionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Typewriter } from "./Typewriter";

/** The finished artifact: glass browser frame with a live miniature of the real page. */
function PlaybookArtifact() {
  const p = WORKBENCH.playbook;
  return (
    <a
      href={p.href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="link"
      data-cursor-label={CURSOR.labels.open}
      className="group block h-full"
    >
      <GlassPanel className="pressable flex h-full flex-col overflow-hidden">
        <div className="flex items-center gap-2 border-b px-4 py-2.5 [border-color:var(--edge)]">
          <span className="size-2 rounded-full bg-[var(--edge)]" />
          <span className="size-2 rounded-full bg-[var(--edge)]" />
          <span className="size-2 rounded-full bg-[var(--edge)]" />
          <span className="ml-3">
            <Typewriter phrases={WORKBENCH.playbook.typewriter} />
          </span>
        </div>
        {/* live miniature of the actual shipped page */}
        <div className="relative h-64 overflow-hidden" aria-hidden>
          <iframe
            src={p.href}
            title=""
            tabIndex={-1}
            loading="lazy"
            className="pointer-events-none absolute left-0 top-0 origin-top-left overflow-hidden"
            style={{ width: 1280, height: 900, transform: "scale(0.46)" }}
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[var(--glass)] to-transparent" />
        </div>
        <div className="flex flex-1 flex-col p-6 md:p-7">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">{p.kicker}</p>
          <h3 className="mt-3 font-display text-2xl tracking-tight md:text-3xl">{p.title}</h3>
          <p className="mt-3 max-w-[48ch] leading-relaxed text-muted">{p.body}</p>
          <p className="mt-auto flex items-center gap-2 pt-5 text-sm">
            {p.cta}
            <ArrowUpRight
              size={16}
              className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden
            />
          </p>
        </div>
      </GlassPanel>
    </a>
  );
}

/** Still on the workbench: the thread hasn't finished drawing this one. */
function WipCard() {
  const w = WORKBENCH.wip;
  const reduce = useReducedMotionSafe();
  const [li, setLi] = useState(0);
  const paused = useRef(false);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      if (!paused.current) setLi((v) => (v + 1) % w.laws.length);
    }, 2400);
    return () => clearInterval(id);
  }, [reduce, w.laws.length]);

  return (
    <div
      className="relative h-full p-6 md:p-7"
      onPointerEnter={() => (paused.current = true)}
      onPointerLeave={() => (paused.current = false)}
      role="group"
      aria-label={`${w.title} — in progress`}
    >
      {/* the partially-drawn outline: the line stops mid-stroke (M3) */}
      <svg
        viewBox="0 0 400 300"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      >
        <motion.rect
          x="2"
          y="2"
          width="396"
          height="296"
          rx="20"
          stroke="var(--hf-orchid)"
          strokeWidth={1.6}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 0.62 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={reduce ? { duration: 0 } : { duration: 1.4, ease: "easeInOut" }}
        />
      </svg>
      <p className="text-xs uppercase tracking-[0.16em] text-muted">{w.kicker}</p>
      <h3 className="mt-3 font-display text-2xl tracking-tight md:text-3xl">{w.title}</h3>
      <p className="mt-3 leading-relaxed text-muted">{w.body}</p>
      <div className="mt-6 min-h-[2rem]" aria-hidden>
        <motion.p
          key={w.laws[li]}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 0.65, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-display text-xl tracking-tight"
        >
          {w.laws[li]}
        </motion.p>
      </div>
      <p className="mt-4 text-sm italic text-muted">{w.note}</p>
    </div>
  );
}

/** Margin strip: the features she talked teams out of building, struck one by one. */
function Aside() {
  const a = WORKBENCH.aside;
  const reduce = useReducedMotionSafe();
  const [struckByTimer, setStruckByTimer] = useState(0);
  // Derived, not stored: `reduce` is deliberately `false` on the very first
  // client render (see useReducedMotionSafe), so mirroring it into state via
  // a useState initializer or a setState-in-effect can't be trusted — once
  // the real value arrives this must take effect on the very same render.
  const struck = reduce ? a.strikes.length : struckByTimer;

  return (
    <motion.div
      onViewportEnter={() => {
        if (reduce) return;
        a.strikes.forEach((_, i) => setTimeout(() => setStruckByTimer(i + 1), 700 + i * 800));
      }}
      viewport={{ once: true, amount: 0.6 }}
      className="glass flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between md:p-7"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-accent">{a.kicker}</p>
        <p className="mt-2 max-w-[46ch] text-lg leading-snug md:text-xl">{a.text}</p>
      </div>
      <ul className="space-y-1 text-sm text-muted">
        {a.strikes.map((s, i) => (
          <li key={s} className="strike-line" style={{ "--strike": i < struck ? 1 : 0 } as React.CSSProperties}>
            {s}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function Workbench() {
  const ref = useRef<HTMLElement>(null);
  useSectionLight(ref, TEMP.playground, 0.35);
  return (
    <section id="play" ref={ref} className="mx-auto max-w-content px-6 py-28 md:px-10 md:py-36">
      <QuestionHeading className="max-w-[18ch]">{WORKBENCH.question}</QuestionHeading>
      <Reveal delay={0.08}>
        <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-muted">{WORKBENCH.intro}</p>
      </Reveal>
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-[1.5fr_1fr]">
        <Reveal>
          <PlaybookArtifact />
        </Reveal>
        <Reveal delay={0.1}>
          <WipCard />
        </Reveal>
      </div>
      <div className="mt-6">
        <Reveal delay={0.05}>
          <Aside />
        </Reveal>
      </div>
      {/* SR status mirror */}
      <ul className="sr-only">
        <li>{WORKBENCH.playbook.title}: available</li>
        <li>{WORKBENCH.wip.title}: in progress</li>
      </ul>
    </section>
  );
}
