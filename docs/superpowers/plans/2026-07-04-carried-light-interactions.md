# Carried Light (V3.6) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Site-wide interaction-density pass — a dual-mode custom cursor (ember/lens, evaluation toggle), origin cards as lived-in scenes, and six curated micro-interaction moments.

**Architecture:** One `CursorProvider` brain (window-level MotionValue tracking + delegated `data-cursor` target detection, zero React renders on pointermove) feeds two swappable skins. Cards and site-wide moments are per-component motion layers driven by CSS variables or MotionValues — never React state on move. Everything degrades to today's site on touch/reduced-motion.

**Tech Stack:** Next 16 (App Router, static export), React 19, Tailwind v4 CSS-first, framer-motion 12, vitest. Spec: `docs/superpowers/specs/2026-07-04-carried-light-interactions-design.md` — read it first.

**Project rules that bind every task** (from `AGENTS.md` + prior specs):
- Animate only `transform`/`opacity`/`clip-path`; gradients only via CSS vars on decorative layers.
- All copy in `src/content/content.ts`.
- Every animation needs a reduced-motion fallback via `useReducedMotionSafe` (NOT framer's `useReducedMotion` — SSR-safe wrapper at `src/lib/useReducedMotionSafe.ts`).
- Do NOT touch `src/lib/lightScript.ts` tokens, `sampleLight`, or `src/components/sections/HeroIllustration.tsx` internals.
- Never write raw `backdrop-filter` as a plain sibling of its `-webkit-` twin in CSS files (Lightning CSS dedups it away) — use the `@supports` pattern already in `globals.css`. Inline React styles are NOT affected.
- Dev server: `npm run dev` (port 3000/3001). `next build` fails EPERM while the dev server runs — stop it first.
- Verify visually with the headless Playwright harness pattern (`scratchpad/verify-live.mjs` style — import playwright from `../portfolio/_capture/node_modules` by absolute file URL); the in-app preview tab freezes rAF when backgrounded, do not trust it.
- Commit after every task. Do NOT push until the final task (push triggers the GitHub Pages deploy).

---

## File map

| File | Role |
|---|---|
| `src/lib/cursor.ts` (new) | Cursor types, context, `useCursor`, pure helpers `stretchFor`/`proximity` |
| `src/lib/cursor.test.ts` (new) | Unit tests for the pure helpers |
| `src/components/cursor/CursorProvider.tsx` (new) | Brain: activation, tracking, target detection, mode persistence, renders skin + toggle |
| `src/components/cursor/EmberCursor.tsx` (new) | Skin A |
| `src/components/cursor/LensCursor.tsx` (new) | Skin B |
| `src/components/cursor/CursorLabel.tsx` (new) | Shared label chip |
| `src/components/cursor/CursorToggle.tsx` (new) | Evaluation toggle |
| `src/components/sections/about/VignetteCard.tsx` (new) | Lived-in origin card |
| `src/content/content.ts` | + `CURSOR` labels |
| `src/app/globals.css` | + cursor-hidden, vignette-pencil, tile-glow, cta-glow, nav-dot rules |
| `src/app/layout.tsx` | Mount `CursorProvider` |
| `src/components/sections/about/{OriginVignettes,glyphs,UntanglingMap}.tsx` | Card refactor, living glyphs, connection lines |
| `src/components/sections/{Greeting,Invitation,BeliefsBento,CaseMediaFrames}.tsx` | Annotations, CTA glow, bento glow |
| `src/components/sections/work/WorkStage.tsx`, `src/components/nav/ThreadNav.tsx`, `src/components/sections/workbench/Workbench.tsx`, `src/components/ui/GlassPanel.tsx` | Annotations, proximity glow, artifact lean |

---

### Task CL-1: Cursor pure helpers + shared types (TDD)

**Files:**
- Create: `src/lib/cursor.ts`
- Create: `src/lib/cursor.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/cursor.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { proximity, stretchFor } from "./cursor";

describe("stretchFor", () => {
  it("is 1 at rest", () => {
    expect(stretchFor(0)).toBe(1);
  });
  it("grows with speed", () => {
    expect(stretchFor(2500)).toBeCloseTo(1.15);
  });
  it("caps at 1.3", () => {
    expect(stretchFor(50000)).toBe(1.3);
  });
  it("never dips below 1 for negative speeds", () => {
    expect(stretchFor(-500)).toBe(1);
  });
});

describe("proximity", () => {
  it("is 1 at zero distance", () => {
    expect(proximity(0, 120)).toBe(1);
  });
  it("fades linearly", () => {
    expect(proximity(60, 120)).toBeCloseTo(0.5);
  });
  it("clamps to 0 beyond the radius", () => {
    expect(proximity(200, 120)).toBe(0);
  });
  it("is 0 for a degenerate radius", () => {
    expect(proximity(10, 0)).toBe(0);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/cursor.test.ts`
Expected: FAIL — `Failed to resolve import "./cursor"`.

- [ ] **Step 3: Implement `src/lib/cursor.ts`**

```ts
"use client";
import { createContext, useContext } from "react";
import type { MotionValue } from "framer-motion";

export type CursorMode = "ember" | "lens";
export type CursorKind =
  | "default"
  | "link"
  | "nav"
  | "case"
  | "play"
  | "art"
  | "absorb";

export type CursorTarget = {
  kind: CursorKind;
  label?: string;
  /** Measured once on target-enter; used for soft snap / absorb. */
  rect?: DOMRect;
} | null;

export type CursorState = {
  /** Raw pointer position in viewport px (skins add their own springs). */
  x: MotionValue<number>;
  y: MotionValue<number>;
  /** 0 | 1 */
  pressed: MotionValue<number>;
  /** 0 | 1 — pointer inside the document */
  visible: MotionValue<number>;
  target: CursorTarget;
  mode: CursorMode;
  setMode: (m: CursorMode) => void;
};

export const CursorContext = createContext<CursorState | null>(null);

export function useCursor(): CursorState {
  const ctx = useContext(CursorContext);
  if (!ctx) throw new Error("useCursor must be used inside CursorProvider");
  return ctx;
}

/** Velocity (px/s) → comet stretch: 1 at rest, capped at 1.3. */
export function stretchFor(speed: number): number {
  return 1 + Math.min(Math.max(speed, 0) / 5000, 0.3);
}

/** Distance (px) → 0..1 glow within `radius`; 0 outside or for radius ≤ 0. */
export function proximity(dist: number, radius: number): number {
  if (radius <= 0) return 0;
  return Math.max(0, Math.min(1, 1 - dist / radius));
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/cursor.test.ts`
Expected: 8 passing.

- [ ] **Step 5: Commit**

```bash
git add src/lib/cursor.ts src/lib/cursor.test.ts
git commit -m "feat: cursor state types + pure motion helpers (TDD)"
```

---

### Task CL-2: CursorProvider brain + Ember skin + label chip

Ships the ember cursor end-to-end. Lens + toggle come in CL-3.

**Files:**
- Create: `src/components/cursor/CursorProvider.tsx`
- Create: `src/components/cursor/EmberCursor.tsx`
- Create: `src/components/cursor/CursorLabel.tsx`
- Modify: `src/app/globals.css` (append)
- Modify: `src/app/layout.tsx:46-50`

- [ ] **Step 1: Append cursor CSS to `src/app/globals.css`**

```css
/* Carried Light cursor: ember mode hides the native cursor everywhere.
   The class is applied by CursorProvider only on fine pointers without
   reduced motion, and removed on unmount/mode switch. */
html.cursor-hidden,
html.cursor-hidden * {
  cursor: none !important;
}
```

- [ ] **Step 2: Create `src/components/cursor/CursorLabel.tsx`**

```tsx
"use client";
import { AnimatePresence, motion, useSpring } from "framer-motion";
import { useCursor } from "@/lib/cursor";
import { EASE } from "@/lib/motion";

/** Small glass chip trailing the pointer whenever the target carries a label. */
export function CursorLabel() {
  const { x, y, target } = useCursor();
  const sx = useSpring(x, { stiffness: 400, damping: 35 });
  const sy = useSpring(y, { stiffness: 400, damping: 35 });

  return (
    <AnimatePresence>
      {target?.label ? (
        <motion.div
          key={target.label}
          className="absolute left-0 top-0"
          style={{ x: sx, y: sy }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.12 } }}
          transition={{ duration: 0.16, ease: EASE }}
        >
          <motion.span
            initial={{ y: 4 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.16, ease: EASE }}
            className="glass block translate-x-[18px] translate-y-[18px] whitespace-nowrap !rounded-full px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-ink"
          >
            {target.label}
          </motion.span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
```

- [ ] **Step 3: Create `src/components/cursor/EmberCursor.tsx`**

```tsx
"use client";
import {
  motion,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { stretchFor, useCursor } from "@/lib/cursor";
import { EASE } from "@/lib/motion";
import { CursorLabel } from "./CursorLabel";

const FOLLOW = { stiffness: 700, damping: 42 };

/** Ring diameter per target kind (px); 0 = no ring (bead/halo states). */
const RING: Record<string, number> = { link: 26, nav: 26, case: 40, play: 32 };

export function EmberCursor() {
  const { x, y, pressed, visible, target } = useCursor();
  const kind = target?.kind ?? "default";

  // Soft snap: lean 30% toward link/nav centers; absorb pulls all the way in.
  const pull = kind === "absorb" ? 1 : kind === "link" || kind === "nav" ? 0.3 : 0;
  const rect = target?.rect;
  const tx = useTransform(x, (v) =>
    rect && pull ? v + (rect.left + rect.width / 2 - v) * pull : v
  );
  const ty = useTransform(y, (v) =>
    rect && pull ? v + (rect.top + rect.height / 2 - v) * pull : v
  );
  const sx = useSpring(tx, FOLLOW);
  const sy = useSpring(ty, FOLLOW);

  // Velocity → comet stretch, oriented along the motion vector (default state only).
  const vx = useVelocity(sx);
  const vy = useVelocity(sy);
  const speed = useTransform(() => Math.hypot(vx.get(), vy.get()));
  const stretchRaw = useSpring(useTransform(speed, stretchFor), {
    stiffness: 300,
    damping: 30,
  });
  const stretch = useTransform(stretchRaw, (s) => (kind === "default" ? s : 1));
  const squash = useTransform(stretch, (s) => 1 / s);
  const angle = useTransform(() => (Math.atan2(vy.get(), vx.get()) * 180) / Math.PI);

  const pressScale = useSpring(useTransform(pressed, [0, 1], [1, 0.8]), {
    stiffness: 400,
    damping: 30,
  });
  const opacity = useSpring(visible, { stiffness: 300, damping: 30 });

  const ring = RING[kind] ?? 0;
  const absorbed = kind === "absorb";
  const halo = kind === "art";

  return (
    <>
      {/* position layer → press layer → velocity layer → state visuals */}
      <motion.div
        className="absolute left-0 top-0"
        style={{ x: sx, y: sy, opacity }}
      >
        <motion.div
          style={{ scale: pressScale }}
          animate={{
            scale: absorbed ? 0.4 : 1,
            opacity: absorbed ? 0 : 1,
          }}
          transition={{ duration: 0.32, ease: EASE }}
        >
          <motion.div style={{ rotate: angle, scaleX: stretch, scaleY: squash }}>
            {/* the bead — visible in default + absorb-approach */}
            <motion.div
              className="absolute rounded-full"
              animate={{ opacity: ring || halo ? 0 : 1, scale: ring || halo ? 0.4 : 1 }}
              transition={{ duration: 0.2, ease: EASE }}
              style={{
                width: 10,
                height: 10,
                left: -5,
                top: -5,
                background:
                  "radial-gradient(circle at 35% 35%, oklch(1 0 0 / 0.9), var(--glow-a) 60%, transparent)",
                boxShadow: "0 0 14px 2px var(--glow-a), inset 0 0 0 1px var(--edge)",
              }}
            />
          </motion.div>

          {/* the ring — link/nav/case/play */}
          <motion.div
            className="absolute rounded-full"
            animate={{
              opacity: ring ? 1 : 0,
              width: ring || 26,
              height: ring || 26,
              left: -(ring || 26) / 2,
              top: -(ring || 26) / 2,
            }}
            transition={{ duration: 0.2, ease: EASE }}
            style={{
              border: "1.5px solid var(--ink)",
              opacity: 0,
              boxShadow: "0 0 14px 0 var(--glow-a)",
            }}
          >
            {/* play glyph inside the ring */}
            <motion.span
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              animate={{ opacity: kind === "play" ? 0.8 : 0 }}
              transition={{ duration: 0.15 }}
              style={{
                width: 0,
                height: 0,
                borderTop: "5px solid transparent",
                borderBottom: "5px solid transparent",
                borderLeft: "8px solid var(--ink)",
                marginLeft: 1,
              }}
            />
          </motion.div>

          {/* the halo — art */}
          <motion.div
            className="absolute rounded-full"
            animate={{ opacity: halo ? 0.55 : 0, scale: halo ? 1 : 0.3 }}
            transition={{ duration: 0.25, ease: EASE }}
            style={{
              width: 64,
              height: 64,
              left: -32,
              top: -32,
              background: "radial-gradient(circle, var(--glow-a), transparent 70%)",
            }}
          />
        </motion.div>
      </motion.div>
      <CursorLabel />
    </>
  );
}
```

Note the ring div: its border opacity comes from `animate` (0 → 1); the static `style.opacity: 0` is the pre-mount value. The ring border uses `var(--ink)` at full strength but the div's own animated opacity caps perceived strength; the spec's "45%" reads correctly because the ring also carries the soft glow. If the implementer finds the ring too heavy visually, change `border` to `1.5px solid color-mix(in oklch, var(--ink) 45%, transparent)` — do not add new tokens.

- [ ] **Step 4: Create `src/components/cursor/CursorProvider.tsx`**

```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { useMotionValue } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import {
  CursorContext,
  type CursorKind,
  type CursorMode,
  type CursorTarget,
} from "@/lib/cursor";
import { EmberCursor } from "./EmberCursor";

const FINE_QUERY = "(hover: hover) and (pointer: fine)";

export function CursorProvider() {
  const reduce = useReducedMotionSafe();
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(FINE_QUERY);
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const active = fine && !reduce;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const pressed = useMotionValue(0);
  const visible = useMotionValue(0);
  const [target, setTarget] = useState<CursorTarget>(null);
  const lastEl = useRef<Element | null>(null);

  const [mode, setModeState] = useState<CursorMode>("ember");
  useEffect(() => {
    const saved = localStorage.getItem("cursor-mode");
    if (saved === "lens" || saved === "ember") setModeState(saved);
  }, []);
  const setMode = (m: CursorMode) => {
    setModeState(m);
    localStorage.setItem("cursor-mode", m);
  };

  // Ember hides the native cursor; lens keeps it.
  useEffect(() => {
    const on = active && mode === "ember";
    document.documentElement.classList.toggle("cursor-hidden", on);
    return () => document.documentElement.classList.remove("cursor-hidden");
  }, [active, mode]);

  useEffect(() => {
    if (!active) return;
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      visible.set(1);
    };
    const onDown = () => pressed.set(1);
    const onUp = () => pressed.set(0);
    // Delegated target detection — fires on element boundaries, not per move.
    const onOver = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.("[data-cursor]") ?? null;
      if (el === lastEl.current) return;
      lastEl.current = el;
      if (!el) {
        setTarget(null);
        return;
      }
      const d = (el as HTMLElement).dataset;
      setTarget({
        kind: (d.cursor as CursorKind) ?? "default",
        label: d.cursorLabel,
        rect: el.getBoundingClientRect(),
      });
    };
    const onOut = (e: PointerEvent) => {
      if (e.relatedTarget === null) visible.set(0);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      lastEl.current = null;
      setTarget(null);
    };
  }, [active, x, y, pressed, visible]);

  if (!active) return null;

  return (
    <CursorContext.Provider value={{ x, y, pressed, visible, target, mode, setMode }}>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999]">
        <EmberCursor />
      </div>
    </CursorContext.Provider>
  );
}
```

(Lens rendering + the toggle are added in CL-3 — this file is edited again there.)

- [ ] **Step 5: Mount in `src/app/layout.tsx`**

Add the import and mount as a sibling of `SmoothScroll` inside `LightProvider`:

```tsx
import { CursorProvider } from "@/components/cursor/CursorProvider";
```

```tsx
      <body>
        <LightProvider>
          <SmoothScroll>{children}</SmoothScroll>
          <CursorProvider />
        </LightProvider>
      </body>
```

- [ ] **Step 6: Verify in dev**

Run `npm run dev` if not running. Headless check (adapt `scratchpad/verify-live.mjs`, launch chromium with default fine pointer):
- `document.documentElement.classList.contains("cursor-hidden")` → true after a synthetic `pointermove`.
- The overlay `div[aria-hidden].pointer-events-none.fixed` exists with an ember bead child.
- Dispatch `pointermove` at 200,200 then read the bead wrapper's transform — it tracks.
- Emulate `prefers-reduced-motion: reduce` (new context) → provider renders nothing, no `cursor-hidden` class.
- Console: zero errors.
- `npx eslint src/components/cursor src/lib/cursor.ts` and `npx tsc --noEmit` pass.

- [ ] **Step 7: Commit**

```bash
git add src/components/cursor src/app/globals.css src/app/layout.tsx
git commit -m "feat: cursor brain + ember light-bearer skin"
```

---

### Task CL-3: Lens skin + evaluation toggle

**Files:**
- Create: `src/components/cursor/LensCursor.tsx`
- Create: `src/components/cursor/CursorToggle.tsx`
- Modify: `src/components/cursor/CursorProvider.tsx` (render by mode + toggle)

- [ ] **Step 1: Create `src/components/cursor/LensCursor.tsx`**

```tsx
"use client";
import { motion, useSpring } from "framer-motion";
import { useCursor } from "@/lib/cursor";
import { EASE } from "@/lib/motion";
import { CursorLabel } from "./CursorLabel";

const LAZY = { stiffness: 120, damping: 22 };
const BASE = 72; // disc diameter at rest

/** Scale per target kind (disc contracts on targets, admires art, hugs the CTA). */
function scaleFor(kind: string | undefined): number {
  switch (kind) {
    case "art":
      return 96 / BASE;
    case "absorb":
      return 40 / BASE;
    case "link":
    case "nav":
    case "case":
    case "play":
      return 48 / BASE;
    default:
      return 1;
  }
}

export function LensCursor() {
  const { x, y, pressed, visible, target } = useCursor();
  const sx = useSpring(x, LAZY);
  const sy = useSpring(y, LAZY);
  const opacity = useSpring(visible, { stiffness: 300, damping: 30 });
  const press = useSpring(pressed, { stiffness: 400, damping: 30 });
  const kind = target?.kind;
  const hot = Boolean(kind);

  return (
    <>
      <motion.div
        className="absolute left-0 top-0"
        style={{ x: sx, y: sy, opacity }}
      >
        <motion.div
          className="rounded-full"
          animate={{ scale: scaleFor(kind) }}
          transition={{ duration: 0.25, ease: EASE }}
          style={{
            width: BASE,
            height: BASE,
            marginLeft: -BASE / 2,
            marginTop: -BASE / 2,
            border: "1px solid var(--edge)",
            boxShadow: "inset 0 1px 0 var(--edge), 0 4px 24px oklch(0 0 0 / 0.06)",
            // Inline styles bypass Lightning CSS — safe to set both here.
            WebkitBackdropFilter: hot
              ? "brightness(1.12) saturate(1.06)"
              : "brightness(1.07) saturate(1.06)",
            backdropFilter: hot
              ? "brightness(1.12) saturate(1.06)"
              : "brightness(1.07) saturate(1.06)",
            scale: press.get() ? 0.92 : 1,
          }}
        />
      </motion.div>
      <CursorLabel />
    </>
  );
}
```

Note: the press squeeze belongs on the outer wrapper as a spring, not a `.get()` read. Implementer: replace the last `scale` line by wrapping the disc in `<motion.div style={{ scale: useTransform(press, [0, 1], [1, 0.92]) }}>` (import `useTransform`). The lens NEVER blurs — brightness/saturate only (haze lesson).

- [ ] **Step 2: Create `src/components/cursor/CursorToggle.tsx`**

```tsx
"use client";
import { useCursor, type CursorMode } from "@/lib/cursor";

const MODES: CursorMode[] = ["ember", "lens"];

/** Temporary evaluation affordance — deleted once Sanya picks a winner. */
export function CursorToggle() {
  const { mode, setMode } = useCursor();
  return (
    <div
      role="group"
      aria-label="Cursor style (preview)"
      className="glass fixed bottom-5 left-5 z-[60] hidden items-center gap-1 !rounded-full p-1 md:flex"
    >
      {MODES.map((m) => (
        <button
          key={m}
          type="button"
          data-cursor="link"
          aria-pressed={mode === m}
          onClick={() => setMode(m)}
          className={`pressable rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em] transition-colors duration-200 ${
            mode === m ? "bg-[var(--edge)] text-ink" : "text-muted"
          }`}
        >
          {m}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Wire mode + toggle in `CursorProvider.tsx`**

Add imports:

```tsx
import { LensCursor } from "./LensCursor";
import { CursorToggle } from "./CursorToggle";
```

Replace the return block's overlay contents:

```tsx
  return (
    <CursorContext.Provider value={{ x, y, pressed, visible, target, mode, setMode }}>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999]">
        {mode === "ember" ? <EmberCursor /> : <LensCursor />}
      </div>
      <CursorToggle />
    </CursorContext.Provider>
  );
