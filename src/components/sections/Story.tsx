"use client";
import { useRef } from "react";
import { STORY } from "@/content/content";
import { useSectionLight } from "@/components/light/LightProvider";
import { TEMP } from "@/lib/lightScript";
import { QuestionHeading } from "@/components/ui/QuestionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { GlassPanel } from "@/components/ui/GlassPanel";

const OFFSETS = ["md:mt-0", "md:mt-16", "md:mt-32"];

export function Story() {
  const ref = useRef<HTMLElement>(null);
  useSectionLight(ref, TEMP.story);

  return (
    <section id="story" ref={ref} className="mx-auto max-w-content px-6 py-32 md:px-10 md:py-44">
      <div className="flex justify-end">
        <QuestionHeading className="max-w-[14ch] text-right">
          {STORY.question}
        </QuestionHeading>
      </div>

      <div className="mt-24 grid grid-cols-1 gap-8 md:grid-cols-3">
        {STORY.moments.map((m, i) => (
          <Reveal key={m.title} delay={i * 0.08} className={OFFSETS[i]}>
            <GlassPanel className="h-full p-7 md:p-8">
              <p className="font-display text-2xl tracking-tight">{m.title}</p>
              <p className="mt-4 leading-relaxed text-muted">{m.body}</p>
            </GlassPanel>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-24 md:mt-32">
        <p className="max-w-[26ch] font-display text-3xl leading-snug tracking-tight md:text-5xl">
          {STORY.close}
        </p>
      </Reveal>
    </section>
  );
}
