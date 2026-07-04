# The Exhibition (V3.5) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the five middle beats of the shipped Golden Hour portfolio into distinct interactive installations (About with origin vignettes + untangling map, pinned case stage, glass bento, workbench pair) connected by the thread spine — per `docs/superpowers/specs/2026-07-04-exhibition-redesign-design.md`.

**Architecture:** Evolutionary rebuild on top of the preserved engines (Atmosphere, LightProvider, LightScript, glass, ThreadSegment gradient, hero untouched). New sections are data-driven client components; scroll-pinned stage uses Framer `useScroll` + in-place crossfades; all copy moves into new `content.ts` shapes. Old sections are deleted only in Task 9, after their replacements land — the site builds green after every task.

**Tech Stack:** Next.js 16.2.9 · React 19 · Tailwind v4 (CSS-first) · framer-motion 12 · Lenis. NO GSAP, NO WebGL.

---

## Context for the engineer (read first)

- Working dir: `C:\Users\user\OneDrive - applab.qa\Claude Projects\portfolio-v3`. Commit after every task (git identity configured; LF→CRLF warnings are normal, ignore them).
- Read `AGENTS.md`. Key rules: all copy in `src/content/content.ts`; every animation has a `useReducedMotion`/media-query fallback; animate only transform/opacity; one light-temperature motion value drives the atmosphere.
- Existing building blocks you MUST reuse (do not recreate): `@/components/ui/{Reveal,QuestionHeading,GlassPanel}`, `@/components/light/LightProvider` (`useLight`, `useSectionLight(ref, temp, amount?)`), `@/lib/lightScript` (`TEMP`, `sampleLight`), `@/lib/motion` (`EASE`), `@/components/thread/ThreadSegment` (variants tangle/smooth; default stroke = flowing `--hf-*` gradient; pass `stroke="var(--accent)"` for clarity moments), `@/components/sections/CaseMediaFrames` (`LiveFrame`, `ConfidentialFrame`), `@/components/sections/HeroIllustration` (hero — DO NOT MODIFY except where Task 9 says).
- Dev server: preview server name `portfolio-v3` (config in the PARENT directory's `.claude/launch.json` — NEVER create a local `.claude/launch.json`). If "another next dev server is already running": `taskkill /PID <pid> /F` per its error message.
- Preview harness gotchas (hard-won): the preview tab backgrounds itself between tool calls (`document.hidden === true`) freezing rAF/Framer — take a screenshot to foreground it, and assert END states, not mid-flight states. Console/network buffers replay STALE errors from fixed states — after a fresh reload use a marker (`console.error('M'+Date.now())`) and heed only entries after it. Use explicit `preview_resize` width/height. After ANY programmatic scroll wait ≥900ms (Lenis smooths). Screenshots may letterbox — trust DOM measurements for geometry.
- Static gates for every task: `npx tsc --noEmit && npm run lint && npm test && npm run build` — all clean before commit.

## File map

| File | Fate | Responsibility |
|---|---|---|
| `src/content/content.ts` | modify | + `ABOUT`, `BENTO`, `WORKBENCH`, `CaseStudy.fragments`; BEATS→6 (Task 4); old exports removed Task 9 |
| `src/lib/lightScript.ts` | modify | `TEMP.about` added; `TEMP.story`/`TEMP.whatIDo` removed Task 9 |
| `src/lib/useMagnetic.ts` | create | magnetic pull hook for CTAs |
| `src/components/ui/QuestionHeading.tsx` | modify | word-stagger kinetic reveal |
| `src/components/sections/about/OriginVignettes.tsx` | create | Movement 1: 3 glyph cards + bead thread + kinetic bridge |
| `src/components/sections/about/glyphs.tsx` | create | 3 hand-authored line glyphs (workshop/phone/book) |
| `src/components/sections/about/UntanglingMap.tsx` | create | Movement 2 visualization |
| `src/components/sections/about/About.tsx` | create | section assembly (id="about") |
| `src/components/sections/work/WorkStage.tsx` | create | pinned stage engine + desktop composition |
| `src/components/sections/work/StageThread.tsx` | create | M2 knot/straight thread |
| `src/components/sections/work/WorkMobile.tsx` | create | stacked mobile fallback |
| `src/components/sections/BeliefsBento.tsx` | create | Beat 3 glass bento |
| `src/components/sections/workbench/Workbench.tsx` | create | Beat 4 pair + aside |
| `src/components/sections/workbench/Typewriter.tsx` | create | isolated loop leaf |
| `src/components/sections/Greeting.tsx` | modify | M1 scrubbed tail stub (additive only) |
| `src/components/sections/Invitation.tsx` | modify | magnetic CTA |
| `src/app/globals.css` | modify | glass edge glow, strike animation |
| `src/app/page.tsx` | modify | new section order |
| `WhatIDo/Story/MessyMiddle/PlaygroundBeat/Work/CaseValley .tsx` | delete (Task 9) | replaced |

Beat order after this plan: `Greeting(#hello) → About(#about) → WorkStage(#work) → BeliefsBento(#how) → Workbench(#play) → Invitation(#talk)`.

---

### Task 1: Content model + light retarget (additive — old exports stay)

**Files:**
- Modify: `src/content/content.ts`
- Modify: `src/lib/lightScript.ts`

- [ ] **Step 1: Add `fragments` to `CaseStudy` and the four case entries**

In `content.ts`, add to the `CaseStudy` type after `mess: string;`:

```ts
  /** The mess distilled into 3-4 short shards for the stage's fragment stack. */
  fragments: string[];
```

Add to each entry in `CASES` (after its `mess` field):

qf:
```ts
    fragments: ["Her Highness’s office.", "Every decision examined.", "“Good enough” wasn’t.", "Many rooms, many opinions."],
```
qu:
```ts
    fragments: ["A full revamp to win.", "No screens to show.", "Only thinking."],
```
qbf:
```ts
    fragments: ["The international FIBA stage.", "A site that didn’t match it.", "Fans, officials — all watching."],
```
kahramaa:
```ts
    fragments: ["A national utility.", "Website, app, enterprise systems.", "Different eras, no shared language.", "The messiest it gets."],
```

- [ ] **Step 2: Add the new section exports to `content.ts`** (append after `INVITATION`, before `BEATS`; do NOT remove old exports yet)

```ts
export const ABOUT = {
  originQuestion: "Who taught you to see like this?",
  moments: [
    {
      glyph: "workshop" as const,
      title: "A workshop.",
      body: "My first design-thinking workshop. A room full of people who disagreed about everything — and a wall of sticky notes that slowly changed their minds. I walked out rearranged.",
    },
    {
      glyph: "phone" as const,
      title: "An app.",
      body: "Watching my dad use Google Pay for the first time. Two taps, and delight on his face. That’s when I felt what a really good interface can do to a person.",
    },
    {
      glyph: "book" as const,
      title: "A book.",
      body: "The Steve Jobs biography. It made me realise design isn’t decoration — it’s central to whether a product succeeds, and in turn the company behind it.",
    },
  ],
  bridge: "Mostly, I just love figuring out people.",
  practiceQuestion: "So… what do you actually do?",
  answer:
    "I untangle complicated things — products, teams, decisions — and stay with the mess until it makes sense to everyone. People call that UX strategy. I call it listening, drawing, and asking “why” once more than is polite.",
  mapStages: ["Listen", "Untangle", "Align", "Ship"],
  mapNodes: [
    { id: "stakeholders", label: "14 stakeholders", stage: 0 },
    { id: "interviews", label: "user interviews", stage: 0 },
    { id: "complaints", label: "support tickets", stage: 0 },
    { id: "vendors", label: "3 vendors", stage: 1 },
    { id: "legacy", label: "legacy systems", stage: 1 },
    { id: "kpis", label: "conflicting KPIs", stage: 1 },
    { id: "owner", label: "no single owner", stage: 2 },
    { id: "workshop", label: "one workshop", stage: 2 },
    { id: "decision", label: "one decision", stage: 2 },
    { id: "roadmap", label: "a roadmap", stage: 3 },
    { id: "design-system", label: "a design system", stage: 3 },
    { id: "ship", label: "something shipped", stage: 3 },
  ],
  replayLabel: "make it messy again",
};

export const BENTO = {
  question: "How do you handle the messy middle?",
  anchor: {
    kicker: "The practical list",
    title: "Five disciplines, one loop.",
    body: "I don’t hand off between these. I carry the same problem through all five — that’s the whole trick.",
  },
  domains: [
    {
      domain: "Discovery",
      belief:
        "Fall in love with the problem before anyone mentions solutions. The first version of the problem is almost never the real one.",
      skills: ["UX Research", "Requirement Gathering", "Information Architecture"],
    },
    {
      domain: "Strategy",
      belief: "A strategy you can’t sketch on a whiteboard isn’t a strategy. It’s a document.",
      skills: ["UX Strategy", "Product Thinking", "Design Thinking"],
    },
    {
      domain: "Alignment",
      belief:
        "Alignment isn’t agreement. It’s everyone understanding the same thing well enough to argue productively.",
      skills: ["Stakeholder Workshops", "Client Communication", "Facilitation"],
    },
    {
      domain: "Leadership & Ops",
      belief:
        "Teams do their best work when the process disappears. Design ops is making the machine so quiet nobody notices it running.",
      skills: ["Managing Design Teams", "Design Operations", "Design Systems"],
    },
    {
      domain: "AI & Systems",
      belief:
        "AI doesn’t replace the thinking. It replaces the waiting between thoughts — I design workflows where it does exactly that.",
      skills: ["AI-assisted Product Design", "AI Workflow Design", "Digital Transformation"],
    },
  ],
};

export const WORKBENCH = {
  question: "And what do you make when nobody’s paying you?",
  intro: "Side projects are how I figure out what I actually think. Two I’m fond of:",
  playbook: {
    kicker: "Guide · Designing with AI",
    title: "Prompt Playbook",
    body: "A read-it-once playbook for writing prompts that generate client-ready UI — written because I got tired of explaining it one designer at a time.",
    href: "/prompt-playbook.html",
    chromeLabel: "prompt-playbook.html",
    cta: "Open the playbook",
    typewriter: [
      "Act as a senior product designer…",
      "Generate a client-ready dashboard…",
      "Refine the empty state copy…",
      "Audit this flow for friction…",
    ],
  },
  wip: {
    kicker: "Reference · In the making",
    title: "Laws of UX",
    body: "My running collection of the principles I keep reaching for — mostly so I stop quoting them from memory and getting them slightly wrong.",
    note: "still on the workbench — coming soon",
    laws: ["Hick’s Law", "Fitts’s Law", "Jakob’s Law", "Miller’s Law", "Peak–End Rule", "Aesthetic–Usability Effect"],
  },
  aside: {
    kicker: "Quietly proud of",
    text: "I keep a list of features I’ve talked teams out of building. It’s some of my best work.",
    strikes: ["a chatbot nobody asked for", "a nine-field signup form", "a dashboard for the dashboard"],
  },
};
```

- [ ] **Step 3: Add `TEMP.about` in `src/lib/lightScript.ts`**

In the `TEMP` object add one line (keep all existing keys — old sections still reference them until Task 9):

```ts
  about: 0.3,
```

- [ ] **Step 4: Verify + commit**

Run: `npx tsc --noEmit && npm run lint && npm test && npm run build` — all clean (12 tests pass; TEMP range test covers the new key automatically).

```bash
git add src/content/content.ts src/lib/lightScript.ts
git commit -m "feat: content shapes for the Exhibition — about, bento, workbench, case fragments"
```

---

### Task 2: Global primitives — kinetic QuestionHeading, magnetic hook, glass edge glow

**Files:**
- Modify: `src/components/ui/QuestionHeading.tsx`
- Create: `src/lib/useMagnetic.ts`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Rewrite `src/components/ui/QuestionHeading.tsx`** (same public API — `{children, className}` — so all call sites keep working; children must be a plain string, which every current call site passes):

```tsx
"use client";
import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/lib/motion";

/**
 * The interviewer's voice — words arrive one by one, like the question is
 * being asked, not printed. Children must be a plain string (all copy comes
 * from content.ts).
 */
export function QuestionHeading({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const words = children.split(" ");
  return (
    <motion.h2
      initial={reduce ? "hidden" : "hidden"}
      whileInView="shown"
      viewport={{ once: true, amount: 0.5 }}
      transition={{ staggerChildren: reduce ? 0 : 0.07 }}
      className={`font-display text-4xl leading-[1.05] tracking-tight text-balance md:text-6xl lg:text-7xl ${className}`}
    >
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          className="inline-block whitespace-pre"
          variants={{
            hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 26, filter: "blur(6px)" },
            shown: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 0.55, ease: EASE },
            },
          }}
        >
          {w}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </motion.h2>
  );
}
```

Note: `staggerChildren` must live on the parent's `transition`; variants propagate `hidden`/`shown` to children automatically.

- [ ] **Step 2: Create `src/lib/useMagnetic.ts`**

```ts
"use client";
import { useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { PointerEvent } from "react";

/**
 * Magnetic pull: the element leans toward the cursor by up to `strength` px.
 * Spread the returned handlers on the element and pass x/y to motion style.
 * No-ops under reduced motion or coarse pointers.
 */
export function useMagnetic(strength = 6) {
  const reduce = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 150, damping: 18 });
  const y = useSpring(rawY, { stiffness: 150, damping: 18 });

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    rawX.set(((e.clientX - (r.left + r.width / 2)) / r.width) * 2 * strength);
    rawY.set(((e.clientY - (r.top + r.height / 2)) / r.height) * 2 * strength);
  };
  const onPointerLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return { x, y, handlers: { onPointerMove, onPointerLeave } };
}
```

- [ ] **Step 3: Glass edge glow + strike animation in `globals.css`**

Replace the `.glass` rule's `box-shadow` line so the material carries a faint interior glow of the world's light (temperature-reactive because `--glow-a` grades):

```css
.glass {
  background: var(--glass);
  border: 1px solid var(--edge);
  box-shadow:
    inset 0 1px 0 var(--edge),
    inset 0 0 22px color-mix(in oklab, var(--glow-a) 10%, transparent);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-radius: 1.25rem;
}
```

Append at the end of the file:

```css
/* Workbench aside: features she talked teams out of — struck through, one by one */
.strike-line {
  position: relative;
}
.strike-line::after {
  content: "";
  position: absolute;
  left: 0;
  top: 55%;
  height: 1.5px;
  width: 100%;
  background: var(--muted);
  transform: scaleX(var(--strike, 0));
  transform-origin: left center;
  transition: transform 0.6s var(--ease);
}
```

- [ ] **Step 4: Verify + commit**

`npx tsc --noEmit && npm run lint && npm test && npm run build` clean. Start/reuse preview `portfolio-v3`, reload, screenshot: question headings now reveal word-by-word (end state identical); glass panels show a faint warm interior glow. No console errors after a fresh-reload marker.

```bash
git add src/components/ui/QuestionHeading.tsx src/lib/useMagnetic.ts src/app/globals.css
git commit -m "feat: kinetic word-stagger headings, magnetic hook, temperature-reactive glass"
```

---

### Task 3: About Movement 1 — origin vignettes with line glyphs

**Files:**
- Create: `src/components/sections/about/glyphs.tsx`
- Create: `src/components/sections/about/OriginVignettes.tsx`

- [ ] **Step 1: Create `src/components/sections/about/glyphs.tsx`** — three hand-authored line glyphs in the hero's stroke language, each a draw-on `motion.path` set. All strokes `var(--ink)`, thin details 1.4, main 2:

```tsx
"use client";
import { motion, useReducedMotion } from "framer-motion";

type GlyphName = "workshop" | "phone" | "book";

/** [d, strokeWidth][] per glyph — drawn in order. viewBox 0 0 64 64. */
const GLYPHS: Record<GlyphName, [string, number][]> = {
  workshop: [
    // board
    ["M 8 12 L 56 12 L 56 46 L 8 46 Z", 2],
    // sticky notes: three straight, one tilted (the opinion that moved)
    ["M 14 18 h 9 v 9 h -9 Z", 1.4],
    ["M 28 18 h 9 v 9 h -9 Z", 1.4],
    ["M 42 18 h 9 v 9 h -9 Z", 1.4],
    ["M 26 32 l 9 -2 l 2 9 l -9 2 Z", 1.4],
    // easel legs
    ["M 18 46 L 12 58 M 46 46 L 52 58", 2],
  ],
  phone: [
    // phone body
    ["M 22 6 h 20 q 4 0 4 4 v 44 q 0 4 -4 4 h -20 q -4 0 -4 -4 v -44 q 0 -4 4 -4", 2],
    // the tap: fingertip ring + delight sparks
    ["M 32 32 m -5 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0", 1.4],
    ["M 44 20 l 4 -4 M 47 28 l 5 0 M 40 14 l 1 -5", 1.4],
    // the tick of a payment landing
    ["M 28 33 l 3 3 l 6 -7", 2],
  ],
  book: [
    // open spread
    ["M 32 14 C 24 8, 12 8, 8 12 L 8 48 C 12 44, 24 44, 32 50 C 40 44, 52 44, 56 48 L 56 12 C 52 8, 40 8, 32 14", 2],
    // spine
    ["M 32 14 L 32 50", 1.4],
    // two lines of the idea sinking in
    ["M 14 22 C 20 20, 24 20, 27 22 M 14 30 C 20 28, 24 28, 27 30", 1.4],
    ["M 37 22 C 42 20, 47 20, 50 22", 1.4],
  ],
};

export function Glyph({ name, delay = 0 }: { name: GlyphName; delay?: number }) {
  const reduce = useReducedMotion();
  const paths = GLYPHS[name];
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-14 w-14 overflow-visible" aria-hidden>
      {paths.map(([d, w], i) => (
        <motion.path
          key={d}
          d={d}
          stroke="var(--ink)"
          strokeWidth={w}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: reduce ? 1 : 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={
            reduce ? { duration: 0 } : { delay: delay + i * 0.18, duration: 0.5, ease: "easeInOut" }
          }
        />
      ))}
    </svg>
  );
}
```

- [ ] **Step 2: Create `src/components/sections/about/OriginVignettes.tsx`**

```tsx
"use client";
import { motion, useReducedMotion } from "framer-motion";
import { ABOUT } from "@/content/content";
import { EASE } from "@/lib/motion";
import { QuestionHeading } from "@/components/ui/QuestionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Glyph } from "./glyphs";

/** M1: the thread strings the three origin moments like beads. */
function BeadThread() {
  const reduce = useReducedMotion();
  return (
    <svg
      viewBox="0 0 1200 120"
      fill="none"
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-8 hidden h-24 w-full overflow-visible md:block"
      preserveAspectRatio="none"
    >
      <motion.path
        d="M 1190 8 C 1000 30, 900 90, 760 70 C 640 54, 560 92, 430 72 C 320 56, 220 96, 60 78"
        stroke="var(--hf-orchid)"
        strokeWidth={1.5}
        strokeLinecap="round"
        initial={{ pathLength: reduce ? 1 : 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={reduce ? { duration: 0 } : { duration: 1.6, ease: "easeInOut" }}
      />
    </svg>
  );
}

export function OriginVignettes() {
  const reduce = useReducedMotion();
  return (
    <div className="relative">
      <QuestionHeading className="max-w-[15ch]">{ABOUT.originQuestion}</QuestionHeading>

      <div className="relative mt-14">
        <BeadThread />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {ABOUT.moments.map((m, i) => (
            <Reveal key={m.title} delay={i * 0.1} className={["md:mt-0", "md:mt-10", "md:mt-4"][i]}>
              <GlassPanel className="h-full p-7">
                <Glyph name={m.glyph} delay={0.3 + i * 0.25} />
                <h3 className="mt-5 font-display text-2xl tracking-tight">{m.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{m.body}</p>
              </GlassPanel>
            </Reveal>
          ))}
        </div>
      </div>

      {/* the bridge into Movement 2 — kinetic words */}
      <motion.p
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.6 }}
        transition={{ staggerChildren: reduce ? 0 : 0.06 }}
        className="mt-16 max-w-[26ch] font-display text-3xl leading-snug tracking-tight md:text-4xl"
      >
        {ABOUT.bridge.split(" ").map((w, i, arr) => (
          <motion.span
            key={`${w}-${i}`}
            className="inline-block whitespace-pre"
            variants={{
              hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 18 },
              shown: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
            }}
          >
            {w}
            {i < arr.length - 1 ? " " : ""}
          </motion.span>
        ))}
      </motion.p>
    </div>
  );
}
```

- [ ] **Step 3: Verify statically** — `npx tsc --noEmit && npm run lint` clean (component not yet mounted; Task 4 assembles the section).

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/about
git commit -m "feat: origin vignettes — three influences with self-drawing line glyphs"
```

---

### Task 4: About Movement 2 — the Untangling Map + section assembly + nav retarget

**Files:**
- Create: `src/components/sections/about/UntanglingMap.tsx`
- Create: `src/components/sections/about/About.tsx`
- Modify: `src/app/page.tsx` (About replaces WhatIDo AND Story in the order; old components stay importable until Task 9 but are no longer rendered)
- Modify: `src/content/content.ts` (BEATS → 6 nodes)

- [ ] **Step 1: Create `src/components/sections/about/UntanglingMap.tsx`**

Design: 12 node chips positioned at their ORGANIZED spots (4 stage columns × 3 rows, % coordinates). The messy state is a per-node transform delta (dx/dy/rotate) that animates to zero when the map organizes. Two SVG connector layers (tangled/straight) crossfade. Cursor proximity nudges chips (fine pointers only). A replay control scatters and re-organizes.

```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ABOUT } from "@/content/content";
import { EASE } from "@/lib/motion";