```

(The toggle sits OUTSIDE the `pointer-events-none` overlay so it stays clickable.)

- [ ] **Step 4: Verify in dev (headless)**

- Toggle chip exists (`[aria-label="Cursor style (preview)"]`), two buttons.
- Click `lens` → `cursor-hidden` class removed from `<html>`; disc element present (72px, border var(--edge)); `localStorage.getItem("cursor-mode") === "lens"`.
- Reload → mode still lens. Click `ember` → class returns, bead present.
- Reduced-motion context → no toggle rendered.
- Lint + tsc clean.

- [ ] **Step 5: Commit**

```bash
git add src/components/cursor
git commit -m "feat: lens spotlight skin + ember/lens evaluation toggle"
```

---

### Task CL-4: Site-wide cursor target annotations + CTA glow

**Files:**
- Modify: `src/content/content.ts` (append)
- Modify: `src/app/globals.css` (append)
- Modify: `src/components/sections/Greeting.tsx:34`
- Modify: `src/components/sections/Invitation.tsx:59-67`
- Modify: `src/components/sections/CaseMediaFrames.tsx:35`
- Modify: `src/components/sections/work/WorkStage.tsx:121,132`
- Modify: `src/components/nav/ThreadNav.tsx:54-60`
- Modify: `src/components/sections/workbench/Workbench.tsx:18`
- Modify: `src/components/sections/about/UntanglingMap.tsx:214-218`

- [ ] **Step 1: Append `CURSOR` to `src/content/content.ts`** (at end of file)

```ts
/** Cursor label microcopy (Carried Light). Pointer-only — never read by SRs. */
export const CURSOR = {
  labels: {
    stage: "keep scrolling",
    caseRead: "read",
    play: "watch",
    open: "open",
    say: "say hello",
  },
} as const;
```

- [ ] **Step 2: Append CTA glow to `src/app/globals.css`**

```css
/* Invitation CTA: its own light blooms on hover (works in both cursor modes
   and with the cursor system inactive). */
