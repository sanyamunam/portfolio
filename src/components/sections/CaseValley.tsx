"use client";
import { useRef } from "react";
import {
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import type { CaseStudy } from "@/content/content";
import { useLight } from "@/components/light/LightProvider";
import { Reveal } from "@/components/ui/Reveal";
import { ThreadSegment } from "@/components/thread/ThreadSegment";
import { LiveFrame, ConfidentialFrame } from "./CaseMediaFrames";

/**
 * One case = one light valley. The passage's scroll progress drives the
 * temperature: ambient ember -> case depth (mess) -> back to warm (resolution).
 */
export function CaseValley({ c }: { c: CaseStudy }) {
  const ref = useRef<HTMLElement>(null);
  const { temp } = useLight();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.75", "end 0.55"],
  });
  const valley = useTransform(
    scrollYProgress,
    [0, 0.4, 0.8, 1],
    [1.1, c.depth, 0.8, 0.5]
  );
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    // Steer the light only while this case is the active passage. The gate
    // closes at 0.95 (not ~1) so this writer goes quiet BEFORE the next
    // beat's in-view trigger fires — two writers on the same frame strobe
    // the atmosphere (seen at the Kahramaa -> MessyMiddle seam).
    if (p > 0.001 && p < 0.95) temp.set(valley.get());
  });

  return (
    <article ref={ref} className="relative" aria-label={`Case study: ${c.client}`}>
      {/* header */}
      <header className="mx-auto flex min-h-[40vh] max-w-content flex-col justify-end px-6 pb-10 md:px-10">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">
            {c.n} · {c.tag}
          </p>
          <h3 className="mt-3 font-display text-4xl tracking-tight md:text-6xl">
            {c.client}
          </h3>
        </Reveal>
      </header>

      {/* the mess — the valley floor approaches */}
      <div className="relative mx-auto flex min-h-[85vh] max-w-content items-center px-6 md:px-10">
        <ThreadSegment
          variant="tangle"
          viewBox="0 0 320 500"
          className="absolute right-0 top-1/2 hidden h-[60vh] w-56 -translate-y-1/2 opacity-70 lg:block"
        />
        <div className="max-w-[46ch]">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">The mess</p>
          <Reveal>
            <p className="mt-5 text-2xl leading-relaxed md:text-3xl">{c.mess}</p>
          </Reveal>
        </div>
      </div>

      {/* the turn */}
      <div className="mx-auto flex min-h-[70vh] max-w-content items-center justify-end px-6 md:px-10">
        <div className="max-w-[44ch]">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">What I did</p>
          <Reveal>
            <p className="mt-5 text-xl leading-relaxed md:text-2xl">{c.turn}</p>
          </Reveal>
        </div>
      </div>

      {/* the resolution — light restored, clarity flash */}
      <div className="relative mx-auto grid min-h-[85vh] max-w-content items-center gap-10 px-6 py-16 md:grid-cols-[1fr_minmax(0,480px)] md:px-10">
        <ThreadSegment
          variant="smooth"
          stroke="var(--accent)"
          className="absolute left-0 top-1/2 hidden h-[55vh] w-32 -translate-y-1/2 opacity-80 lg:block"
        />
        <div className="max-w-[42ch] md:pl-24">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">
            What changed
          </p>
          <Reveal>
            <p className="mt-5 text-xl leading-relaxed md:text-2xl">
              {c.resolution}
            </p>
            <p className="mt-6 inline-block border-b pb-1 text-sm tracking-wide text-accent [border-color:var(--accent)]">
              {c.outcome}
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          {c.media ? (
            <LiveFrame url={c.url} media={c.media} />
          ) : (
            <ConfidentialFrame url={c.url} />
          )}
        </Reveal>
      </div>
    </article>
  );
}
