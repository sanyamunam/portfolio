# Golden Hour Portfolio V3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the "Golden Hour" portfolio — a conversation with Sanya as the light slowly changes — per the approved spec at `docs/superpowers/specs/2026-07-04-golden-hour-portfolio-design.md`.

**Architecture:** A single scrolling page of seven "beats" (conversation turns). One numeric motion value — the **light temperature** (0 golden → 4 dusk) — drives the entire atmosphere: a fixed gradient background, all text/glass color tokens (via CSS custom properties), and the emotional arc. Beats set the temperature when they enter view; case studies scrub it continuously with scroll (the "light valleys"). A decorative SVG thread accompanies the story. All copy lives in one `content.ts`.

**Tech Stack:** Next.js 16.2.9 (App Router) · React 19 · Tailwind v4 (CSS-first, no config file) · framer-motion 12 · Lenis · Bricolage Grotesque (next/font/google) + Satoshi (Fontshare CDN) · vitest for the pure color/light math.

**Critical context for the engineer:**
- This repo is `portfolio-v3/`. The previous build lives in the sibling `../portfolio/` — it is a **working Next 16 + Tailwind v4 reference**; never modify it.
- Next.js 16 differs from training data. Read `node_modules/next/dist/docs/` when unsure. When a pattern exists in `../portfolio/`, copy that pattern.
- The dev environment is inside OneDrive: file-watching is flaky and `next dev` can zombie. Kill zombies with PowerShell: `Get-CimInstance Win32_Process -Filter "Name='node.exe'" | ? { $_.CommandLine -match 'next' -and $_.CommandLine -match 'dev' } | % { Stop-Process -Id $_.ProcessId -Force }`.
- Visual verification: use the preview tools with server name `portfolio-v3` (registered in Task 1). The preview iframe is ~650px wide — desktop layouts need a real browser at the printed localhost URL for final checks.
- JSX gotcha: inline `<span>` highlights swallow adjacent spaces — wrap with `{" "}` on BOTH sides.
- Git identity is already configured repo-locally. Commit after every task.

---

### Task 1: Scaffold the app, fonts, theme tokens, and assets

**Files:**
- Create: entire Next app via create-next-app (in repo root `portfolio-v3/`)
- Replace: `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`
- Create: `AGENTS.md`, `CLAUDE.md`, `vitest.config.ts`
- Create: `public/media/` (copied assets), `public/ai-prompt-guide.html` (copied)
- Modify: `../.claude/launch.json` (add `portfolio-v3` server)
- Modify: `package.json` (test scripts)

- [ ] **Step 1: Scaffold Next.js in the existing repo root**

Run from `portfolio-v3/` (the `docs/` folder and `.git` are on create-next-app's allowlist, so scaffolding into the non-empty dir works):

```bash
npx create-next-app@16.2.9 . --ts --tailwind --eslint --app --src-dir --turbopack --import-alias "@/*" --use-npm --yes
```

Expected: scaffold completes; `package.json`, `src/app/` exist.

- [ ] **Step 2: Install runtime + test dependencies**

```bash
npm i framer-motion@^12 lenis@^1.3 @phosphor-icons/react@^2
npm i -D vitest@^4
```

- [ ] **Step 3: Add test scripts to `package.json`**

In `package.json` `"scripts"`, add:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
  },
});
```

- [ ] **Step 5: Create `AGENTS.md` and `CLAUDE.md`**

`AGENTS.md`:

```markdown
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# Project notes

- Spec: `docs/superpowers/specs/2026-07-04-golden-hour-portfolio-design.md`. Read it before design decisions.
- One motion value (light temperature 0–4) drives the whole atmosphere. Do not add per-section backgrounds.
- All copy lives in `src/content/content.ts` — no prose in components.
- Every animation must have a `useReducedMotion` / `prefers-reduced-motion` fallback.
- Animate only `transform`/`opacity` (background gradients are driven via CSS variables on fixed layers).
```

`CLAUDE.md`:

```markdown
@AGENTS.md
```

- [ ] **Step 6: Copy media assets from V2**

```bash
mkdir -p public/media
cp ../portfolio/public/media/qbf-hero.mp4 ../portfolio/public/media/qbf-hero.webm ../portfolio/public/media/qbf-hero-poster.jpg public/media/
cp ../portfolio/public/ai-prompt-guide.html public/
rm -f public/next.svg public/vercel.svg public/file.svg public/globe.svg public/window.svg
```

- [ ] **Step 7: Replace `src/app/globals.css` with the Golden Hour theme**

```css
@import "tailwindcss";

/*
 * Light-temperature token system.
 * These :root values are the GOLDEN stop (temperature 0) — the SSR/first-paint
 * state. At runtime, Atmosphere.tsx rewrites them every frame from lightScript.
 */
:root {
  --bg: oklch(0.94 0.025 70);
  --ink: oklch(0.3 0.035 25);
  --muted: oklch(0.48 0.03 25);
  --glow-a: oklch(0.85 0.09 340);
  --glow-b: oklch(0.9 0.06 85);
  --glass: oklch(0.98 0.01 80 / 0.4);
  --edge: oklch(1 0 0 / 0.5);
  --accent: oklch(0.86 0.09 185); /* turquoise — clarity only */
  --ease: cubic-bezier(0.23, 1, 0.32, 1);
}

@theme inline {
  --color-ink: var(--ink);
  --color-muted: var(--muted);
  --color-accent: var(--accent);
  --font-display: var(--font-bricolage), system-ui, sans-serif;
  --font-sans: "Satoshi", system-ui, sans-serif;
  --max-width-content: 1200px;
}

body {
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  overflow-x: clip;
}

/* Frosted glass — the site's single material (spec §5.4) */
.glass {
  background: var(--glass);
  border: 1px solid var(--edge);
  box-shadow: inset 0 1px 0 var(--edge);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-radius: 1.25rem;
}

/* Tactile press feedback (spec §6) */
.pressable {
  transition: transform 160ms var(--ease);
}
.pressable:active {
  transform: scale(0.97);
}

/* Slow ambient drift for the secondary glow layer */
@keyframes atmo-drift {
  from {
    transform: translate3d(-4%, 2%, 0) scale(1);
  }
  to {
    transform: translate3d(4%, -3%, 0) scale(1.12);
  }
}
.atmo-drift {
  animation: atmo-drift 26s ease-in-out infinite alternate;
}

@media (prefers-reduced-motion: reduce) {
  .atmo-drift {
    animation: none;
  }
}

/* Film grain — fixed, pointer-events-none layer only (perf rule) */
.grain {
  opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E");
}
```

- [ ] **Step 8: Replace `src/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  axes: ["opsz", "wdth"],
});