.cta-glow {
  transition: box-shadow 350ms var(--ease);
}
.cta-glow:hover {
  box-shadow: 0 0 0 1px var(--edge), 0 0 36px var(--glow-a);
}
```

- [ ] **Step 3: Annotate components**

`Greeting.tsx` — replace line 34's `<HeroIllustration …/>` with a wrapper carrying the positioning classes (HeroIllustration internals untouched):

```tsx
      <div
        data-cursor="art"
        className="absolute right-0 top-1/2 hidden aspect-[571/434] w-[54%] max-w-[680px] -translate-y-1/2 md:block"
      >
        <HeroIllustration className="h-full w-full" />
      </div>
```

`Invitation.tsx` — import `CURSOR` from `@/content/content`; the CTA `<motion.a>` gains:

```tsx
          <motion.a
            href={`mailto:${INVITATION.email}`}
            data-cursor="absorb"
            data-cursor-label={CURSOR.labels.say}
            className="pressable glass cta-glow inline-block px-8 py-4 text-lg font-medium"
            style={{ x: magnet.x, y: magnet.y }}
            {...magnet.handlers}
          >
```

`CaseMediaFrames.tsx` — import `CURSOR`; the `div.relative` wrapping the `<video>` (line 35) gains `data-cursor="play" data-cursor-label={CURSOR.labels.play}`.

`WorkStage.tsx` — import `CURSOR`; the sticky stage div (line 121) gains `data-cursor="case" data-cursor-label={CURSOR.labels.stage}`; each case-select button inside the `nav` (line 132's list) gains `data-cursor="nav"`.

`ThreadNav.tsx` — each node `<button>` gains `data-cursor="nav"`.

`Workbench.tsx` — import `CURSOR`; the PlaybookArtifact `<a>` (line 18) gains `data-cursor="link" data-cursor-label={CURSOR.labels.open}`.

`UntanglingMap.tsx` — the replay `<button>` gains `data-cursor="link"`.

- [ ] **Step 4: Verify (headless)**

- `document.querySelectorAll("[data-cursor]").length` ≥ 12 (6 thread-nav nodes + stage + stage nav buttons + video + hero + CTA + playbook + replay + 2 toggle buttons).
- Synthetic `pointerover` on the CTA → context target kind `absorb`, label chip text "say hello" appears in both modes.
- Ember over the hero wrapper → halo element opacity > 0; over a nav node → ring visible.
- Hover CTA (`:hover` via `page.hover`) → computed `box-shadow` includes 36px blur.
- Hero renders identically: screenshot the hero region and compare against a pre-change screenshot (take it BEFORE editing Greeting) — the wrapper must not shift layout.
- Mobile 375px: hero hidden as before, no toggle, no overlay.

- [ ] **Step 5: Commit**

```bash
git add src/content/content.ts src/app/globals.css src/components
git commit -m "feat: site-wide cursor targets, labels, and CTA glow finale"
```

---

### Task CL-5: VignetteCard — parallax, warmth, sheen, handwritten ink

**Files:**
- Create: `src/components/sections/about/VignetteCard.tsx`
- Modify: `src/components/sections/about/OriginVignettes.tsx:22-34`
- Modify: `src/app/globals.css` (append)

- [ ] **Step 1: Append pencil CSS to `src/app/globals.css`**

```css
/* Origin-vignette tagline: faint pencil until first hover inks it in.
   Touch and reduced-motion users always get full ink. */
