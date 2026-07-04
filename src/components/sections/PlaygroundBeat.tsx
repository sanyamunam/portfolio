"use client";
import { useRef } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { PLAYGROUND } from "@/content/content";
import { useSectionLight } from "@/components/light/LightProvider";
import { TEMP } from "@/lib/lightScript";
import { QuestionHeading } from "@/components/ui/QuestionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { GlassPanel } from "@/components/ui/GlassPanel";

export function PlaygroundBeat() {
  const ref = useRef<HTMLElement>(null);
  useSectionLight(ref, TEMP.playground);

  return (
    <section id="play" ref={ref} className="mx-auto max-w-content px-6 py-32 md:px-10 md:py-44">
      <QuestionHeading className="max-w-[18ch]">
        {PLAYGROUND.question}
      </QuestionHeading>
      <Reveal delay={0.1}>
        <p className="mt-8 max-w-[44ch] text-lg leading-relaxed text-muted">
          {PLAYGROUND.intro}
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
        {PLAYGROUND.items.map((item, i) => {
          const inner = (
            <>
              <div className="flex items-start justify-between gap-4">
                <p className="text-xs uppercase tracking-[0.16em] text-muted">
                  {item.kicker}
                </p>
                {item.href && (
                  <ArrowUpRight
                    size={22}
                    className="shrink-0 text-muted transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1"
                    aria-hidden
                  />
                )}
                {item.comingSoon && (
                  <span className="shrink-0 rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-muted [border-color:var(--edge)]">
                    Coming soon
                  </span>
                )}
              </div>
              <div className="mt-14">
                <h3 className="font-display text-2xl tracking-tight md:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-[46ch] leading-relaxed text-muted">
                  {item.body}
                </p>
              </div>
            </>
          );
          return (
            <Reveal key={item.title} delay={i * 0.08} className={i === 0 ? "md:col-span-2" : ""}>
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block h-full"
                >
                  <GlassPanel className="pressable h-full p-7 md:p-9">{inner}</GlassPanel>
                </a>
              ) : (
                <GlassPanel className="h-full p-7 md:p-9">{inner}</GlassPanel>
              )}
            </Reveal>
          );
        })}

        <Reveal delay={0.16} className="md:col-span-3">
          <GlassPanel className="p-7 md:p-9">
            <p className="text-xs uppercase tracking-[0.16em] text-accent">
              {PLAYGROUND.aside.kicker}
            </p>
            <p className="mt-3 max-w-[60ch] text-xl leading-snug md:text-2xl">
              {PLAYGROUND.aside.text}
            </p>
          </GlassPanel>
        </Reveal>
      </div>
    </section>
  );
}