export const metadata: Metadata = {
  title: "Sanya Munam — UX Strategy & Design Operations",
  description:
    "A conversation with Sanya Munam. I untangle complicated products, teams, and decisions until they make sense to humans. UX strategy and design operations, Doha.",
  openGraph: {
    title: "Sanya Munam — UX Strategy & Design Operations",
    description:
      "A conversation with Sanya Munam. I untangle complicated things until they make sense to humans.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={bricolage.variable}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 9: Replace `src/app/page.tsx` with a placeholder shell**

(Beat sections replace this progressively in Tasks 8–15.)

```tsx
export default function Home() {
  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-content items-end px-6 pb-24 md:px-10">
      <h1 className="font-display text-5xl tracking-tight md:text-7xl">
        Hi. I&apos;m Sanya.
      </h1>
    </main>
  );
}
```

- [ ] **Step 10: Register the dev server in `../.claude/launch.json`**

Add this object to the existing `configurations` array (keep the `portfolio` entry untouched):

```json
{
  "name": "portfolio-v3",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["--prefix", "portfolio-v3", "run", "dev"],
  "port": 3001,
  "autoPort": true
}
```

- [ ] **Step 11: Verify build and dev server**

```bash
npx tsc --noEmit && npm run build
```

Expected: both succeed. Then start the preview server `portfolio-v3` and confirm the placeholder renders on a warm cream background (`--bg` golden stop) with Bricolage display type.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat: scaffold Golden Hour app — theme tokens, fonts, assets, dev server"
```

---

### Task 2: OKLCH color math (`src/lib/oklch.ts`) — TDD

The atmosphere interpolates colors in OKLCH (spec §5.2). We define all stop colors *directly* as OKLCH tuples and emit CSS `oklch()` strings, so no RGB conversion is needed — only lerping, with shortest-path hue wrapping.

**Files:**
- Create: `src/lib/oklch.ts`
- Test: `src/lib/oklch.test.ts`

- [ ] **Step 1: Write the failing tests**

`src/lib/oklch.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { lerp, lerpHue, mixOklch, toCss, type Ok } from "./oklch";

describe("lerp", () => {
  it("interpolates linearly", () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
    expect(lerp(2, 4, 0)).toBe(2);
    expect(lerp(2, 4, 1)).toBe(4);
  });
});

describe("lerpHue", () => {
  it("takes the short path across 0/360", () => {
    // 350 -> 10 should pass through 0, not 180
    expect(lerpHue(350, 10, 0.5)).toBe(0);
    expect(lerpHue(10, 350, 0.5)).toBe(0);
  });
  it("interpolates normally when close", () => {
    expect(lerpHue(20, 40, 0.5)).toBe(30);
  });
});

describe("mixOklch", () => {
  it("mixes all channels including alpha", () => {
    const a: Ok = [0.2, 0.1, 350, 1];
    const b: Ok = [0.8, 0.3, 10, 0];
    const m = mixOklch(a, b, 0.5);
    // floats: compare per-channel with tolerance, not deep equality
    expect(m[0]).toBeCloseTo(0.5);
    expect(m[1]).toBeCloseTo(0.2);
    expect(m[2]).toBeCloseTo(0);
    expect(m[3]).toBeCloseTo(0.5);
  });
  it("defaults missing alpha to 1", () => {
    const a: Ok = [0.2, 0.1, 100];
    const b: Ok = [0.4, 0.1, 100];
    const m = mixOklch(a, b, 0.5);
    expect(m[0]).toBeCloseTo(0.3);
    expect(m[3]).toBe(1);
  });
});

describe("toCss", () => {
  it("emits a css oklch() string", () => {
    expect(toCss([0.5, 0.12, 340, 0.4])).toBe("oklch(0.5 0.12 340 / 0.4)");
    expect(toCss([0.5, 0.12, 340])).toBe("oklch(0.5 0.12 340 / 1)");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — `./oklch` module not found.

- [ ] **Step 3: Implement `src/lib/oklch.ts`**

```ts
/** [lightness 0-1, chroma, hue deg, alpha 0-1 (default 1)] */
export type Ok = [number, number, number, number?];

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Hue interpolation along the shortest arc (handles the 0/360 wrap). */
export function lerpHue(a: number, b: number, t: number): number {
  let d = ((b - a + 540) % 360) - 180;
  const h = (a + d * t + 360) % 360;
  // avoid -0
  return h === 0 ? 0 : h;
}

export function mixOklch(a: Ok, b: Ok, t: number): Ok {
  return [
    lerp(a[0], b[0], t),
    lerp(a[1], b[1], t),
    lerpHue(a[2], b[2], t),
    lerp(a[3] ?? 1, b[3] ?? 1, t),
  ];
}

export function toCss(c: Ok): string {
  const [l, ch, h, a] = c;
  return `oklch(${round(l)} ${round(ch)} ${round(h)} / ${round(a ?? 1)})`;
}

function round(n: number): number {
  return Math.round(n * 1000) / 1000;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS (all oklch tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/oklch.ts src/lib/oklch.test.ts
git commit -m "feat: oklch lerp/mix utilities with shortest-path hue"
```

---

### Task 3: The LightScript (`src/lib/lightScript.ts`) — TDD

The single source of truth (spec §8.2): five world **stops** on one temperature axis, and `sampleLight(t)` which returns every CSS token for any temperature.

Temperature axis: `0` GOLDEN (orchid/cream warmth) · `1` EMBER (wine-orchid dusk, breathers) · `2` WINE (deep case-study middle) · `3` JET (messiest moment, Kahramaa only) · `4` DUSK (turquoise-tinted contemplation, messy-middle beat).

**Files:**
- Create: `src/lib/lightScript.ts`
- Test: `src/lib/lightScript.test.ts`

- [ ] **Step 1: Write the failing tests**

`src/lib/lightScript.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { sampleLight, STOPS, TEMP } from "./lightScript";

describe("sampleLight", () => {
  it("returns the exact stop at integer temperatures", () => {
    const t0 = sampleLight(0);
    expect(t0.bg).toBe("oklch(0.94 0.025 70 / 1)");
    const t3 = sampleLight(3);
    expect(t3.bg).toBe("oklch(0.2 0.005 0 / 1)");
  });

  it("clamps out-of-range temperatures", () => {
    expect(sampleLight(-1)).toEqual(sampleLight(0));
    expect(sampleLight(99)).toEqual(sampleLight(STOPS.length - 1));
  });

  it("interpolates between stops", () => {
    const mid = sampleLight(0.5);
    expect(mid.bg).not.toBe(sampleLight(0).bg);
    expect(mid.bg).not.toBe(sampleLight(1).bg);
    // lightness halfway between golden 0.94 and ember 0.52
    expect(mid.bg).toContain("oklch(0.73");
  });

  it("exposes named beat temperatures within stop range", () => {
    for (const v of Object.values(TEMP)) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(STOPS.length - 1);
    }
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — `./lightScript` not found.

- [ ] **Step 3: Implement `src/lib/lightScript.ts`**

```ts
import { mixOklch, toCss, type Ok } from "./oklch";

/** Every color token the atmosphere controls. */
export type LightTokens = {
  bg: string;
  ink: string;
  muted: string;
  glowA: string;
  glowB: string;
  glass: string;
  edge: string;
};

type Stop = Record<keyof LightTokens, Ok>;

/**
 * The five world stops (spec §5.2). Index IS the temperature.
 * 0 GOLDEN · 1 EMBER · 2 WINE · 3 JET · 4 DUSK
 * All values authored directly in OKLCH.
 */
export const STOPS: Stop[] = [
  {
    // GOLDEN — cream bg, orchid + warm gold glows, wine ink
    bg: [0.94, 0.025, 70],
    ink: [0.3, 0.035, 25],
    muted: [0.48, 0.03, 25],
    glowA: [0.85, 0.09, 340],
    glowB: [0.9, 0.06, 85],
    glass: [0.98, 0.01, 80, 0.4],
    edge: [1, 0, 0, 0.5],
  },
  {
    // EMBER — wine-orchid dusk (case breathers)
    bg: [0.52, 0.05, 355],
    ink: [0.95, 0.015, 80],
    muted: [0.84, 0.02, 350],
    glowA: [0.72, 0.09, 345],
    glowB: [0.45, 0.06, 20],
    glass: [0.98, 0.01, 80, 0.08],
    edge: [1, 0, 0, 0.18],
  },
  {
    // WINE — deep case middle
    bg: [0.3, 0.03, 15],
    ink: [0.93, 0.01, 60],
    muted: [0.74, 0.02, 15],
    glowA: [0.45, 0.07, 350],
    glowB: [0.3, 0.05, 15],
    glass: [0.98, 0.01, 80, 0.06],
    edge: [1, 0, 0, 0.14],
  },
  {
    // JET — messiest moment only (never pure black)
    bg: [0.2, 0.005, 0],
    ink: [0.92, 0.005, 60],
    muted: [0.68, 0.01, 20],
    glowA: [0.28, 0.03, 15],
    glowB: [0.22, 0.01, 0],
    glass: [0.98, 0, 0, 0.05],
    edge: [1, 0, 0, 0.12],
  },
  {
    // DUSK — turquoise-tinted contemplation (messy-middle beat)
    bg: [0.28, 0.02, 200],
    ink: [0.94, 0.01, 180],
    muted: [0.74, 0.02, 190],
    glowA: [0.6, 0.07, 190],
    glowB: [0.35, 0.04, 210],
    glass: [0.98, 0.01, 180, 0.06],
    edge: [1, 0, 0, 0.14],
  },
];

const KEYS = Object.keys(STOPS[0]) as (keyof LightTokens)[];

/** Sample the full token set at any temperature (fractional allowed). */
export function sampleLight(t: number): LightTokens {
  const max = STOPS.length - 1;
  const v = Math.min(max, Math.max(0, t));
  const i = Math.min(max - 1, Math.floor(v));
  const f = v - i;
  const out = {} as LightTokens;
  for (const k of KEYS) {
    out[k] = toCss(mixOklch(STOPS[i][k], STOPS[i + 1][k], f));
  }
  return out;
}

/** Named target temperatures per beat (spec §3). */
export const TEMP = {
  greeting: 0,
  whatIDo: 0.3,
  workIntro: 0.9,
  messyMiddle: 4,
  story: 1,
  playground: 0.3,
  invitation: 0,
} as const;
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS. (If the `sampleLight(0.5)` lightness assertion fails on rounding, check `toCss` rounding — golden 0.94 → ember 0.52 midpoint is exactly 0.73.)

- [ ] **Step 5: Commit**

```bash
git add src/lib/lightScript.ts src/lib/lightScript.test.ts
git commit -m "feat: LightScript — five world stops + sampleLight on one temperature axis"
```

---

### Task 4: Content model (`src/content/content.ts`)

All copy for the entire site, in the host voice (humble, curious, quietly confident, dry-fun). No prose in components — ever.

**Files:**
- Create: `src/content/content.ts`

- [ ] **Step 1: Create `src/content/content.ts`**

```ts
export type CaseMedia = {
  mp4: string;
  webm: string;
  poster: string;
  href: string;
};

export type CaseStudy = {
  id: string;
  n: string;
  client: string;
  tag: string;
  url: string;
  /** Peak light temperature of this case's valley (2 = wine, 3 = jet). */
  depth: number;
  mess: string;
  turn: string;
  resolution: string;
  outcome: string;
  media?: CaseMedia;
};

export const GREETING = {
  label: "Sanya Munam — UX Strategy & Design Operations · Doha",
  hello: "Hi. I’m Sanya.",
  premise:
    "You probably have questions. Good — questions are how I make a living.",
  cue: "go on, ask",
};

export const WHAT_I_DO = {
  question: "So… what do you actually do?",
  answer: [
    "I untangle complicated things. Products with too many stakeholders. Teams with too many opinions. Systems nobody fully understands anymore.",
    "I sit with the mess until it makes sense — then I make sure it makes sense to everyone else. People call that UX strategy. I mostly call it listening, drawing, and asking “why” one more time than is polite.",
  ],
  brief: {
    heading: "In a hurry? The short version.",
    name: "Sanya Munam",
    roles: ["UX Consultant", "UX Strategist", "UX Lead", "Design Operations Lead"],
    base: "Doha, Qatar",
    focus: [
      "UX strategy",
      "Discovery & research",
      "Stakeholder alignment",
      "Design ops & teams",
      "AI-assisted design",
      "Digital transformation",
    ],
  },
};

export const WORK = {
  question: "What does that look like in real life?",
  intro:
    "A few real ones. Fair warning: they all start in the dark — that’s where the interesting problems live.",
};

export const CASES: CaseStudy[] = [
  {
    id: "qf",
    n: "01",
    client: "Qatar Foundation",
    tag: "Design Lead · Government & Education",
    url: "qf.org.qa",
    depth: 2.4,
    mess: "A flagship initiative under Her Highness’s office. Every decision examined at the highest level — many rooms, many opinions, and a bar where “good enough” simply wasn’t.",
    turn: "I led the design direction: translating a high-level vision into a coherent, defensible experience that stakeholders could stand behind — and keep standing behind when the scrutiny arrived.",
    resolution: "A design that met the standard its patronage demanded, delivered under intense visibility.",
    outcome: "Held the highest bar in the room",
  },
  {
    id: "qu",
    n: "02",
    client: "Qatar University",
    tag: "UX Strategy · Presales · Higher Education",
    url: "qu.edu.qa",
    depth: 1.6,
    mess: "The university needed a full website revamp — and we had to win the work before a single screen existed. Nothing to show. Only thinking.",
    turn: "I built the UX strategy for the pitch: a clear, opinionated point of view on the experience — strong enough to be the deliverable itself.",
    resolution: "We won the project.",
    outcome: "Strategy won the room",
  },
  {
    id: "qbf",
    n: "03",
    client: "Qatar Basketball Federation",
    tag: "UX Strategy · Sport (FIBA)",
    url: "qbf.qa",
    depth: 2.0,
    mess: "A federation playing on the international FIBA stage, with a web presence that no longer matched its standing. Fans, officials, and international expectations — all watching.",
    turn: "I led the strategy and redesign, restructuring the experience around what fans and the federation actually needed from it — not what the old sitemap said.",
    resolution: "A revamped site fit for the federation’s profile. See for yourself — it’s live.",
    outcome: "Live on the international stage",
    media: {
      mp4: "/media/qbf-hero.mp4",
      webm: "/media/qbf-hero.webm",
      poster: "/media/qbf-hero-poster.jpg",
      href: "https://www.qatarbasketball.qa/",
    },
  },
  {
    id: "kahramaa",
    n: "04",
    client: "Kahramaa",
    tag: "UX Strategy · National Utility (Public + Enterprise)",
    url: "km.qa",
    depth: 3,
    mess: "Qatar’s national water & electricity authority. A public website, a mobile app, and a tangle of internal enterprise systems — each built in a different era, none speaking the same language. This is the messiest it gets.",
    turn: "I led UX strategy across the entire portfolio, bringing one coherent standard to citizens, employees, and everything in between.",
    resolution: "A unified experience across a national utility — public to enterprise.",
    outcome: "One standard, portfolio-wide",
  },
];

export const MESSY_MIDDLE = {
  question: "How do you handle the messy middle?",
  beliefs: [
    {
      domain: "Discovery",
      statement:
        "Fall in love with the problem before anyone mentions solutions. The first version of the problem is almost never the real one.",
    },
    {
      domain: "Strategy",
      statement:
        "A strategy you can’t sketch on a whiteboard isn’t a strategy. It’s a document.",
    },
    {
      domain: "Alignment",
      statement:
        "Alignment isn’t agreement. It’s everyone understanding the same thing well enough to argue productively.",
    },
    {
      domain: "Leadership & Ops",
      statement:
        "Teams do their best work when the process disappears. Design ops is making the machine so quiet nobody notices it running.",
    },
    {
      domain: "AI & Systems",
      statement:
        "AI doesn’t replace the thinking. It replaces the waiting between thoughts — I design workflows where it does exactly that.",
    },
  ],
  skillsHeading: "The practical list",
  skillsIntro: "For the scanners — no hard feelings, I skim too.",
  skills: [
    {
      group: "Strategy & Thinking",
      items: ["UX Strategy", "Product Thinking", "Design Thinking", "Digital Transformation"],
    },
    {
      group: "Research & Discovery",
      items: ["UX Research", "Requirement Gathering", "Information Architecture"],
    },
    {
      group: "People & Rooms",
      items: ["Stakeholder Workshops", "Client Communication", "Facilitation"],
    },
    {
      group: "Teams & Ops",
      items: ["Managing Design Teams", "Design Operations", "Design Systems"],
    },
    {
      group: "AI",
      items: ["AI-assisted Product Design", "AI Workflow Design"],
    },
  ],
};

export const STORY = {
  question: "Who taught you to see like this?",
  moments: [
    {
      title: "A workshop.",
      body: "My first design-thinking workshop. A room full of people who disagreed about everything — and a wall of sticky notes that slowly changed their minds. I walked out rearranged.",
    },
    {
      title: "An app.",
      body: "Watching my dad use Google Pay for the first time. Two taps, and delight on his face. Somebody had thought about him without ever meeting him. I wanted to be that somebody.",
    },
    {
      title: "A book.",
      body: "The Steve Jobs biography. Not the myth — the obsession. The idea that caring about details nobody sees is the whole job.",
    },
  ],
  close: "Mostly, I just love figuring out people.",
};

export const PLAYGROUND = {
  question: "And what do you make when nobody’s paying you?",
  intro: "Side projects are how I figure out what I actually think. A couple I’m fond of:",
  items: [
    {
      kicker: "Guide · AI workflows",
      title: "AI Prompt Guide",
      body: "A practical guide to getting real work out of AI — written because I got tired of explaining it one designer at a time.",
      href: "/ai-prompt-guide.html",
    },
    {
      kicker: "Reference · For the team",
      title: "Laws of UX",
      body: "My running collection of the principles I keep reaching for — mostly so I stop quoting them from memory and getting them slightly wrong.",
    },
  ],
  aside: {
    kicker: "Quietly proud of",
    text: "I keep a list of features I’ve talked teams out of building. It’s some of my best work.",
  },
};

export const INVITATION = {
  question: "Got a wonderfully complicated problem?",
  answer:
    "My turn to ask. I’d genuinely love to hear it — the messier the better. Bring the version with all the stakeholders still attached.",
  cta: "Tell me about it",
  email: "sanyamunam95@gmail.com",
  footer: "Sanya Munam · Doha · replies within a day",
};

export const BEATS = [
  { id: "hello", label: "Hello" },
  { id: "what", label: "What I do" },
  { id: "work", label: "Real life" },
  { id: "how", label: "The messy middle" },
  { id: "story", label: "How I learned to see" },
  { id: "play", label: "Playground" },
  { id: "talk", label: "Say hello" },
] as const;
```

- [ ] **Step 2: Verify it type-checks**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/content/content.ts
git commit -m "feat: full site copy and case data in host voice"
```

---

### Task 5: Providers — SmoothScroll + LightProvider

**Files:**
- Create: `src/components/providers/SmoothScroll.tsx`
- Create: `src/components/light/LightProvider.tsx`
- Modify: `src/app/layout.tsx` (wrap body children)

- [ ] **Step 1: Create `src/components/providers/SmoothScroll.tsx`** (proven V2 pattern, verbatim behavior)

```tsx
"use client";
import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    // expose for components that need reliable programmatic scrolls
    // (native window.scrollTo({behavior:"smooth"}) fights Lenis's rAF loop)
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
      lenis.destroy();
    };
  }, []);
  return <>{children}</>;
}
```

- [ ] **Step 2: Create `src/components/light/LightProvider.tsx`**

```tsx
"use client";
import { createContext, useContext, type ReactNode, type RefObject } from "react";
import { useEffect } from "react";
import { useInView, useMotionValue, type MotionValue } from "framer-motion";

type LightCtxValue = {
  /** Raw target temperature (0–4). Atmosphere smooths it with a spring. */
  temp: MotionValue<number>;
};

const LightCtx = createContext<LightCtxValue | null>(null);

export function LightProvider({ children }: { children: ReactNode }) {
  const temp = useMotionValue(0);
  return <LightCtx.Provider value={{ temp }}>{children}</LightCtx.Provider>;
}

export function useLight(): LightCtxValue {
  const ctx = useContext(LightCtx);
  if (!ctx) throw new Error("useLight must be used inside <LightProvider>");
  return ctx;
}

/**
 * Static beats: when the section is in view, set the world temperature.
 * Case valleys scrub temp directly instead (see CaseValley).
 */
export function useSectionLight(
  ref: RefObject<Element | null>,
  temperature: number
) {
  const { temp } = useLight();
  const inView = useInView(ref, { amount: 0.4 });
  useEffect(() => {
    if (inView) temp.set(temperature);
  }, [inView, temperature, temp]);
}
```

- [ ] **Step 3: Wire providers into `src/app/layout.tsx`**

Replace the `<body>` line with:

```tsx
      <body>
        <LightProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </LightProvider>
      </body>
```

and add the imports at the top:

```tsx
import { LightProvider } from "@/components/light/LightProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit`
Expected: PASS. Reload the preview — page still renders, smooth scrolling active (placeholder page is short; full check comes later).

- [ ] **Step 5: Commit**

```bash
git add src/components/providers/SmoothScroll.tsx src/components/light/LightProvider.tsx src/app/layout.tsx
git commit -m "feat: Lenis smooth scroll + light-temperature provider"
```

---

### Task 6: The Atmosphere

The fixed living-light background: spring-smoothed temperature → CSS custom properties + two glow layers + grain + cursor warmth (spec §6 signature interaction 1).

**Files:**
- Create: `src/components/light/Atmosphere.tsx`
- Modify: `src/app/page.tsx` (mount it)

- [ ] **Step 1: Create `src/components/light/Atmosphere.tsx`**

```tsx
"use client";
import { useEffect } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { sampleLight, type LightTokens } from "@/lib/lightScript";
import { useLight } from "./LightProvider";

const VAR_MAP: Record<keyof LightTokens, string> = {
  bg: "--bg",
  ink: "--ink",
  muted: "--muted",
  glowA: "--glow-a",
  glowB: "--glow-b",
  glass: "--glass",
  edge: "--edge",
};

function applyTokens(t: LightTokens) {
  const s = document.documentElement.style;
  for (const k of Object.keys(VAR_MAP) as (keyof LightTokens)[]) {
    s.setProperty(VAR_MAP[k], t[k]);
  }
}

export function Atmosphere() {
  const { temp } = useLight();
  const reduce = useReducedMotion();

  // Slow, cinematic grade between worlds (~2s settle). Reduced motion: near-instant.
  const smooth = useSpring(
    temp,
    reduce ? { stiffness: 500, damping: 50 } : { stiffness: 26, damping: 16, mass: 1.4 }
  );

  useMotionValueEvent(smooth, "change", (v) => applyTokens(sampleLight(v)));
  useEffect(() => applyTokens(sampleLight(temp.get())), [temp]);

  // Cursor warmth: primary glow leans gently toward the pointer (decorative).
  const rawX = useMotionValue(32);
  const rawY = useMotionValue(38);
  const wx = useSpring(rawX, { stiffness: 40, damping: 20 });
  const wy = useSpring(rawY, { stiffness: 40, damping: 20 });

  useEffect(() => {
    if (reduce) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    const onMove = (e: PointerEvent) => {
      // lean, don't follow: map pointer to a narrow 24–44% band
      rawX.set(24 + (e.clientX / window.innerWidth) * 20);
      rawY.set(28 + (e.clientY / window.innerHeight) * 20);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, rawX, rawY]);

  const glowA = useMotionTemplate`radial-gradient(56% 48% at ${wx}% ${wy}%, var(--glow-a), transparent 70%)`;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div className="absolute inset-0" style={{ background: glowA }} />
      <div
        className="atmo-drift absolute inset-0"
        style={{
          background:
            "radial-gradient(48% 60% at 76% 72%, var(--glow-b), transparent 72%)",
        }}
      />
      <div className="grain absolute inset-0" />
    </div>
  );
}
```

- [ ] **Step 2: Mount in `src/app/page.tsx`**

```tsx
import { Atmosphere } from "@/components/light/Atmosphere";

export default function Home() {
  return (
    <>
      <Atmosphere />
      <main className="mx-auto flex min-h-[100dvh] max-w-content items-end px-6 pb-24 md:px-10">
        <h1 className="font-display text-5xl tracking-tight md:text-7xl">
          Hi. I&apos;m Sanya.
        </h1>
      </main>
    </>
  );
}
```

- [ ] **Step 3: Verify visually**

Start/reload the `portfolio-v3` preview. Expected: warm cream page with a soft orchid glow upper-left and a warm gold glow lower-right, faint grain; moving the mouse makes the orchid glow lean toward it (springy, subtle). Console: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/light/Atmosphere.tsx src/app/page.tsx
git commit -m "feat: living-light Atmosphere — spring-graded worlds, cursor warmth, grain"
```

---

### Task 7: UI primitives — Reveal, QuestionHeading, GlassPanel

**Files:**
- Create: `src/components/ui/Reveal.tsx`
- Create: `src/components/ui/QuestionHeading.tsx`
- Create: `src/components/ui/GlassPanel.tsx`

- [ ] **Step 1: Create `src/components/ui/Reveal.tsx`**

```tsx
"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.23, 1, 0.32, 1] as const;

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Create `src/components/ui/QuestionHeading.tsx`** (signature interaction 2 — questions arrive like they're being asked: rise + blur settle)

```tsx
"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.23, 1, 0.32, 1] as const;

/** The interviewer's voice. Large Bricolage, blur-rise entrance. */
export function QuestionHeading({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.h2
      initial={
        reduce ? { opacity: 0 } : { opacity: 0, y: 44, filter: "blur(8px)" }
      }
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.9, ease: EASE }}
      className={`font-display text-4xl leading-[1.05] tracking-tight text-balance md:text-6xl lg:text-7xl ${className}`}
    >
      {children}
    </motion.h2>
  );
}
```

- [ ] **Step 3: Create `src/components/ui/GlassPanel.tsx`** (signature interaction 4 — glass catches the light: inner edge glow follows the pointer; no tilt)

```tsx
"use client";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import type { ReactNode } from "react";

export function GlassPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const rawX = useMotionValue(50);
  const x = useSpring(rawX, { stiffness: 80, damping: 20 });
  const sheen = useMotionTemplate`radial-gradient(40% 60% at ${x}% 0%, var(--edge), transparent 70%)`;

  return (
    <motion.div
      className={`glass relative overflow-hidden ${className}`}
      onPointerMove={
        reduce
          ? undefined
          : (e) => {
              const r = e.currentTarget.getBoundingClientRect();
              rawX.set(((e.clientX - r.left) / r.width) * 100);
            }
      }
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-16 opacity-60"
        style={{ background: sheen }}
      />
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui
git commit -m "feat: Reveal, QuestionHeading, and light-catching GlassPanel primitives"
```

---

### Task 8: Thread engine + Beat 0 (Greeting)

**Files:**
- Create: `src/components/thread/ThreadSegment.tsx`
- Create: `src/components/sections/Greeting.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create `src/components/thread/ThreadSegment.tsx`**

A decorative SVG line that draws itself scrubbed by scroll. `variant="tangle"` uses a knotted path; `variant="smooth"` a calm curve; custom `d` overrides. Color defaults to the glow, can be set to `var(--accent)` for clarity flashes.

```tsx
"use client";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";

const PATHS = {
  // loose curl (greeting)
  curl: "M 60 0 C 140 90, -20 170, 70 260 S 30 430, 110 520 C 150 570, 90 600, 100 640",
  // knotted mess (case openings)
  tangle:
    "M 20 20 C 180 -20, 40 180, 200 140 C 340 105, 180 260, 60 220 C -40 185, 150 340, 260 300 C 350 268, 240 420, 120 380 C 40 353, 160 480, 240 460",
  // calm resolving curve (resolutions)
  smooth: "M 20 20 C 120 140, 60 280, 160 380 S 200 560, 240 640",
} as const;

export function ThreadSegment({
  variant = "smooth",
  d,
  viewBox = "0 0 280 660",
  className = "",
  stroke = "var(--glow-a)",
}: {
  variant?: keyof typeof PATHS;
  d?: string;
  viewBox?: string;
  className?: string;
  stroke?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.4"],
  });
  const pathLength = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

  return (
    <div ref={ref} aria-hidden className={`pointer-events-none ${className}`}>
      <svg viewBox={viewBox} fill="none" className="h-full w-full">
        <motion.path
          d={d ?? PATHS[variant]}
          stroke={stroke}
          strokeWidth={1.5}
          strokeLinecap="round"
          style={{ pathLength: reduce ? 1 : pathLength }}
        />
      </svg>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/sections/Greeting.tsx`**

```tsx
"use client";
import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GREETING } from "@/content/content";
import { useSectionLight } from "@/components/light/LightProvider";
import { TEMP } from "@/lib/lightScript";
import { ThreadSegment } from "@/components/thread/ThreadSegment";

const EASE = [0.23, 1, 0.32, 1] as const;

export function Greeting() {
  const ref = useRef<HTMLElement>(null);
  useSectionLight(ref, TEMP.greeting);
  const reduce = useReducedMotion();

  return (
    <section
      id="hello"
      ref={ref}
      className="relative mx-auto flex min-h-[100dvh] max-w-content flex-col justify-between px-6 pb-16 pt-8 md:px-10"
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="text-xs uppercase tracking-[0.18em] text-muted"
      >
        {GREETING.label}
      </motion.p>

      <ThreadSegment
        variant="curl"
        className="absolute right-4 top-24 hidden h-[70vh] w-40 md:block lg:right-16"
      />

      <div className="max-w-[24ch]">
        <motion.h1
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.1, delay: 0.4, ease: EASE }}
          className="font-display text-6xl leading-[0.98] tracking-tight md:text-8xl"
        >
          {GREETING.hello}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9, ease: EASE }}
          className="mt-6 max-w-[38ch] text-lg leading-relaxed text-muted md:text-xl"
        >
          {GREETING.premise}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="mt-14 text-sm italic text-muted"
          aria-hidden
        >
          {GREETING.cue} ↓
        </motion.p>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Update `src/app/page.tsx`**