@media (hover: hover) and (pointer: fine) {
  .vignette-pencil:not([data-inked]) {
    opacity: 0.35;
  }
}
@media (prefers-reduced-motion: reduce) {
  .vignette-pencil {
    opacity: 1 !important;
  }
}
```

- [ ] **Step 2: Create `src/components/sections/about/VignetteCard.tsx`**

```tsx
"use client";
import { useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { EASE } from "@/lib/motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Glyph } from "./glyphs";
import type { ABOUT } from "@/content/content";

type Moment = (typeof ABOUT.moments)[number];

const LAYER_SPRING = { stiffness: 150, damping: 20 };

/**
 * A lived-in scene: 3-layer hover parallax (glyph deepest, text mid,
 * handwritten tagline closest), interior warmth tracking the cursor,
 * a one-time entrance sheen, and a tagline that inks itself on first hover.
 */
export function VignetteCard({ m, index }: { m: Moment; index: number }) {
  const reduce = useReducedMotionSafe();
  const [hovered, setHovered] = useState(false);
  const [inked, setInked] = useState(false);

  // Pointer position within the card, normalized to [-1, 1].
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, LAYER_SPRING);
  const sy = useSpring(py, LAYER_SPRING);

  const glyphX = useTransform(sx, (v) => v * -4); // deepest: against the cursor
  const glyphY = useTransform(sy, (v) => v * -4);
  const textX = useTransform(sx, (v) => v * 2);
  const textY = useTransform(sy, (v) => v * 2);
  const tagX = useTransform(sx, (v) => v * 5); // closest: with the cursor
  const tagY = useTransform(sy, (v) => v * 5);

  // Interior warmth follows the cursor (decorative, sits UNDER the text).
  const wx = useTransform(sx, (v) => 50 + v * 50);
  const wy = useTransform(sy, (v) => 50 + v * 50);
  const warmth = useMotionTemplate`radial-gradient(140px circle at ${wx}% ${wy}%, var(--glow-b), transparent 70%)`;

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width) * 2 - 1);
    py.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const onPointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    setHovered(true);
    setInked(true);
  };
  const onPointerLeave = () => {
    setHovered(false);
    px.set(0);
    py.set(0);
  };

  return (
    <motion.div
      className="h-full"
      onPointerMove={onPointerMove}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      animate={{ y: hovered && !reduce ? -3 : 0 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <GlassPanel
        className={`flex h-full flex-col p-7 transition-shadow duration-300 ${
          hovered ? "shadow-[0_12px_32px_oklch(0_0_0_/_0.08)]" : ""
        }`}
      >
        {/* interior warmth */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: warmth }}
          animate={{ opacity: hovered && !reduce ? 0.45 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        />
        {/* one-time entrance sheen */}
        {!reduce && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-1/2 opacity-70"
            style={{
              background:
                "linear-gradient(105deg, transparent 40%, var(--edge) 50%, transparent 60%)",
            }}
            initial={{ x: "-110%" }}
            whileInView={{ x: "310%" }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.45 + index * 0.15 }}
          />
        )}

        <motion.div style={reduce ? undefined : { x: glyphX, y: glyphY }}>
          <Glyph name={m.glyph} delay={0.3 + index * 0.25} hovered={hovered && !reduce} />
        </motion.div>
        <motion.div style={reduce ? undefined : { x: textX, y: textY }}>
          <p className="mt-5 text-xs uppercase tracking-[0.18em] text-muted">{m.kicker}</p>
          <h3 className="mt-2 font-display text-2xl tracking-tight">{m.title}</h3>
          <p className="mt-3 leading-relaxed text-muted">{m.body}</p>
        </motion.div>
        <motion.div
          className="mt-auto grid pt-6"
          style={reduce ? undefined : { x: tagX, y: tagY }}
        >
          <p
            className="vignette-pencil col-start-1 row-start-1 font-hand text-2xl text-ink"
            data-inked={inked || undefined}
          >
            {m.tagline}
          </p>
          {!reduce && (
            <motion.p
              aria-hidden
              className="col-start-1 row-start-1 font-hand text-2xl text-ink"
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={inked ? { clipPath: "inset(0 0% 0 0)" } : undefined}
              transition={{ duration: 0.9, ease: "easeInOut" }}
            >
              {m.tagline}
            </motion.p>
          )}
        </motion.div>
      </GlassPanel>
    </motion.div>
  );
}
```

`Glyph` does not have a `hovered` prop yet — CL-6 adds it. To keep THIS task shippable, pass nothing yet: write `<Glyph name={m.glyph} delay={0.3 + index * 0.25} />` in this task; CL-6 changes it to the line shown above.

- [ ] **Step 3: Use it in `OriginVignettes.tsx`**

Replace the card map (lines 22–34) with:

```tsx
      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
        {ABOUT.moments.map((m, i) => (
          <Reveal key={m.title} delay={i * 0.1} className={["md:mt-0", "md:mt-10", "md:mt-4"][i]}>
            <VignetteCard m={m} index={i} />
          </Reveal>
        ))}
      </div>
