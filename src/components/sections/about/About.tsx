"use client";
import { useRef } from "react";
import { ABOUT } from "@/content/content";
import { useSectionLight } from "@/components/light/LightProvider";
import { TEMP } from "@/lib/lightScript";
import { QuestionHeading } from "@/components/ui/QuestionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { OriginVignettes } from "./OriginVignettes";
import { UntanglingMap } from "./UntanglingMap";

export function About() {
  const ref = useRef<HTMLElement>(null);
  // Tall section (~2 viewports): pass a reachable in-view amount (MessyMiddle lesson).
  useSectionLight(ref, TEMP.about, 0.25);
  const b = ABOUT.brief;

  return (
    <section id="about" ref={ref} className="mx-auto max-w-content px-6 py-28 md:px-10 md:py-36">
      {/* Movement 1 — the origin */}
      <OriginVignettes />

      {/* Movement 2 — the practice */}
      <div className="mt-28 md:mt-36">
        <div className="flex justify-end">
          <QuestionHeading className="max-w-[16ch] text-right">
            {ABOUT.practiceQuestion}
          </QuestionHeading>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-[1fr_1.5fr] md:gap-14">
          <div>
            <Reveal>
              <p className="max-w-[46ch] text-lg leading-relaxed md:text-xl">{ABOUT.answer}</p>
            </Reveal>
            <Reveal delay={0.12}>
              <GlassPanel className="mt-8 p-7">
                <p className="text-xs uppercase tracking-[0.16em] text-muted">{b.heading}</p>
                <h3 className="mt-4 font-display text-2xl tracking-tight">{b.name}</h3>
                <ul aria-label="Roles" className="mt-3 space-y-1 text-sm text-muted">
                  {b.roles.map((r) => (
                    <li key={r} className="transition-colors hover:text-ink">{r}</li>
                  ))}
                </ul>
                <p className="mt-4 text-sm">{b.base}</p>
                <ul
                  aria-label="Focus areas"
                  className="mt-4 flex flex-wrap gap-x-3 gap-y-2 border-t pt-4 text-sm text-muted [border-color:var(--edge)]"
                >
                  {b.focus.map((f) => (
                    <li key={f} className="transition-colors hover:text-ink">{f}</li>
                  ))}
                </ul>
              </GlassPanel>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <UntanglingMap />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