```tsx
import { Atmosphere } from "@/components/light/Atmosphere";
import { Greeting } from "@/components/sections/Greeting";

export default function Home() {
  return (
    <>
      <Atmosphere />
      <main>
        <Greeting />
      </main>
    </>
  );
}
```

- [ ] **Step 4: Verify visually**

Reload preview. Expected: golden atmosphere; label fades in top-left; "Hi. I'm Sanya." blur-rises lower-left; curled thread on the right (drawn — at top of page the scrub may show it fully or partially drawn; it must not error); scroll cue italic. No console errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/thread/ThreadSegment.tsx src/components/sections/Greeting.tsx src/app/page.tsx
git commit -m "feat: thread engine + Beat 0 greeting"
```

---

### Task 9: Beat 1 — What I do (+ the short version card)

**Files:**
- Create: `src/components/sections/WhatIDo.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create `src/components/sections/WhatIDo.tsx`**

```tsx
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
            <p className="mt-5 font-display text-2xl tracking-tight">{b.name}</p>
            <ul className="mt-3 space-y-1 text-sm text-muted">
              {b.roles.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <p className="mt-5 text-sm">{b.base}</p>
            <ul className="mt-5 flex flex-wrap gap-x-3 gap-y-2 border-t pt-5 text-sm text-muted [border-color:var(--edge)]">
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
```