```

Add `import { VignetteCard } from "./VignetteCard";` and remove the now-unused `GlassPanel` and `Glyph` imports from `OriginVignettes.tsx`.

- [ ] **Step 4: Verify (headless)**

- Desktop: taglines have `.vignette-pencil` without `data-inked`, computed opacity 0.35. Synthetic `pointerenter` + `pointermove` on card 1 → `data-inked` set; ink overlay's `clip-path` animates toward `inset(0 0% 0 0)`; glyph/text/tagline wrappers have distinct non-zero transforms; warmth overlay opacity > 0.
- Sheen: card reveals include a one-time sweep (assert the sheen element exists before, is at x 310% after 2s in view).
- Reduced motion: no sheen/ink overlay in DOM; pencil computed opacity 1; no transforms.
- Mobile 375px: cards stack, taglines full opacity (media query doesn't match), no overflow.
- Lint + tsc clean.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/about src/app/globals.css
git commit -m "feat: origin cards as lived-in scenes (parallax, warmth, sheen, ink)"
```

---

### Task CL-6: Living glyphs

**Files:**
- Modify: `src/components/sections/about/glyphs.tsx`
- Modify: `src/components/sections/about/VignetteCard.tsx` (pass `hovered`)

- [ ] **Step 1: Extend `glyphs.tsx`**

