import { CASES, WORK } from "@/content/content";
import { QuestionHeading } from "@/components/ui/QuestionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CaseValley } from "./CaseValley";

export function Work() {
  return (
    <section id="work">
      <div className="mx-auto flex min-h-[70vh] max-w-content flex-col justify-center px-6 md:px-10">
        <QuestionHeading className="max-w-[18ch]">{WORK.question}</QuestionHeading>
        <Reveal delay={0.1}>
          <p className="mt-8 max-w-[44ch] text-lg leading-relaxed text-muted">
            {WORK.intro}
          </p>
        </Reveal>
      </div>
      <div className="space-y-[30vh]">
        {CASES.map((c) => (
          <CaseValley key={c.id} c={c} />
        ))}
      </div>
    </section>
  );
}