- [ ] **Step 2: Add to `src/app/page.tsx`** (after `<Greeting />`)

```tsx
import { WhatIDo } from "@/components/sections/WhatIDo";
// ...
      <main>
        <Greeting />
        <WhatIDo />
      </main>
```

- [ ] **Step 3: Verify visually**

Reload preview and scroll. Expected: question blur-rises at the right; two answer paragraphs left; glass brief card right with sheen following the pointer; atmosphere stays golden-warm (temp 0 → 0.3 is a subtle shift). Mobile width (preview resize 375): single column, card below answers.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/WhatIDo.tsx src/app/page.tsx
git commit -m "feat: Beat 1 — what I do + short-version glass brief"
```

---

### Task 10: Beat 2 — the case-study light valleys

The centerpiece. Each case is a normal-flow tall passage (mess → turn → resolution screens); its scroll progress scrubs the light temperature down into the valley and back (spec §4). QBF renders the live video; others get an abstract confidential frame.

**Files:**
- Create: `src/components/sections/CaseValley.tsx`
- Create: `src/components/sections/CaseMediaFrames.tsx`
- Create: `src/components/sections/Work.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create `src/components/sections/CaseMediaFrames.tsx`**

```tsx
"use client";
import { useRef, useState } from "react";
import { ArrowUpRight, Pause, Play } from "@phosphor-icons/react";
import type { CaseMedia } from "@/content/content";
import { GlassPanel } from "@/components/ui/GlassPanel";

function Chrome({ url }: { url: string }) {
  return (
    <div className="flex items-center gap-2 border-b px-4 py-2.5 [border-color:var(--edge)]">
      <span className="size-2 rounded-full bg-[var(--edge)]" />
      <span className="size-2 rounded-full bg-[var(--edge)]" />
      <span className="size-2 rounded-full bg-[var(--edge)]" />
      <span className="ml-3 text-xs tracking-wide text-muted">{url}</span>
    </div>
  );
}

export function LiveFrame({ url, media }: { url: string; media: CaseMedia }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <GlassPanel className="overflow-hidden">
      <Chrome url={url} />
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={media.poster}
          className="block w-full"
        >
          <source src={media.webm} type="video/webm" />
          <source src={media.mp4} type="video/mp4" />
        </video>
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause video" : "Play video"}
          className="pressable absolute bottom-3 right-3 rounded-full bg-[var(--glass)] p-2.5 backdrop-blur-md"
        >
          {playing ? <Pause size={16} weight="fill" /> : <Play size={16} weight="fill" />}
        </button>
      </div>
      <a
        href={media.href}
        target="_blank"
        rel="noopener noreferrer"
        className="pressable group flex items-center justify-between px-5 py-4 text-sm"
      >
        Visit the live site
        <ArrowUpRight
          size={18}
          className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden
        />
      </a>
    </GlassPanel>
  );
}

export function ConfidentialFrame({ url }: { url: string }) {
  return (
    <GlassPanel>
      <Chrome url={url} />
      <div className="space-y-3 p-6" aria-label="Confidential work — abstract preview">
        <div className="h-24 rounded-lg bg-[var(--edge)] opacity-60" />
        <div className="grid grid-cols-3 gap-3">
          <div className="h-16 rounded-lg bg-[var(--edge)] opacity-40" />
          <div className="h-16 rounded-lg bg-[var(--edge)] opacity-40" />
          <div className="h-16 rounded-lg bg-[var(--edge)] opacity-40" />
        </div>
        <div className="h-3 w-2/3 rounded bg-[var(--edge)] opacity-40" />
        <div className="h-3 w-1/2 rounded bg-[var(--edge)] opacity-30" />
        <p className="pt-2 text-xs uppercase tracking-[0.16em] text-muted">
          Confidential
        </p>
      </div>
    </GlassPanel>
  );
}
```