Replace the `Glyph` component (keep `GLYPHS` data unchanged) with:

```tsx
export function Glyph({
  name,
  delay = 0,
  hovered = false,
}: {
  name: GlyphName;
  delay?: number;
  hovered?: boolean;
}) {
  const reduce = useReducedMotionSafe();
  const paths = GLYPHS[name];
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-14 w-14 overflow-visible" aria-hidden>
      {paths.map(([d, w], i) => {
        const el = (
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
            // book: the idea sinks in — lines shimmer as if being read
            animate={
              !reduce && hovered && name === "book" && i >= 2
                ? { strokeOpacity: [1, 0.35, 1] }
                : { strokeOpacity: 1 }
            }
            {...(!reduce && hovered && name === "book" && i >= 2
              ? { transition: { duration: 0.6, delay: (i - 2) * 0.15 } }
              : {})}
          />
        );
        // workshop: the tilted note (the opinion that moved) peels + re-sticks
        if (name === "workshop" && i === 4) {
          return (
            <motion.g
              key={d}
              style={{ transformBox: "fill-box", transformOrigin: "20% 20%" }}
              animate={
                !reduce && hovered
                  ? { rotate: [0, -10, 3, 0], y: [0, -2, 0, 0] }
                  : { rotate: 0, y: 0 }
              }
              transition={{ duration: 0.9, ease: "easeInOut" }}
            >
              {el}
            </motion.g>
          );
        }
        return el;
      })}
      {/* phone: the tap lands — tick redraws and a ripple blooms */}
      {name === "phone" && !reduce && (
        <>
          <motion.path
            d="M 28 33 l 3 3 l 6 -7"
            stroke="var(--ink)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={hovered ? { pathLength: [0, 1], opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          />
          <motion.circle
            cx={32}
            cy={32}
            r={6}
            stroke="var(--ink)"
            strokeWidth={1.2}
            fill="none"
            initial={{ scale: 1, opacity: 0 }}
            animate={hovered ? { scale: [1, 2.2], opacity: [0.5, 0] } : { scale: 1, opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          />
        </>
      )}
    </svg>
  );
}
```

Implementation notes for the engineer:
- The conditional `transition` spread on the book path is awkward; if the double-transition confuses framer, split the book lines into their own branch mirroring the workshop pattern (a wrapper is unnecessary — just give book paths `animate`/`transition` props and everything else the static defaults). What matters: draw-on unchanged; hover keyframes retrigger per hover-enter; reduced motion ignores `hovered` completely.
- SVG transforms need `transformBox: "fill-box"` for sane origins — already in the code.

- [ ] **Step 2: Pass `hovered` from `VignetteCard.tsx`**

Change the glyph line to:

```tsx
          <Glyph name={m.glyph} delay={0.3 + index * 0.25} hovered={hovered && !reduce} />
```

- [ ] **Step 3: Verify (headless)**

- Hover card 1 (workshop): the note `<g>` gains a rotate transform mid-animation.
- Hover card 2 (phone): overlay tick opacity → 1, ripple circle appears then fades.
- Hover card 3 (book): line strokes dip in opacity sequentially.
- Entrance draw-on still plays on scroll-into-view (pathLength animates 0→1).
- Reduced motion: glyphs fully drawn, hover does nothing, overlay tick/ripple absent from DOM.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/about
git commit -m "feat: living glyphs — note peels, tap ripples, lines read themselves"
```

---

### Task CL-7: BeliefsBento border glow

**Files:**
- Modify: `src/app/globals.css` (append)
- Modify: `src/components/ui/GlassPanel.tsx` (no change needed — glow class rides on `className` prop)
- Modify: `src/components/sections/BeliefsBento.tsx`

- [ ] **Step 1: Append tile-glow CSS to `src/app/globals.css`**

```css
/* Bento tiles catch the light you carry: a warm ring where the cursor is,
   fading with distance (--md 0..1 set from a single grid-level listener).
   Ring only — never a fill over text (the haze rule). */
.tile-glow::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: radial-gradient(
    180px circle at var(--mx, 50%) var(--my, 50%),
    var(--glow-a),
    transparent 75%
  );
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
  opacity: calc(var(--md, 0) * 0.9);
  pointer-events: none;
  transition: opacity 200ms var(--ease);
}
@media (prefers-reduced-motion: reduce) {
  .tile-glow::before {
    display: none;
  }
}
```

(`GlassPanel`'s root is already `relative`, so the pseudo-element anchors correctly; `border-radius: inherit` picks up the glass radius.)

- [ ] **Step 2: Wire the grid listener in `BeliefsBento.tsx`**

Add `tile-glow` to both GlassPanels (anchor tile and `DomainTile`'s):

- Anchor: `<GlassPanel className="tile-glow h-full p-6 md:p-7">`
- DomainTile: `` <GlassPanel className={`tile-glow h-full p-6 transition-shadow duration-500 md:p-7 ${lit ? "shadow-[inset_0_0_0_1px_var(--accent)]" : ""}`}> ``

In `BeliefsBento`, add a ref + handlers on the existing `div.relative.mt-14` wrapper (which already has pause/resume handlers):

```tsx
  const gridRef = useRef<HTMLDivElement>(null);

  const onGridMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    gridRef.current
      ?.querySelectorAll<HTMLElement>(".tile-glow")
      .forEach((t) => {
        const r = t.getBoundingClientRect();
        const mx = e.clientX - r.left;
        const my = e.clientY - r.top;
        const dist = Math.hypot(mx - r.width / 2, my - r.height / 2);
        t.style.setProperty("--mx", `${mx}px`);
        t.style.setProperty("--my", `${my}px`);
        t.style.setProperty("--md", String(Math.max(0, 1 - dist / 320)));
      });
  };
  const onGridLeave = () => {
    gridRef.current
      ?.querySelectorAll<HTMLElement>(".tile-glow")
      .forEach((t) => t.style.setProperty("--md", "0"));
  };
