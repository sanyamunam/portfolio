"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { BENTO } from "@/content/content";
import { useSectionLight } from "@/components/light/LightProvider";
import { TEMP } from "@/lib/lightScript";
import { EASE } from "@/lib/motion";
import { QuestionHeading } from "@/components/ui/QuestionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { GlassPanel } from "@/components/ui/GlassPanel";

/** One domain tile: skills at rest, belief when lit (hover/focus/spotlight). */
function DomainTile({
  domain,
  belief,
  skills,
  spotlit,
  onEnter,
  onLeave,
}: {
  domain: string;
  belief: string;
  skills: string[];
  spotlit: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const [hot, setHot] = useState(false);
  const lit = hot || spotlit;
  return (
    <div
      tabIndex={0}
      role="group"
      aria-label={domain}
      onPointerEnter={() => {
        setHot(true);
        onEnter();
      }}
      onPointerLeave={() => {
        setHot(false);
        onLeave();
      }}
      onFocus={() => {
        setHot(true);
        onEnter();
      }}
      onBlur={() => {
        setHot(false);
        onLeave();
      }}
      className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
    >
      <GlassPanel
        className={`tile-glow h-full p-6 transition-shadow duration-500 md:p-7 ${
          lit ? "shadow-[inset_0_0_0_1px_var(--accent)]" : ""
        }`}
      >
        <p className="text-xs uppercase tracking-[0.18em] text-accent">{domain}</p>
        <div className="relative mt-4 grid min-h-[120px]">
          {/* rest face: skills */}
          <motion.ul
            initial={{ opacity: lit ? 0 : 1 }}
            animate={{ opacity: lit ? 0 : 1 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="col-start-1 row-start-1 space-y-1.5 text-sm text-muted"
          >
            {skills.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </motion.ul>
          {/* lit face: the belief */}
          <motion.p
            initial={{ opacity: lit ? 1 : 0 }}
            animate={{ opacity: lit ? 1 : 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            aria-hidden={!lit}
            className="col-start-1 row-start-1 text-base leading-snug md:text-lg"
          >
            {belief}
          </motion.p>
        </div>
      </GlassPanel>
    </div>
  );
}

export function BeliefsBento() {
  const ref = useRef<HTMLElement>(null);
  useSectionLight(ref, TEMP.messyMiddle, 0.35);
  const reduce = useReducedMotionSafe();
  const [spot, setSpot] = useState<number | null>(null);
  const pausedRef = useRef(false);

  // idle spotlight drifts tile to tile; any pointer/focus pauses it
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      if (pausedRef.current) return;
      setSpot((s) => (s === null ? 0 : (s + 1) % BENTO.domains.length));
    }, 3500);
    return () => clearInterval(id);
  }, [reduce]);

  const pause = () => {
    pausedRef.current = true;
    setSpot(null);
  };
  const resume = () => {
    pausedRef.current = false;
  };

  const gridRef = useRef<HTMLDivElement>(null);

  // Grid-level proximity glow: writes CSS custom properties directly on each
  // tile's DOM node (no React state) so pointermove never triggers a render.
  // Reading 6 rects per move is safe here because this handler performs no
  // layout WRITES (custom-property writes don't invalidate layout), and the
  // rects must be read fresh anyway since scrolling moves them.
  const onGridMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    gridRef.current
      ?.querySelectorAll<HTMLElement>(".tile-glow")
      .forEach((t) => {
        const r = t.getBoundingClientRect();
        const mx = e.clientX - r.left;
        const my = e.clientY - r.top;
        const dist = Math.hypot(mx - r.width / 2, my - r.height / 2);
        t.style.setProperty("--mx", `${mx}px`);
        t.style.setProperty("--my", `${my}px`);
        t.style.setProperty("--md", String(Math.max(0, 1 - dist / 320)));
      });
  };
  const onGridLeave = () => {
    gridRef.current
      ?.querySelectorAll<HTMLElement>(".tile-glow")
      .forEach((t) => t.style.setProperty("--md", "0"));
  };

  return (
    <section id="how" ref={ref} className="mx-auto max-w-content px-6 py-28 md:px-10 md:py-36">
      <QuestionHeading className="max-w-[15ch]">{BENTO.question}</QuestionHeading>

      <div
        ref={gridRef}
        className="relative mt-14"
        onPointerEnter={pause}
        onPointerMove={onGridMove}
        onPointerLeave={() => {
          resume();
          onGridLeave();
        }}
        onFocusCapture={pause}
        onBlurCapture={resume}
      >
        {/* M3: the thread draws the grid's bones as the bento enters */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden
          className="pointer-events-none absolute -inset-3 hidden h-[calc(100%+24px)] w-[calc(100%+24px)] overflow-visible md:block"
        >
          <motion.path
            d="M 0 50 L 100 50 M 33.5 0 L 33.5 100 M 67 0 L 67 100"
            stroke="var(--hf-champagne)"
            strokeWidth={0.3}
            initial={{ pathLength: reduce ? 1 : 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={reduce ? { duration: 0 } : { duration: 1.6, ease: "easeInOut" }}
          />
        </svg>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-6">
          {/* anchor tile */}
          <Reveal className="md:col-span-2">
            <GlassPanel className="tile-glow h-full p-6 md:p-7">
              <p className="text-xs uppercase tracking-[0.18em] text-muted">{BENTO.anchor.kicker}</p>
              <h3 className="mt-4 font-display text-2xl tracking-tight md:text-3xl">
                {BENTO.anchor.title}
              </h3>
              <p className="mt-3 leading-relaxed text-muted">{BENTO.anchor.body}</p>
            </GlassPanel>
          </Reveal>
          {BENTO.domains.map((d, i) => (
            <Reveal key={d.domain} delay={0.06 * (i + 1)} className="md:col-span-2">
              <DomainTile
                domain={d.domain}
                belief={d.belief}
                skills={d.skills}
                spotlit={spot === i}
                onEnter={pause}
                onLeave={resume}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