- [ ] **Step 2: Create `src/components/sections/CaseValley.tsx`**

```tsx
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
    // only steer the light while this case is actually the active passage
    if (p > 0.001 && p < 0.999) temp.set(valley.get());
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
```

- [ ] **Step 3: Create `src/components/sections/Work.tsx`**

```tsx
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
```

- [ ] **Step 4: Add to `src/app/page.tsx`** (after `<WhatIDo />`)

```tsx
import { Work } from "@/components/sections/Work";
// ...
        <Greeting />
        <WhatIDo />
        <Work />
```

- [ ] **Step 5: Verify the valleys**

Reload preview and scroll the whole Work beat slowly. Expected, per case:
- Approaching a case: atmosphere sinks toward ember/wine; text flips to cream ink (readable at every point — spot-check mid-transition).
- Kahramaa's mess screen reaches near-jet darkness (deepest valley); Qatar University's stays winey (shallow).
- Tangled thread draws beside each mess; turquoise smooth thread beside each resolution; outcome line renders in turquoise.
- QBF resolution shows the video with working pause/play button and "Visit the live site" link; other cases show the confidential skeleton frame.
- Scrolling UP re-scrubs the light correctly (valleys are scrubbed, not triggered).
- Sweep incrementally when testing with Lenis; wait ≥800ms after any programmatic jump.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/CaseValley.tsx src/components/sections/CaseMediaFrames.tsx src/components/sections/Work.tsx src/app/page.tsx
git commit -m "feat: Beat 2 — four case-study light valleys with live/confidential frames"
```

---

### Task 11: Beat 3 — The messy middle (beliefs + skill index)

**Files:**
- Create: `src/components/sections/MessyMiddle.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create `src/components/sections/MessyMiddle.tsx`**