```

```tsx
      <div
        ref={gridRef}
        className="relative mt-14"
        onPointerEnter={pause}
        onPointerMove={onGridMove}
        onPointerLeave={() => {
          resume();
          onGridLeave();
        }}
        onFocusCapture={pause}
        onBlurCapture={resume}
      >
```

(Note the original `onPointerLeave={resume}` becomes the combined arrow above. Reading 6 rects per move is fine — custom-property writes don't invalidate layout; rects must be read fresh anyway because scrolling moves them.)

- [ ] **Step 3: Verify (headless)**

- Move pointer over the bento grid → nearest tile has `--md` close to 1, far tiles lower; `::before` computed opacity > 0 on near tile (assert via `getComputedStyle(tile, "::before").opacity`).
- Leave grid → all `--md` = 0.
- Idle spotlight + hover belief crossfade still work (hover a tile → belief text visible).
- Reduced motion: `::before` display none.
- Turquoise `lit` ring unchanged (accent scarcity intact — travelling glow is `--glow-a`, warmth).

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css src/components/sections/BeliefsBento.tsx
git commit -m "feat: bento tiles catch the carried light (proximity border glow)"
```

---

### Task CL-8: UntanglingMap connection hints

**Files:**
- Modify: `src/components/sections/about/UntanglingMap.tsx`

- [ ] **Step 1: Add hover state + connection lines**

In `UntanglingMap`, add state and helpers (near the other state):

```tsx
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const chipX = (i: number) => COL_X[ABOUT.mapNodes[i].stage];
  const chipY = (i: number) => ROW_Y[i % 3];
```

Pass hover callbacks through `MapChip` — extend its props:

```tsx
  onHover,
}: {
  ...existing props...
  onHover: (on: boolean) => void;
}) {
```

and on the OUTER `motion.div` of `MapChip` add:

```tsx
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
```

At the call site:

```tsx
            <MapChip
              key={n.id}
              ...existing props...
              onHover={(on) => setHoverIdx(on ? i : null)}
            />
```

Inside the existing `<svg>` (after the organized-lines `motion.g`), add the connection hints — only meaningful once organized (before that, chips sit at messy offsets and the lines would point at nothing):

```tsx
          <AnimatePresence>
            {organized &&
              hoverIdx !== null &&
              [hoverIdx - 1, hoverIdx + 1]
                .filter((j) => j >= 0 && j < ABOUT.mapNodes.length)
                .map((j) => (
                  <motion.line
                    key={`hint-${hoverIdx}-${j}`}
                    x1={chipX(hoverIdx)}
                    y1={chipY(hoverIdx)}
                    x2={chipX(j)}
                    y2={chipY(j)}
                    stroke="var(--hf-champagne)"
                    strokeWidth={0.35}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduce ? 0 : 0.25 }}
                  />
                ))}
          </AnimatePresence>
```

Add `AnimatePresence` to the framer import. (`strokeWidth` 0.35 matches the existing paths in this 0–100 non-uniform viewBox — the spec's "width 1" was in screen px; 0.35 here is the coordinate-space equivalent.)

- [ ] **Step 2: Verify (headless)**

- After the map organizes, hover a middle chip → two lines fade in connecting to its neighbors; leave → fade out.
- First/last chips → one line only.
- Before organize (fresh reload, immediately hover) → no lines.
- Perturbation push still works; replay still works; mobile `<dl>` untouched.
- Reduced motion: lines appear/disappear instantly (duration 0), map organized from the start as before.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/about/UntanglingMap.tsx
git commit -m "feat: untangling map shows how hovered work connects"
```

---

### Task CL-9: Workbench approach + WipCard tease + ThreadNav proximity

**Files:**
- Modify: `src/components/sections/workbench/Workbench.tsx`
- Modify: `src/components/nav/ThreadNav.tsx`
- Modify: `src/app/globals.css` (append)

- [ ] **Step 1: PlaybookArtifact pseudo-3D lean**

Rewrite `PlaybookArtifact` in `Workbench.tsx` (imports to add at top of file: `useMotionValue`, `useSpring`, `useTransform` from framer-motion; `CURSOR` from `@/content/content` — already imported in CL-4; `useReducedMotionSafe` already imported):

```tsx
/** The finished artifact: glass browser frame with a live miniature of the real page. */
function PlaybookArtifact() {
  const p = WORKBENCH.playbook;
  const reduce = useReducedMotionSafe();
  const [hovered, setHovered] = useState(false);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 150, damping: 20 });
  const sy = useSpring(py, { stiffness: 150, damping: 20 });
  const rotateY = useTransform(sx, (v) => v * 3);
  const rotateX = useTransform(sy, (v) => v * -3);

  const onPointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width) * 2 - 1);
    py.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };

  return (
    <a
      href={p.href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="link"
      data-cursor-label={CURSOR.labels.open}
      className="group block h-full"
      style={{ perspective: 900 }}
      onPointerMove={onPointerMove}
      onPointerEnter={(e) => {
        if (!reduce && e.pointerType === "mouse") setHovered(true);
      }}
      onPointerLeave={() => {
        setHovered(false);
        px.set(0);
        py.set(0);
      }}
    >
      <motion.div
        className="h-full"
        style={reduce ? undefined : { rotateX, rotateY }}
        animate={{ y: hovered ? -4 : 0 }}
        transition={{ duration: 0.3, ease: EASE }}
      >
        <GlassPanel className="pressable flex h-full flex-col overflow-hidden">
          {/* …existing GlassPanel contents UNCHANGED (browser chrome, iframe, copy)… */}
        </GlassPanel>
      </motion.div>
    </a>
  );
}
```

(Add `EASE` to the imports from `@/lib/motion`. Keep every existing child of the GlassPanel byte-identical — only the wrapper changes.)

- [ ] **Step 2: WipCard hover tease**

In `WipCard`, add a `hot` state wired to the existing pointer handlers, and an overlay rect that draws the 0.62→0.78 segment:

```tsx
  const [hot, setHot] = useState(false);
```

```tsx
      onPointerEnter={() => {
        paused.current = true;
        setHot(true);
      }}
      onPointerLeave={() => {
        paused.current = false;
        setHot(false);
      }}