/** Organized layout: column per stage, 3 rows. Percent coordinates. */
const COL_X = [10, 37, 63, 90];
const ROW_Y = [18, 50, 82];
/** Messy deltas per node index: dx%, dy%, rotate deg (deterministic chaos). */
const MESS: [number, number, number][] = [
  [22, 30, -14], [45, 8, 9], [30, 52, -6], [-8, 38, 12], [18, -6, -9],
  [38, 26, 15], [-14, 12, -12], [8, 44, 7], [-20, -4, -15], [-32, 20, 10],
  [-12, 36, -8], [-40, 6, 13],
];

export function UntanglingMap() {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const [organized, setOrganized] = useState(reduce);
  const [seen, setSeen] = useState(false);

  // organize once, shortly after first entering view
  useEffect(() => {
    if (reduce || seen) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          const t = setTimeout(() => setOrganized(true), 900);
          io.disconnect();
          return () => clearTimeout(t);
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce, seen]);

  const replay = () => {
    if (reduce) return;
    setOrganized(false);
    setTimeout(() => setOrganized(true), 1100);
  };

  return (
    <div ref={ref} className="relative">
      {/* connectors: tangled ↔ straight crossfade */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      >
        <motion.g
          animate={{ opacity: organized ? 0 : 1 }}
          transition={{ duration: 0.9, ease: EASE }}
          stroke="var(--hf-orchid)"
          strokeWidth={0.35}
        >
          <path d="M 30 45 C 60 10, 20 80, 75 30 C 95 12, 40 95, 12 60 C 0 42, 70 70, 55 20" />
          <path d="M 20 25 C 70 55, 30 5, 80 70 C 95 88, 15 80, 45 40" />
        </motion.g>
        <motion.g
          animate={{ opacity: organized ? 1 : 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: organized ? 0.5 : 0 }}
          stroke="var(--hf-champagne)"
          strokeWidth={0.35}
        >
          <path d="M 10 18 L 90 18 M 10 50 L 90 50 M 10 82 L 90 82" />
        </motion.g>
      </svg>

      <div className="relative grid h-[380px] md:h-[420px]">
        {ABOUT.mapNodes.map((n, i) => {
          const col = COL_X[n.stage];
          const row = ROW_Y[i % 3];
          const [dx, dy, rot] = MESS[i];
          return (
            <motion.div
              key={n.id}
              className="glass absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-4 py-2 text-xs tracking-wide md:text-sm"
              style={{ left: `${col}%`, top: `${row}%` }}
              animate={
                organized
                  ? { x: "0%", y: "0%", rotate: 0 }
                  : { x: `${dx}%`, y: `${dy}%`, rotate: rot }
              }
              transition={{ duration: 1.0, ease: EASE, delay: i * 0.045 }}
            >
              {n.label}
            </motion.div>
          );
        })}
      </div>

      {/* stage labels appear once organized */}
      <motion.div
        aria-hidden
        animate={{ opacity: organized ? 1 : 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="mt-4 hidden grid-cols-4 md:grid"
      >
        {ABOUT.mapStages.map((s) => (
          <p key={s} className="text-center text-xs uppercase tracking-[0.18em] text-muted">
            {s}
          </p>
        ))}
      </motion.div>

      {!reduce && (
        <button
          type="button"
          onClick={replay}
          className="pressable mt-4 text-sm italic text-muted underline-offset-4 hover:underline"
        >
          {ABOUT.replayLabel}
        </button>
      )}

      {/* screen-reader mirror */}
      <ul className="sr-only">
        {ABOUT.mapStages.map((s, si) => (
          <li key={s}>
            {s}: {ABOUT.mapNodes.filter((n) => n.stage === si).map((n) => n.label).join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

Note on the chips' `x`/`y`: percentages there are relative to the CHIP size (small) — the messy scatter therefore reads as local jitter around each column. After mounting, eyeball it in the preview; if the mess reads too tame, multiply the MESS dx/dy values ×3 (they are intentionally tunable constants).

- [ ] **Step 2: Create `src/components/sections/about/About.tsx`**

```tsx
"use client";
import { useRef } from "react";
import { ABOUT, WHAT_I_DO } from "@/content/content";
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
  const b = WHAT_I_DO.brief;

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
```

(`WHAT_I_DO.brief` is still exported until Task 9, which moves the brief data into `ABOUT` and deletes the old export — see Task 9 Step 2.)

- [ ] **Step 3: Update `src/app/page.tsx`** — replace `<WhatIDo />` with `<About />` and REMOVE `<Story />` from the render (delete both old import lines, add `import { About } from "@/components/sections/about/About";`). Order: `Greeting, About, Work, MessyMiddle, PlaygroundBeat, Invitation`.

- [ ] **Step 4: Update `BEATS` in `content.ts`** to six nodes:

```ts
export const BEATS = [
  { id: "hello", label: "Hello" },
  { id: "about", label: "About Sanya" },
  { id: "work", label: "Real life" },
  { id: "how", label: "The messy middle" },
  { id: "play", label: "Playground" },
  { id: "talk", label: "Say hello" },
] as const;
```

- [ ] **Step 5: Verify visually** (preview `portfolio-v3`, 1280x800, fresh reload + marker): vignettes draw their glyphs; bead thread draws; bridge line staggers in; map scatters then organizes ~0.9s after entering view; "make it messy again" replays; brief card hovers work; ThreadNav shows 6 nodes and `about` tracks. Mobile 375: single column, no horizontal scroll, map chips readable. Static gates clean.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: About Sanya — origin then practice, untangling map, six-beat nav"
```

---

### Task 5: WorkStage engine — pinned stage, phases, light scrub

**Files:**
- Create: `src/components/sections/work/WorkStage.tsx`
- Create: `src/components/sections/work/StageThread.tsx`

The engine contract (used by everything below):

- Section is `h-[420vh]`; inner `sticky top-0 h-screen overflow-hidden`.
- `useScroll({ target: sectionRef, offset: ["start start", "end end"] })` → progress `p ∈ [0,1]`.
- Case windows: `CASE_SPAN = 0.24`, `CASE_STRIDE = 0.253` → case `i` active on `[i*0.253, i*0.253 + 0.24]`; the ~0.013 gaps are breathers (stage empties).
- Phases within a case (local `l ∈ [0,1]`): `mess` `< 0.38`, `turn` `< 0.7`, else `resolve`.
- Light: inside a window, `temp.set(valleyTemp(l, depth))` with `valleyTemp = interpolate [0, 0.38, 0.8, 1] → [1.1, depth, 0.75, 0.55]`; outside all windows, don't write (spring holds — the proven CaseValley gate pattern).

- [ ] **Step 1: Create `src/components/sections/work/StageThread.tsx`** (M2 — knots behind the stage):

```tsx
"use client";
import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";

type Phase = "mess" | "turn" | "resolve";

/** Horizontal thread behind the stage: knotted in the mess, straight at resolve. */
export function StageThread({ phase }: { phase: Phase }) {
  const knotted = phase === "mess";
  return (
    <svg
      viewBox="0 0 1200 160"
      fill="none"
      aria-hidden
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 bottom-[18%] h-40 w-full overflow-visible opacity-70"
    >
      <motion.path
        d="M -20 80 C 200 80, 300 20, 420 90 C 500 135, 460 30, 560 60 C 660 90, 620 130, 720 80 C 840 20, 900 130, 1000 80 L 1220 80"
        stroke="var(--hf-orchid)"
        strokeWidth={1.5}
        strokeLinecap="round"
        animate={{ opacity: knotted ? 1 : 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      />
      <motion.path
        d="M -20 80 L 1220 80"
        strokeWidth={1.5}
        strokeLinecap="round"
        animate={{
          opacity: knotted ? 0 : 1,
          stroke: phase === "resolve" ? "var(--accent)" : "var(--hf-champagne)",
        }}
        transition={{ duration: 0.7, ease: EASE }}
      />
    </svg>
  );
}
```

- [ ] **Step 2: Create `src/components/sections/work/WorkStage.tsx`** (desktop engine + composition; mobile arrives in Task 6):

```tsx
"use client";
import { useRef, useState } from "react";
import type Lenis from "lenis";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { CASES, WORK } from "@/content/content";
import { useLight } from "@/components/light/LightProvider";
import { EASE } from "@/lib/motion";
import { QuestionHeading } from "@/components/ui/QuestionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { LiveFrame, ConfidentialFrame } from "@/components/sections/CaseMediaFrames";
import { StageThread } from "./StageThread";

export type Phase = "mess" | "turn" | "resolve";
const CASE_SPAN = 0.24;
const CASE_STRIDE = 0.253;

function locate(p: number): { idx: number; local: number } | null {
  for (let i = 0; i < CASES.length; i++) {
    const start = i * CASE_STRIDE;
    if (p >= start && p <= start + CASE_SPAN) return { idx: i, local: (p - start) / CASE_SPAN };
  }
  return null;
}
function phaseOf(local: number): Phase {
  return local < 0.38 ? "mess" : local < 0.7 ? "turn" : "resolve";
}
function valleyTemp(local: number, depth: number): number {
  const xs = [0, 0.38, 0.8, 1];
  const ys = [1.1, depth, 0.75, 0.55];
  for (let s = 0; s < xs.length - 1; s++) {
    if (local <= xs[s + 1]) {
      const f = (local - xs[s]) / (xs[s + 1] - xs[s]);
      return ys[s] + (ys[s + 1] - ys[s]) * f;
    }
  }
  return ys[ys.length - 1];
}

/** Deterministic fragment scatter (offset %, rotate deg) by index. */
const FRAG_POSE: [number, number, number][] = [
  [-6, -12, -5], [10, 6, 4], [-12, 14, 3], [8, -18, -3],
];

export function WorkStage() {
  const sectionRef = useRef<HTMLElement>(null);
  const { temp } = useLight();
  const reduce = useReducedMotion() ?? false;
  const [active, setActive] = useState<{ idx: number; phase: Phase } | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const loc = locate(p);
    if (loc && p > 0.001 && p < 0.999) {
      temp.set(valleyTemp(loc.local, CASES[loc.idx].depth));
      const next = { idx: loc.idx, phase: phaseOf(loc.local) };
      setActive((cur) =>
        cur && cur.idx === next.idx && cur.phase === next.phase ? cur : next
      );
    } else if (!loc) {
      setActive((cur) => (cur === null ? cur : null)); // breather: stage empties
    }
  });

  const jumpTo = (i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const span = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const target = top + (i * CASE_STRIDE + 0.02) * span;
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (lenis) lenis.scrollTo(target, { duration: 1.2 });
    else window.scrollTo({ top: target, behavior: reduce ? "auto" : "smooth" });
  };

  const c = active ? CASES[active.idx] : null;
  const mediaTilt = useTransform(scrollYProgress, (p) => {
    const loc = locate(p);
    if (!loc || reduce) return 0;
    return loc.local < 0.38 ? -6 : loc.local < 0.7 ? -3 : 0;
  });

  return (
    <section id="work" ref={sectionRef} className="relative hidden md:block md:h-[420vh]">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <div className="mx-auto w-full max-w-content px-10 pt-10">
          <QuestionHeading className="max-w-[18ch] !text-3xl lg:!text-4xl">
            {WORK.question}
          </QuestionHeading>
        </div>

        <div className="relative mx-auto grid w-full max-w-content flex-1 grid-cols-[180px_minmax(0,1fr)_minmax(0,420px)] items-center gap-10 px-10 pb-14">
          <StageThread phase={active?.phase ?? "resolve"} />

          {/* left rail */}
          <nav aria-label="Case studies" className="relative z-10 space-y-5">
            {CASES.map((cs, i) => {
              const current = active?.idx === i;
              return (
                <button
                  key={cs.id}
                  type="button"
                  onClick={() => jumpTo(i)}
                  aria-current={current ? "true" : undefined}
                  className="pressable block text-left"
                >
                  <span
                    className={`text-xs tracking-[0.18em] transition-colors duration-300 ${
                      current ? "text-accent" : "text-muted"
                    }`}
                  >
                    {cs.n}
                  </span>
                  <span
                    className={`block text-sm transition-colors duration-300 ${
                      current ? "text-ink" : "text-muted"
                    }`}
                  >
                    {cs.client}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* center narrative: crossfades in place */}
          <div className="relative z-10 grid min-h-[380px]">
            <AnimatePresence mode="wait" initial={false}>
              {c && active && (
                <motion.div
                  key={`${active.idx}-${active.phase}`}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -14 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="col-start-1 row-start-1 self-center"
                >
                  {active.phase === "mess" && (
                    <div className="relative min-h-[300px]">
                      <p className="text-xs uppercase tracking-[0.18em] text-muted">The mess</p>
                      <div className="relative mt-6">
                        {c.fragments.map((f, fi) => {
                          const [dx, dy, rot] = FRAG_POSE[fi % FRAG_POSE.length];
                          return (
                            <motion.p
                              key={f}
                              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.15 + fi * 0.12, duration: 0.5, ease: EASE }}
                              style={
                                reduce
                                  ? undefined
                                  : { transform: `translate(${dx}%, ${dy}%) rotate(${rot}deg)` }
                              }
                              className="glass mb-4 inline-block px-6 py-4 font-display text-xl tracking-tight lg:text-2xl"
                            >
                              {f}
                            </motion.p>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {active.phase === "turn" && (
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted">What I did</p>
                      <p className="mt-6 max-w-[44ch] text-xl leading-relaxed lg:text-2xl">{c.turn}</p>
                    </div>
                  )}
                  {active.phase === "resolve" && (
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted">What changed</p>
                      <p className="mt-6 max-w-[42ch] text-xl leading-relaxed lg:text-2xl">
                        {c.resolution}
                      </p>
                      <p className="mt-6 inline-block border-b pb-1 text-sm tracking-wide text-accent [border-color:var(--accent)]">
                        {c.outcome}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* media panel: keyed by case only, tilts by phase */}
          <div className="relative z-10 [perspective:1200px]">
            <AnimatePresence mode="wait" initial={false}>
              {c && (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ rotateY: mediaTilt }}
                >
                  {c.media ? <LiveFrame url={c.url} media={c.media} /> : <ConfidentialFrame url={c.url} />}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mx-auto w-full max-w-content px-10 pb-8">
          <Reveal>
            <p className="max-w-[44ch] text-sm leading-relaxed text-muted">{WORK.intro}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Mount alongside the OLD Work temporarily** — in `src/app/page.tsx` render `<WorkStage />` where `<Work />` was, and DELETE the `<Work />` line + import (WorkStage is `hidden md:block`, so mobile has no work section until Task 6 — acceptable mid-plan state, called out in the commit message).

- [ ] **Step 4: Verify the engine** (desktop 1280x800, incremental `scrollBy(0,500)` + 900ms waits through the whole section):
- The stage pins; the header question stays; rail highlights 01→04 as you pass; each case shows mess fragments → turn → resolve with in-place crossfades; between cases the center empties briefly.
- Light: read `--bg` during Kahramaa's mess (expect near-jet L≈0.2–0.26) and after its resolve (warming ≥0.5 territory as the next section approaches).
- Rail clicks land each case (wait ≥1.2s; `aria-current` follows).
- UP-scroll re-scrubs without stuck darkness. Console clean after marker.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: WorkStage — pinned case cinema (desktop engine; mobile lands next)"
```

---

### Task 6: WorkStage completion — mobile fallback + polish

**Files:**
- Create: `src/components/sections/work/WorkMobile.tsx`
- Modify: `src/components/sections/work/WorkStage.tsx` (render WorkMobile inside the same section)

- [ ] **Step 1: Create `src/components/sections/work/WorkMobile.tsx`** — compact stacked cards, light still dips via the existing `useSectionLight` pattern per card:

```tsx
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
      <ul className="mt-5 space-y-2">
        {c.fragments.map((f) => (
          <li key={f} className="font-display text-lg tracking-tight">
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
```

Note: `useSectionLight(ref, c.depth, 0.35)` — depth values (1.6–3) double as valley temperatures; the About beat before and Bento after re-warm/re-cool around them. Also export the `CaseStudy` type from content if not already exported (it is).

- [ ] **Step 2: Render both in one section** — in `WorkStage.tsx`, change the outer return to wrap both (section keeps `id="work"`; move `hidden md:block h-[420vh]` onto an inner div):

```tsx
  return (
    <section id="work" ref={sectionRef} className="relative">
      <div className="hidden md:block md:h-[420vh]">
        {/* ...existing sticky stage exactly as built... */}
      </div>
      <WorkMobile />
    </section>
  );
```

IMPORTANT: `useScroll`'s target stays `sectionRef` — on mobile the sticky div is hidden so progress math is driven by WorkMobile's height; the `locate()` gate plus `md:` hiding means the desktop writer never fires on mobile (the stage never renders), and WorkMobile's per-card `useSectionLight` drives the valleys instead. Verify no double-writing on desktop: WorkMobile is `md:hidden`, so its IntersectionObservers never see it (`display:none` elements report no intersection) — the two writers are mutually exclusive by breakpoint.

- [ ] **Step 3: Verify** — desktop unchanged (spot-check one case + rail click). Mobile 375x812: stacked cards, fragments as a list, Kahramaa card drives bg toward jet (read `--bg` ≈ L 0.2–0.3 while centered), video plays inline, no horizontal scroll. Static gates clean.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: WorkStage mobile fallback — stacked compact cases with preserved valleys"
```

---

### Task 7: BeliefsBento — Beat 3 replaces MessyMiddle

**Files:**
- Create: `src/components/sections/BeliefsBento.tsx`
- Modify: `src/app/page.tsx` (swap `<MessyMiddle />` → `<BeliefsBento />`)

- [ ] **Step 1: Create `src/components/sections/BeliefsBento.tsx`**

```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
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
        className={`h-full p-6 transition-shadow duration-500 md:p-7 ${
          lit ? "shadow-[inset_0_0_0_1px_var(--accent)]" : ""
        }`}
      >
        <p className="text-xs uppercase tracking-[0.18em] text-accent">{domain}</p>
        <div className="relative mt-4 grid min-h-[120px]">
          {/* rest face: skills */}
          <motion.ul
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
  const reduce = useReducedMotion() ?? false;
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

  return (
    <section id="how" ref={ref} className="mx-auto max-w-content px-6 py-28 md:px-10 md:py-36">
      <QuestionHeading className="max-w-[15ch]">{BENTO.question}</QuestionHeading>

      <div
        className="relative mt-14"
        onPointerEnter={pause}
        onPointerLeave={resume}
        onFocusCapture={pause}
        onBlurCapture={resume}
      >
        {/* M3: the thread draws the grid's bones as the bento enters */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden
          className="pointer-events-none absolute -inset-3 h-[calc(100%+24px)] w-[calc(100%+24px)] overflow-visible"
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
            <GlassPanel className="h-full p-6 md:p-7">
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
```

- [ ] **Step 2: Swap in `page.tsx`** — remove the `MessyMiddle` import/render, add `import { BeliefsBento } from "@/components/sections/BeliefsBento";` and render it in the same slot (id stays `how`, so ThreadNav keeps working).

- [ ] **Step 3: Verify** — desktop: dusk world arrives (bg → oklch(0.28 0.02 200) settle); grid = anchor + 5 tiles in 2 rows of 3; thread draws the grid bones; idle spotlight cycles ~3.5s (belief faces swap in); hover/focus takes over and pauses the cycle; Tab reaches every tile (accent ring, belief shows). Mobile: single column, tiles readable. Static gates + console clean.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: BeliefsBento — beliefs and skills as a living glass bento in dusk"
```

---

### Task 8: Workbench — Beat 4 replaces PlaygroundBeat

**Files:**
- Create: `src/components/sections/workbench/Typewriter.tsx`
- Create: `src/components/sections/workbench/Workbench.tsx`
- Modify: `src/app/page.tsx` (swap `<PlaygroundBeat />` → `<Workbench />`)

- [ ] **Step 1: Create `src/components/sections/workbench/Typewriter.tsx`** (isolated loop leaf — types/deletes through phrases):

```tsx
"use client";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function Typewriter({ phrases }: { phrases: string[] }) {
  const reduce = useReducedMotion();
  const [pi, setPi] = useState(0);
  const [len, setLen] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const full = phrases[pi];
    const t = setTimeout(
      () => {
        if (!deleting) {
          if (len < full.length) setLen(len + 1);
          else setTimeout(() => setDeleting(true), 1600);
        } else if (len > 0) setLen(len - 1);
        else {
          setDeleting(false);
          setPi((pi + 1) % phrases.length);
        }
      },
      deleting ? 22 : 45
    );
    return () => clearTimeout(t);
  }, [len, deleting, pi, phrases, reduce]);

  if (reduce) return <span className="text-xs text-muted">{phrases[0]}</span>;
  return (
    <span className="text-xs text-muted">
      {phrases[pi].slice(0, len)}
      <span className="animate-pulse">▍</span>
    </span>
  );
}
```

- [ ] **Step 2: Create `src/components/sections/workbench/Workbench.tsx`**

```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react";
import { WORKBENCH } from "@/content/content";
import { useSectionLight } from "@/components/light/LightProvider";
import { TEMP } from "@/lib/lightScript";
import { QuestionHeading } from "@/components/ui/QuestionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { GlassPanel } from "@/components/ui/GlassPanel";

/** The finished artifact: glass browser frame with a live miniature of the real page. */
function PlaybookArtifact() {
  const p = WORKBENCH.playbook;
  return (
    <a href={p.href} target="_blank" rel="noopener noreferrer" className="group block h-full">
      <GlassPanel className="pressable flex h-full flex-col overflow-hidden">
        <div className="flex items-center gap-2 border-b px-4 py-2.5 [border-color:var(--edge)]">
          <span className="size-2 rounded-full bg-[var(--edge)]" />
          <span className="size-2 rounded-full bg-[var(--edge)]" />
          <span className="size-2 rounded-full bg-[var(--edge)]" />
          <span className="ml-3 text-xs tracking-wide text-muted">{p.chromeLabel}</span>
        </div>
        {/* live miniature of the actual shipped page */}
        <div className="relative h-64 overflow-hidden" aria-hidden>
          <iframe
            src={p.href}
            title=""
            tabIndex={-1}
            loading="lazy"
            scrolling="no"
            className="pointer-events-none origin-top-left"
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
  const reduce = useReducedMotion();
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
  const reduce = useReducedMotion();
  const [struck, setStruck] = useState(reduce ? a.strikes.length : 0);

  return (
    <motion.div
      onViewportEnter={() => {
        if (reduce) return;
        a.strikes.forEach((_, i) => setTimeout(() => setStruck(i + 1), 700 + i * 800));
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
      {/* chrome-bar typewriter lives visually in the artifact; place under kicker if the bar is too tight */}
    </section>
  );
}
```

Wire the `Typewriter` into `PlaybookArtifact`'s chrome bar, replacing the static label:

```tsx
          <span className="ml-3">
            <Typewriter phrases={WORKBENCH.playbook.typewriter} />
          </span>
```

(with `import { Typewriter } from "./Typewriter";` at top — keep `chromeLabel` in content as the reduced-motion/static fallback text shown by Typewriter's `phrases[0]`? No: Typewriter's reduce-branch shows `phrases[0]`, which is a prompt — acceptable; delete the unused `chromeLabel` usage if you wire the Typewriter in.)

- [ ] **Step 3: Swap in `page.tsx`** — remove `PlaygroundBeat` import/render; render `<Workbench />` (id stays `play`).

- [ ] **Step 4: Verify** — desktop: playbook frame shows a real miniature of the playbook page (iframe renders; if the miniature is blank in the preview harness, screenshot to foreground the tab first); typewriter cycles in the chrome bar; WIP card's outline draws to ~62% and STOPS; law names cycle and pause on hover; aside strikes through its three lines one by one on entry. Warm world (~L 0.81). Mobile 375: stacked, iframe miniature still contained, no horizontal scroll. Keyboard: playbook link focusable w/ ring. Static gates + console clean.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: Workbench pair — live playbook miniature + partially-drawn WIP card"
```

---

### Task 9: M1 morph, magnetic Invitation, cleanup of replaced sections

**Files:**
- Modify: `src/components/sections/Greeting.tsx` (additive stub only)
- Modify: `src/components/sections/Invitation.tsx`
- Delete: `src/components/sections/{WhatIDo,Story,MessyMiddle,PlaygroundBeat,Work,CaseValley}.tsx`
- Modify: `src/content/content.ts` (remove WHAT_I_DO/STORY/MESSY_MIDDLE/PLAYGROUND; move `brief` into ABOUT)
- Modify: `src/lib/lightScript.ts` (TEMP: remove `whatIDo`, `story`, `workIntro`; keep greeting/about/messyMiddle/playground/invitation)
- Modify: `src/components/sections/about/About.tsx` (read brief from ABOUT)

- [ ] **Step 1: M1 stub in `Greeting.tsx`** — after the `<HeroIllustration ... />` line, add a scroll-scrubbed thread stub that extends from the illustration's lane toward the About section (imports: add `useScroll`, `useSpring` to the existing framer import; the section ref already exists):

```tsx
      {/* M1: the line leaves the drawing and heads for the story below */}
      <M1Stub />
```

And at the bottom of the file:

```tsx
function M1Stub() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.55", "end 0.1"] });
  const pathLength = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute -bottom-[18vh] right-[16%] hidden h-[30vh] w-16 md:block"
    >
      <svg viewBox="0 0 64 240" fill="none" className="h-full w-full overflow-visible">
        <motion.path
          d="M 48 0 C 60 60, 16 110, 32 160 C 44 196, 24 220, 32 240"
          stroke="var(--hf-orchid)"
          strokeWidth={1.5}
          strokeLinecap="round"
          style={{ pathLength: reduce ? 1 : pathLength }}
        />
      </svg>
    </div>
  );
}
```

(Greeting's section already has `relative`; the stub hangs below into About's opening. `useRef` is already imported.)

- [ ] **Step 2: Move `brief` into ABOUT** — in `content.ts`, add the `brief` object (verbatim from `WHAT_I_DO.brief`) as `ABOUT.brief`, update `About.tsx` to `const b = ABOUT.brief;` (drop the WHAT_I_DO import), then DELETE the `WHAT_I_DO`, `STORY`, `MESSY_MIDDLE`, and `PLAYGROUND` exports entirely.

- [ ] **Step 3: Delete the replaced components**

```bash
git rm src/components/sections/WhatIDo.tsx src/components/sections/Story.tsx src/components/sections/MessyMiddle.tsx src/components/sections/PlaygroundBeat.tsx src/components/sections/Work.tsx src/components/sections/CaseValley.tsx
```

- [ ] **Step 4: Trim `TEMP`** in `lightScript.ts` to:

```ts
export const TEMP = {
  greeting: 0,
  about: 0.3,
  messyMiddle: 4,
  playground: 0.3,
  invitation: 0,
} as const;
```

- [ ] **Step 5: Magnetic CTA in `Invitation.tsx`** — convert the mailto `<a>` to a magnetic `motion.a`:

```tsx
import { useMagnetic } from "@/lib/useMagnetic";
```

inside `Invitation()`:

```tsx
  const magnet = useMagnetic(6);
```

replace the `<a ...>` with:

```tsx
          <motion.a
            href={`mailto:${INVITATION.email}`}
            className="pressable glass inline-block px-8 py-4 text-lg font-medium"
            style={{ x: magnet.x, y: magnet.y }}
            {...magnet.handlers}
          >
            {INVITATION.cta}
          </motion.a>
```

- [ ] **Step 6: Verify** — `npx tsc --noEmit` FIRST (this task's whole point is that nothing references the deleted exports; if it fails, a swap task above missed a reference). Then lint/test/build. Visual: greeting stub draws as you begin scrolling and hands off toward About; Invitation CTA leans toward the cursor and springs back. Grep sanity: `grep -r "WHAT_I_DO\|MESSY_MIDDLE\|PLAYGROUND\b\|STORY" src` returns only ABOUT/BENTO/WORKBENCH internals (i.e. nothing).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: M1 thread handoff, magnetic invitation; remove replaced sections"
```

---

### Task 10: Full verification pass

**Files:** possibly any (small fixes only; report anything structural).

- [ ] **Step 1: Static gates** — `npx tsc --noEmit && npm test && npm run lint && npm run build` all clean.

- [ ] **Step 2: Compression check** — at 1280x800: `document.documentElement.scrollHeight / window.innerHeight` ≤ ~11 (spec target ~10.4).

- [ ] **Step 3: Light arc walkthrough** (fresh reload + console marker; scroll in 600px steps with 900ms waits; screenshot first to foreground the tab — rAF freezes while `document.hidden`): golden 0.94 (hero) → ~0.81 (about) → per-case valleys inside the pinned stage (QF deep, QU shallowest, QBF mid, Kahramaa ≈0.2–0.26 jet) → dusk oklch(0.28 0.02 200) (bento) → ~0.81 (workbench) → 0.94 (invitation). UP-scroll spot-check: no stuck darkness, no strobing at the stage↔bento seam (single-trend transitions).

- [ ] **Step 4: Interaction inventory** (each must work): map organizes + replay; rail click-jumps (×2 cases, ≥1.2s waits, aria-current follows); QBF pause button state sync; bento spotlight cycles + hover takeover + Tab focus shows beliefs; typewriter cycles; WIP outline stops mid-draw; aside strikes; magnetic CTA leans; ThreadNav 6 nodes track + jump; hero unchanged (draws, leans, gradient flows).

- [ ] **Step 5: Mobile pass (375x812)** — single column everywhere; stage hidden, WorkMobile cards with valleys (Kahramaa ≈ jet); no horizontal scroll at top/mid/bottom; map/bento/workbench readable; nav hidden.

- [ ] **Step 6: Reduced-motion audit (code read)** — table every animation source added by this plan (QuestionHeading stagger, glyphs, bead thread, map organize/perturb, stage crossfades + light scrub writes, StageThread, bento spotlight/faces, grid-bones draw, typewriter, WIP outline, law cycler, strikes, M1 stub, magnetic) and confirm each has its reduced path per the code (static/organized/instant/off).

- [ ] **Step 7: Heading outline & landmarks** — one h1; h2s: about×2 (origin + practice), work, how, play, talk (6); h3s under each; one nav landmark (ThreadNav) + the stage's case rail nav is `aria-label`ed; one main; one footer.

- [ ] **Step 8: Fix small defects found; commit**

```bash
git add -A
git commit -m "chore: Exhibition verification pass"
```

---

## Self-review notes (already applied)

- **Build stays green between tasks:** old exports/components survive until Task 9; page swaps happen in the same task as each replacement (4, 5, 7, 8); Task 5 leaves mobile without a work section for exactly one task (called out in its commit).
- **Known tuning knobs (not placeholders — concrete starting values shipped, with explicit tune instructions):** UntanglingMap `MESS` deltas (multiply ×3 if too tame), StageThread knot path, M1 stub path, bento grid-bone lines, iframe miniature `scale(0.46)`/`h-64`.
- **UntanglingMap chips:** if the mount state flashes organized before scattering, add `initial={false}` to the chip `motion.div` so they mount directly in the messy pose.
- **Type consistency checked:** `Phase` defined in WorkStage and imported nowhere else (StageThread declares its own union — keep in sync if edited); `CaseStudy.fragments` (Task 1) is required and used by WorkStage + WorkMobile; `ABOUT.brief` exists only after Task 9 Step 2 (About.tsx reads `WHAT_I_DO.brief` until then — Task 4 code shows that interim import deliberately).
- **Spec coverage:** §6.1 → Tasks 3–4; §6.2 → Tasks 5–6; §6.3 → Task 7; §6.4 → Task 8; §6.5 + §7 → Tasks 2, 9; §5 M1/M2/M3 → Tasks 9, 5, 7+8; §8 constraints threaded through every task; §10 criteria → Task 10.