```tsx
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
  useSectionLight(ref, TEMP.messyMiddle);

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
```

- [ ] **Step 2: Add to `src/app/page.tsx`** (after `<Work />`): import and render `<MessyMiddle />`.

```tsx
import { MessyMiddle } from "@/components/sections/MessyMiddle";
```

- [ ] **Step 3: Verify visually**

Expected: after the last valley the world grades into the dusk-turquoise stop; beliefs alternate left/right, arriving one per ~half viewport; domain labels in turquoise; the glass skill index reads as a quiet ledger. Mobile: single column, everything legible.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/MessyMiddle.tsx src/app/page.tsx
git commit -m "feat: Beat 3 — five beliefs + practical skill index in dusk light"
```

---

### Task 12: Beat 4 — Story

**Files:**
- Create: `src/components/sections/Story.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create `src/components/sections/Story.tsx`**

```tsx
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
```

- [ ] **Step 2: Add `<Story />` to `src/app/page.tsx`** after `<MessyMiddle />`.

- [ ] **Step 3: Verify visually**

Expected: light warms from dusk back toward ember; three staggered glass vignettes with cascading offsets; closing line large. Question sits right (anchor variety maintained: B1 right, B2 left, B3 left, B4 right).

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Story.tsx src/app/page.tsx
git commit -m "feat: Beat 4 — three story moments warming the light"
```

---

### Task 13: Beat 5 — Playground (hobby projects)

**Files:**
- Create: `src/components/sections/PlaygroundBeat.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create `src/components/sections/PlaygroundBeat.tsx`**