```

Inside the existing `<svg>` after the current `motion.rect`, add:

```tsx
        {/* hover: the line teases a little more progress, then relaxes */}
        <motion.rect
          x="2"
          y="2"
          width="396"
          height="296"
          rx="20"
          stroke="var(--hf-orchid)"
          strokeWidth={1.6}
          initial={{ pathLength: 0, pathOffset: 0.62 }}
          animate={hot && !reduce ? { pathLength: 0.16 } : { pathLength: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
```

- [ ] **Step 3: ThreadNav proximity glow**

Append to `src/app/globals.css`:

```css
/* Thread-nav nodes glow as the carried light approaches (--glow set from a
   single window listener, only while the pointer is near the right edge). */
.nav-dot {
  scale: calc(1 + 0.5 * var(--glow, 0));
  box-shadow: 0 0 calc(12px * var(--glow, 0)) var(--glow-a);
}
```

In `ThreadNav.tsx`: add `data-node` + `nav-dot` to the inner dot `<span>` (the one with the size classes), keeping its existing classes:

```tsx
                <span
                  data-node
                  className={`nav-dot absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ${
                    current
                      ? "size-2.5 bg-[var(--accent)]"
                      : "size-1.5 bg-[var(--muted)] group-hover:size-2"
                  }`}
                />
```

Add the proximity effect (import `useRef` — already imported via useState/useEffect line; add `useReducedMotionSafe` import; import `proximity` from `@/lib/cursor`):

```tsx
  const reduce = useReducedMotionSafe();
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const clear = () =>
      listRef.current
        ?.querySelectorAll<HTMLElement>("[data-node]")
        .forEach((el) => el.style.setProperty("--glow", "0"));
    const onMove = (e: PointerEvent) => {
      if (e.clientX < window.innerWidth - 160) {
        clear();
        return;
      }
      listRef.current?.querySelectorAll<HTMLElement>("[data-node]").forEach((el) => {
        const r = el.getBoundingClientRect();
        const d = Math.hypot(
          e.clientX - (r.left + r.width / 2),
          e.clientY - (r.top + r.height / 2)
        );
        el.style.setProperty("--glow", String(proximity(d, 120)));
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      clear();
    };
  }, [reduce]);
```

and `ref={listRef}` on the `<ul>`.

Guard note: `clear()` runs on every move left of the threshold — 6 no-op style writes per move is measurable noise. Optimize with a `wasNear` ref boolean so `clear()` runs once per exit:

```tsx
    let wasNear = false;
    const onMove = (e: PointerEvent) => {
      const near = e.clientX >= window.innerWidth - 160;
      if (!near) {
        if (wasNear) clear();
        wasNear = false;
        return;
      }
      wasNear = true;
      /* …per-node loop… */
    };
```

Use the optimized version.

- [ ] **Step 4: Verify (headless)**

- Playbook card: pointermove over it → wrapper has non-zero rotateX/rotateY; leave → returns to 0; label chip "open" in cursor modes; existing iframe miniature unaffected (no grid inflation — check the card's rendered width unchanged).
- WipCard: hover → overlay rect `stroke-dashoffset` animates (segment appears); leave → disappears; entrance draw still stops at 0.62.
- ThreadNav: synthetic pointermove at (innerWidth - 30, node Y) → that node's `--glow` ≈ 1, dot computed `scale` > 1; move to page center → all `--glow` 0.
- Reduced motion: no lean, no tease (rect overlay stays pathLength 0), no glow writes.
- Lint + tsc clean.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/workbench/Workbench.tsx src/components/nav/ThreadNav.tsx src/app/globals.css
git commit -m "feat: workbench approach responses + thread-nav proximity glow"
```

---

### Task CL-10: Full verification pass + build + deploy

**Files:**
- Create: verification script in scratchpad (NOT committed)
- No source changes expected unless verification finds bugs (fix + commit them individually)

- [ ] **Step 1: Unit tests + lint + types**

```bash
npx vitest run
npx eslint src
npx tsc --noEmit
```
Expected: all pass.

- [ ] **Step 2: Full headless sweep (dev server running)**

Cover, in one script (verify-live.mjs pattern):
1. Ember default: `cursor-hidden` on html, bead tracks, velocity stretch changes transform during a fast synthetic swipe.
2. All 8 target kinds from the spec table §1.7: pointerover each → correct state element visible + label text where defined (both modes).
3. Toggle: switch → persists across reload; lens disc present, native cursor not hidden.
4. Absorb finale: hover CTA in ember → bead wrapper animates toward scale 0.4/opacity 0 and CTA box-shadow blooms; leave → bead returns.
5. Vignettes: pencil 0.35 → inked on hover; parallax layers; warmth; sheen once; glyph life per card.
6. Bento glow, map connection hints, playbook lean, wip tease, nav proximity — assertions from their tasks re-run.
7. Reduced-motion context: NO overlay, NO toggle, NO cursor-hidden; pencil 1.0; sheens absent; site scrolls and reads normally.
8. Mobile 375px context: no overlay/toggle; no horizontal overflow (`document.documentElement.scrollWidth === 375`); vignettes/map/bento render.
9. Light arc regression: at beats hello/about/work/how/play/talk, read `--ink`/`--muted`/`--bg` and compare to pre-pass values (byte-identical — this pass must not touch light).
10. Console: zero errors across the whole crawl.

- [ ] **Step 3: Production build**

Stop the dev server first (EPERM gotcha), then:

```bash
npm run build
```
Expected: static export succeeds to `out/`.

- [ ] **Step 4: Deploy + live smoke**

```bash
git push
```
Wait for the "Deploy to GitHub Pages" workflow (`gh run watch` or poll `gh run list --limit 1`). Then headless-smoke https://sanyamunam.github.io/portfolio/ : hero h1, cursor overlay present on fine-pointer context, toggle works, zero failed requests (the known `KISR SS.png` 404 inside prompt-playbook.html is pre-existing and exempt).

- [ ] **Step 5: Commit any fixes; report**

Report to Sanya: live URL, how to flip the ember/lens toggle, and that her decision deletes the loser + toggle.

---

## Self-review notes (already applied)

- Spec §1.4 ember "absorb" and §3.5 CTA glow both covered (CL-2/CL-4); §1.5 lens no-blur honored; §1.9 no-render-on-move honored (MotionValues + delegated pointerover with element-identity guard).
- Spec §3.1 said "rects cached on grid-enter" — plan reads rects per move instead (scroll invalidates caches; 6 reads/frame with no interleaved layout writes is safe). Deviation is intentional.
- Spec §3.2 stroke width adjusted 1 → 0.35 to match the map's 0–100 viewBox coordinate space.
- WorkMobile cards NOT annotated (spec table listed them, but they are non-clickable `<article>`s and mobile has no cursor; a "read" label would be dishonest). Deviation is intentional.
- Types consistent: `CursorKind`/`CursorTarget`/`useCursor` defined in CL-1, consumed in CL-2/CL-3; `CURSOR.labels.*` defined in CL-4 and used in CL-4/CL-9; `Glyph`'s `hovered` prop added in CL-6 and passed from CL-5's component (CL-5 ships without it first).
