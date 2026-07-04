"use client";
import { useRef } from "react";
import { MESSY_MIDDLE } from "@/content/content";
import { useSectionLight } from "@/components/light/LightProvider";
import { TEMP } from "@/lib/lightScript";
import { QuestionHeading } from "@/components/ui/QuestionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { GlassPanel } from "@/components/ui/GlassPanel";

export function MessyMiddle() {
  const ref = useRef<HTMLElement>(null);
  // This beat is much taller than the viewport (five beliefs at 45vh apart),
  // so the default 0.4 "in view" threshold can never be satisfied — use a
  // smaller amount that's achievable once the reader is inside the section.
  useSectionLight(ref, TEMP.messyMiddle, 0.12);

  return (
    <section id="how" ref={ref} className="mx-auto max-w-content px-6 py-32 md:px-10 md:py-44">
      <QuestionHeading className="max-w-[15ch]">
        {MESSY_MIDDLE.question}
      </QuestionHeading>

      {/* five beliefs, one at a time — a philosophy told slowly */}
      <div className="mt-24 space-y-[45vh] md:mt-32">
        {MESSY_MIDDLE.beliefs.map((b, i) => (
          <Reveal
            key={b.domain}
            className={i % 2 ? "flex justify-end" : undefined}
          >
            <div className="max-w-[38ch]">
              <p className="text-xs uppercase tracking-[0.18em] text-accent">
                {b.domain}
              </p>
              <p className="mt-4 text-2xl leading-snug md:text-4xl">
                {b.statement}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* the practical list — philosophy first, receipts after */}
      <Reveal className="mt-[35vh]">
        <GlassPanel className="p-8 md:p-10">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">
            {MESSY_MIDDLE.skillsHeading}
          </p>
          <p className="mt-2 text-sm italic text-muted">{MESSY_MIDDLE.skillsIntro}</p>
          <dl className="mt-8 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {MESSY_MIDDLE.skills.map((g) => (
              <div key={g.group}>
                <dt className="text-sm font-medium">{g.group}</dt>
                <dd className="mt-3 space-y-1.5 border-l pl-4 text-sm text-muted [border-color:var(--edge)]">
                  {g.items.map((s) => (
                    <p key={s}>{s}</p>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </GlassPanel>
      </Reveal>
    </section>
  );
}