```tsx
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
              </div>
              <div className="mt-14">
                <p className="font-display text-2xl tracking-tight md:text-3xl">
                  {item.title}
                </p>
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
```

- [ ] **Step 2: Add `<PlaygroundBeat />` to `src/app/page.tsx`** after `<Story />`.

- [ ] **Step 3: Verify visually**

Expected: bright, playful warmth (near-golden); AI Prompt Guide tile links to `/ai-prompt-guide.html` in a new tab; arrow nudges on hover; "talked teams out of building" aside kicker in turquoise.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/PlaygroundBeat.tsx src/app/page.tsx
git commit -m "feat: Beat 5 — playground hobby projects"
```

---

### Task 14: Beat 6 — Invitation (+ thread bow + footer)

**Files:**
- Create: `src/components/sections/Invitation.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create `src/components/sections/Invitation.tsx`**

```tsx
"use client";
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { INVITATION } from "@/content/content";
import { useSectionLight } from "@/components/light/LightProvider";
import { TEMP } from "@/lib/lightScript";
import { QuestionHeading } from "@/components/ui/QuestionHeading";
import { Reveal } from "@/components/ui/Reveal";

/** The thread ties itself into a small bow beside the CTA. */
function ThreadBow() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduce = useReducedMotion();
  return (
    <svg
      ref={ref}
      aria-hidden
      viewBox="0 0 120 80"
      fill="none"
      className="h-14 w-20"
    >
      <motion.path
        d="M 6 44 C 30 20, 50 20, 58 40 C 64 55, 44 66, 36 52 C 28 38, 54 30, 70 38 C 90 48, 96 60, 114 50"
        stroke="var(--accent)"
        strokeWidth={2}
        strokeLinecap="round"
        initial={{ pathLength: reduce ? 1 : 0 }}
        animate={inView ? { pathLength: 1 } : undefined}
        transition={{ duration: 1.4, ease: [0.23, 1, 0.32, 1], delay: 0.4 }}
      />
    </svg>
  );
}

export function Invitation() {
  const ref = useRef<HTMLElement>(null);
  useSectionLight(ref, TEMP.invitation);

  return (
    <section
      id="talk"
      ref={ref}
      className="mx-auto flex min-h-[100dvh] max-w-content flex-col justify-center px-6 py-24 md:px-10"
    >
      <QuestionHeading className="max-w-[16ch]">
        {INVITATION.question}
      </QuestionHeading>
      <Reveal delay={0.1}>
        <p className="mt-8 max-w-[44ch] text-lg leading-relaxed text-muted md:text-xl">
          {INVITATION.answer}
        </p>
      </Reveal>
      <Reveal delay={0.2}>
        <div className="mt-14 flex items-center gap-5">
          <a
            href={`mailto:${INVITATION.email}`}
            className="pressable glass inline-block px-8 py-4 text-lg font-medium"
          >
            {INVITATION.cta}
          </a>
          <ThreadBow />
        </div>
      </Reveal>
      <footer className="mt-auto pt-24">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">
          {INVITATION.footer}
        </p>
      </footer>
    </section>
  );
}
```

