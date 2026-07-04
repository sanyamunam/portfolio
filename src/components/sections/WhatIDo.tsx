"use client";
import { useRef } from "react";
import { WHAT_I_DO } from "@/content/content";
import { useSectionLight } from "@/components/light/LightProvider";
import { TEMP } from "@/lib/lightScript";
import { QuestionHeading } from "@/components/ui/QuestionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { GlassPanel } from "@/components/ui/GlassPanel";

export function WhatIDo() {
  const ref = useRef<HTMLElement>(null);
  useSectionLight(ref, TEMP.whatIDo);
  const b = WHAT_I_DO.brief;

  return (
    <section
      id="what"
      ref={ref}
      className="mx-auto max-w-content px-6 py-32 md:px-10 md:py-44"
    >
      {/* The question owns the upper-right (anchors vary per beat) */}
      <div className="flex justify-end">
        <QuestionHeading className="max-w-[16ch] text-right">
          {WHAT_I_DO.question}
        </QuestionHeading>
      </div>

      <div className="mt-20 grid grid-cols-1 gap-12 md:mt-28 md:grid-cols-[1.4fr_1fr] md:gap-16">
        <div className="space-y-6">
          {WHAT_I_DO.answer.map((p, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p className="max-w-[52ch] text-xl leading-relaxed md:text-2xl">
                {p}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <GlassPanel className="p-7 md:p-8">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">
              {b.heading}
            </p>
            <h3 className="mt-5 font-display text-2xl tracking-tight">{b.name}</h3>
            <ul aria-label="Roles" className="mt-3 space-y-1 text-sm text-muted">
              {b.roles.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <p className="mt-5 text-sm">{b.base}</p>
            <ul
              aria-label="Focus areas"
              className="mt-5 flex flex-wrap gap-x-3 gap-y-2 border-t pt-5 text-sm text-muted [border-color:var(--edge)]"
            >
              {b.focus.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </GlassPanel>
        </Reveal>
      </div>
    </section>
  );
}
