"use client";
import { useRef } from "react";
import { CASES, WORK, type CaseStudy } from "@/content/content";
import { useSectionLight } from "@/components/light/LightProvider";
import { QuestionHeading } from "@/components/ui/QuestionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { LiveFrame, ConfidentialFrame } from "@/components/sections/CaseMediaFrames";

function MobileCase({ c }: { c: CaseStudy }) {
  const ref = useRef<HTMLElement>(null);
  // each card sets the valley depth while centered, then the next warms/deepens
  useSectionLight(ref, c.depth, 0.35);
  return (
    <article ref={ref} aria-label={`Case study: ${c.client}`} className="glass p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-muted">
        {c.n} · {c.tag}
      </p>
      <h3 className="mt-2 font-display text-3xl tracking-tight">{c.client}</h3>
      <ul className="mt-5 space-y-1.5 border-l pl-4 [border-color:var(--edge)]">
        {c.fragments.map((f) => (
          <li key={f} className="text-base leading-snug">
            {f}
          </li>
        ))}
      </ul>
      <p className="mt-5 leading-relaxed text-muted">{c.turn}</p>
      <p className="mt-4 leading-relaxed">{c.resolution}</p>
      <p className="mt-4 inline-block border-b pb-1 text-sm tracking-wide text-accent [border-color:var(--accent)]">
        {c.outcome}
      </p>
      <div className="mt-6">
        {c.media ? <LiveFrame url={c.url} media={c.media} /> : <ConfidentialFrame url={c.url} />}
      </div>
    </article>
  );
}

export function WorkMobile() {
  return (
    <div className="mx-auto max-w-content space-y-10 px-6 py-24 md:hidden">
      <QuestionHeading className="max-w-[18ch]">{WORK.question}</QuestionHeading>
      <Reveal>
        <p className="max-w-[44ch] leading-relaxed text-muted">{WORK.intro}</p>
      </Reveal>
      {CASES.map((c) => (
        <MobileCase key={c.id} c={c} />
      ))}
    </div>
  );
}