- [ ] **Step 2: Add `<Invitation />` to `src/app/page.tsx`** after `<PlaygroundBeat />`.

- [ ] **Step 3: Verify visually**

Expected: the brightest, warmest screen of the site; CTA is a glass button that compresses on press and opens `mailto:`; the turquoise bow draws itself once when the CTA area enters view; tiny footer at the bottom.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Invitation.tsx src/app/page.tsx
git commit -m "feat: Beat 6 — invitation with thread bow and footer"
```

---

### Task 15: ThreadNav — the edge navigation

**Files:**
- Create: `src/components/nav/ThreadNav.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create `src/components/nav/ThreadNav.tsx`**

```tsx
"use client";
import { useEffect, useState } from "react";
import type Lenis from "lenis";
import { BEATS } from "@/content/content";

/**
 * A fine vertical thread at the right edge with seven nodes (spec §7).
 * Programmatic jumps go through Lenis (V2 lesson: native smooth scrollTo
 * fights Lenis's rAF loop; lenis.scrollTo is reliable).
 */
export function ThreadNav() {
  const [active, setActive] = useState<string>(BEATS[0].id);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    for (const b of BEATS) {
      const el = document.getElementById(b.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (lenis) lenis.scrollTo(el, { duration: 1.2 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Conversation"
      className="fixed right-5 top-1/2 z-10 hidden -translate-y-1/2 md:block"
    >
      <ul className="relative flex flex-col items-center gap-5 before:absolute before:inset-y-0 before:left-1/2 before:w-px before:-translate-x-1/2 before:bg-[var(--edge)]">
        {BEATS.map((b) => {
          const current = active === b.id;
          return (
            <li key={b.id} className="group relative">
              <button
                type="button"
                onClick={() => go(b.id)}
                aria-label={b.label}
                aria-current={current ? "true" : undefined}
                className="pressable relative block size-4 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                <span
                  className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ${
                    current
                      ? "size-2.5 bg-[var(--accent)]"
                      : "size-1.5 bg-[var(--muted)] group-hover:size-2"
                  }`}
                />
              </button>
              <span className="pointer-events-none absolute right-7 top-1/2 -translate-y-1/2 whitespace-nowrap text-xs text-muted opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
                {b.label}
              </span>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 2: Final `src/app/page.tsx`**

```tsx
import { Atmosphere } from "@/components/light/Atmosphere";
import { ThreadNav } from "@/components/nav/ThreadNav";
import { Greeting } from "@/components/sections/Greeting";
import { WhatIDo } from "@/components/sections/WhatIDo";
import { Work } from "@/components/sections/Work";
import { MessyMiddle } from "@/components/sections/MessyMiddle";
import { Story } from "@/components/sections/Story";
import { PlaygroundBeat } from "@/components/sections/PlaygroundBeat";
import { Invitation } from "@/components/sections/Invitation";

export default function Home() {
  return (
    <>
      <Atmosphere />
      <ThreadNav />
      <main>
        <Greeting />
        <WhatIDo />
        <Work />
        <MessyMiddle />
        <Story />
        <PlaygroundBeat />
        <Invitation />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Verify navigation**

Expected: seven nodes at the right edge (hidden on mobile); active node turquoise and larger, tracking as you scroll; hover reveals the beat label; clicking a node smooth-travels there (via Lenis — wait ≥800ms before asserting position); keyboard: Tab reaches nodes, Enter activates, focus ring visible, label shows on focus.

- [ ] **Step 4: Commit**

```bash
git add src/components/nav/ThreadNav.tsx src/app/page.tsx
git commit -m "feat: thread-edge navigation with seven beat nodes"
```

---

### Task 16: Full verification pass + polish

**Files:**
- Possibly modify: any file failing verification

- [ ] **Step 1: Static checks**

```bash
npx tsc --noEmit && npm test && npm run lint && npm run build
```

Expected: all PASS.

- [ ] **Step 2: Full-page walkthrough (desktop)**

In a real browser at the dev URL (preview iframe is too narrow for desktop layouts), scroll the entire page slowly, top to bottom and back. Check against spec §13 success criteria:
- Opening feels warm within ten seconds; no monumental darkness up front.
- Light valley arc is felt: each case darkens into its mess and resolves into warmth; Kahramaa clearly darkest.
- Turquoise appears ONLY at: case outcome lines + resolution threads, belief domain labels, playground aside kicker, nav active node, thread bow. Nowhere else.
- Every screen's text is comfortably readable, including mid-grade moments.
- No layout shift, no horizontal scrollbar at any width.

- [ ] **Step 3: Mobile pass**

Resize preview to 375px. Expected: single column everywhere; ThreadNav hidden; question type scales down but stays dominant; case valleys still scrub the light; video plays inline (playsInline).

- [ ] **Step 4: Reduced-motion pass**

Emulate `prefers-reduced-motion: reduce` (DevTools → Rendering). Expected: no smooth scroll, world changes near-instant, threads fully drawn, reveals are opacity-only, drift animation off, cursor warmth off. Nothing broken or invisible.

- [ ] **Step 5: Accessibility spot-checks**

- Heading order: one `h1` (greeting), `h2` per question, `h3` per case client.
- Keyboard-only run: nav nodes, video pause button, all links reachable and operable with visible focus.
- Contrast: sample `--ink` vs `--bg` at each stop via DevTools color picker — AA for body text at stops 0–4.

- [ ] **Step 6: Performance sanity**

DevTools Performance panel: record a scroll through one case valley. Expected: no long tasks from the atmosphere (CSS var writes are cheap), animation frames near 60fps. If the gradient layers jank, reduce grain opacity/size or blur radius.

- [ ] **Step 7: Fix anything found, then commit**

```bash
git add -A
git commit -m "chore: verification pass — a11y, reduced motion, mobile, perf"
```

---

## Self-review notes (already applied)

- **Spec coverage:** all seven beats (Tasks 8–14), four named cases with varied depths (Task 10 + content Task 4), short-version brief (Task 9), skill index (Task 11), hobby projects (Task 13), thread motif + bow (Tasks 8, 10, 14), thread-edge nav (Task 15), living light + cursor warmth + grain (Task 6), OKLCH interpolation (Tasks 2–3), reduced motion everywhere, Lenis jump lesson (Task 15), launch.json (Task 1).
- **Deliberately deferred (spec §9 pending-from-Sanya):** real case metrics, Field Notes, LinkedIn URL — content.ts additions only, no structural change needed when they arrive.
- **Type consistency:** `LightTokens` keys ↔ `VAR_MAP` ↔ globals.css var names all match (`bg/ink/muted/glowA→--glow-a/glowB→--glow-b/glass/edge`); `TEMP` keys match beat components; `CaseStudy` fields match `content.ts` and `CaseValley` usage.
