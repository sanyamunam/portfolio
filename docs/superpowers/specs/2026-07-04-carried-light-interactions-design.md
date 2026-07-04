# Carried Light — Interaction Density Pass (V3.6) — Design Spec

**Date:** 2026-07-04
**Status:** Approved direction (dual cursor + full delight pass + lived-in cards); this document is the buildable spec.
**Prior specs:** `2026-07-04-golden-hour-portfolio-design.md` (V3), `2026-07-04-exhibition-redesign-design.md` (V3.5). All rules there still bind (one light MotionValue, copy in `content.ts`, reduced-motion fallback everywhere, animate transform/opacity only, accent scarcity, no haze).

## 0. Why

Fresh-eyes feedback: the site is beautiful but *feels static* — interaction density is below Awwwards SOTD bar. The two least-crafted surfaces are the pointer itself (fully native) and the About origin cards (static glass). This pass adds a site-wide cursor experience, turns the three origin cards into living scenes, and adds six curated micro-interaction moments. Every addition serves the story: **the visitor carries a small light through Sanya's world.**

Nothing in this pass may:
- change any light/contrast token or `sampleLight` (the haze fix is untouchable),
- modify `HeroIllustration.tsx` internals,
- add copy outside `content.ts`,
- animate anything but `transform`/`opacity`/`clip-path` (+ CSS-var-driven gradients on fixed/absolute decorative layers),
- degrade touch or reduced-motion users below today's experience.

## 1. Cursor system — one brain, two skins, evaluation toggle

Sanya will A/B two cursor concepts live and delete the loser later. Both skins consume identical shared state so the comparison is fair.

### 1.1 Activation

The cursor system is ACTIVE only when ALL hold (checked client-side, re-checked on media-query change):
- `(hover: hover) and (pointer: fine)` matches,
- `prefers-reduced-motion: reduce` does NOT match (via `useReducedMotionSafe`),
- after mount (SSR renders nothing — no hydration mismatch).

When inactive: render `null`. Native cursor everywhere. Touch/reduced-motion users see exactly today's site.

### 1.2 Files

```
src/lib/cursor.ts                        — types, context, useCursor hook
src/components/cursor/CursorProvider.tsx — brain: tracking, target detection, mode state, renders active skin + toggle
src/components/cursor/EmberCursor.tsx    — skin A
src/components/cursor/LensCursor.tsx     — skin B
src/components/cursor/CursorLabel.tsx    — shared label chip
src/components/cursor/CursorToggle.tsx   — evaluation toggle
```

Mounted in `src/app/layout.tsx` as a sibling of `Atmosphere` (inside LightProvider tree so tokens are live). The overlay root is `<div aria-hidden className="pointer-events-none fixed inset-0 z-[9999]">`.

### 1.3 Shared state (`src/lib/cursor.ts`)

```ts
export type CursorMode = "ember" | "lens";
export type CursorKind = "default" | "link" | "nav" | "case" | "play" | "art" | "absorb";

export type CursorTarget = {
  kind: CursorKind;
  label?: string;          // from data-cursor-label
  rect?: DOMRect;          // measured once on enter (for snap/absorb)
} | null;
```

`CursorProvider` owns:
- `rawX/rawY` MotionValues ← single `window.addEventListener("pointermove", …, { passive: true })`. **No React state updates on move.**
- `pressed` MotionValue (0/1) ← `pointerdown`/`pointerup` on window.
- `visible` — set 0 when the pointer leaves the document (`pointerout` with `relatedTarget === null` / `document.documentElement mouseleave`), 1 on next move.
- `target: CursorTarget` — React state (low-frequency). One delegated `pointerover` listener on `document`: `(e.target as Element).closest?.("[data-cursor]")`. On match, read `dataset.cursor` as kind, `dataset.cursorLabel`, and `getBoundingClientRect()` once. When `closest` returns null → target `null`. `pointerover` fires per element entry, not per move — cheap.
- `mode: CursorMode` — React state, initial value from `localStorage.getItem("cursor-mode")` (default `"ember"`) read in a mount effect; setter persists back.

While ACTIVE **and** mode is `ember`, `CursorProvider` adds class `cursor-hidden` to `<html>` (removed on cleanup/mode switch). In `globals.css`:

```css
html.cursor-hidden, html.cursor-hidden * { cursor: none !important; }
```

Lens mode never hides the native cursor.

### 1.4 Skin A — Ember (light-bearer)

A small bead of the site's own light. All colors come from the LIVE tokens (`--glow-a`, `--glow-b`, `--edge`, `--ink`) so the bead is golden in warmth, wine-dim in depth, pale in the jet valley, turquoise-kissed at clarity — **zero new color plumbing**.

- **Bead (default):** 10px circle. `background: radial-gradient(circle at 35% 35%, oklch(1 0 0 / 0.9), var(--glow-a) 60%, transparent)`; `box-shadow: 0 0 14px 2px var(--glow-a), inset 0 0 0 1px var(--edge)`. Follow springs `{ stiffness: 700, damping: 42 }` — near-instant, never laggy.
- **Velocity stretch:** via `useVelocity(rawX/rawY)`. `speed = hypot(vx, vy)`; `scaleX = 1 + min(speed / 5000, 0.3)`, `scaleY = 1 / scaleX`, rotated to `atan2(vy, vx)`. Springs return it to a circle at rest. Subtle — a comet hint, not a streak.
- **Pressed:** scale 0.8, glow radius −30%. 160ms.
- **States by target kind:**
  - `link` / `nav`: bead grows to a 26px ring (transparent core, `1.5px` border `var(--ink)` at 45% opacity, glow retained). Position lerps 30% toward target rect center (soft snap; the target's own magnetic/hover behavior does the rest).
  - `case`: 40px ring + label chip (§1.6). Used on WorkStage ("keep scrolling") and mobile/desktop case links ("read").
  - `play`: 32px ring containing an 8px triangle glyph (`border-left` triangle, `var(--ink)`), + optional label.
  - `art` (hero illustration): the bead relaxes into a 64px soft halo — `radial-gradient(circle, var(--glow-a), transparent 70%)` at 0.55 opacity, no border. The illustration feels aware of the visitor.
  - `absorb` (invitation CTA only, §3.5): bead position springs fully to target center, scales to 0.4 and fades to 0 over 320ms while the CTA's own glow blooms; on leave the bead pops back from the button (scale 0 → 1 spring). The carried light joins hers.
- **State transitions:** 200ms, `EASE` from `src/lib/motion.ts`. Ring/halo/glyph are layered children of one transformed wrapper — only opacity/scale change between states.

### 1.5 Skin B — Lens (glass spotlight)

A loose piece of the site's glass the visitor moves over the page. Native arrow remains (precision preserved).

- **Disc (default):** 72px circle trailing on lazy springs `{ stiffness: 120, damping: 22 }` (deliberate ~150ms drift behind the arrow). Style: `border: 1px solid var(--edge)`; `box-shadow: inset 0 1px 0 var(--edge), 0 4px 24px oklch(0 0 0 / 0.06)`; `backdrop-filter: brightness(1.07) saturate(1.06)` (+ `-webkit-` twin and the `@supports` pattern from `globals.css` — same Lightning CSS dedup gotcha). **NO blur** — the haze lesson: text under the lens must stay perfectly legible; the lens *brightens*, never fogs.
- **Over a target (any non-default kind):** disc contracts to 48px, brightness 1.12, border opacity up; label chip (§1.6) appears. For `art`: disc expands to 96px instead (a magnifier admiring the drawing). For `absorb`: contracts to 40px hugging the CTA while the CTA glow blooms.
- **Pressed:** scale 0.92.
- Disc fades out (opacity 0, 200ms) while `visible` is 0 and during fast scrolls if the pointer is idle — implemented simply: opacity follows `visible` only; no scroll special-casing (YAGNI).

### 1.6 Label chip (shared)

`CursorLabel` renders next to the pointer (offset +18px x, +18px y), only when `target.label` exists: a small glass pill (`.glass`, `border-radius: 999px`, padding `4px 10px`), Satoshi 11px, uppercase, `tracking-[0.14em]`, `color: var(--ink)`. Enter: opacity 0→1 + `y: 4→0`, 160ms; exit 120ms. Labels are copy → `content.ts`:

```ts
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

Components reference `CURSOR.labels.*` in their `data-cursor-label` attributes.

### 1.7 Target annotations (site-wide)

| Surface | attribute |
|---|---|
| ThreadNav node buttons | `data-cursor="nav"` |
| All CTAs / inline links / footer links / toggle | `data-cursor="link"` |
| Workbench playbook artifact link | `data-cursor="link" data-cursor-label={CURSOR.labels.open}` |
| WorkStage pinned stage (desktop wrapper) | `data-cursor="case" data-cursor-label={CURSOR.labels.stage}` |
| WorkMobile case cards | `data-cursor="case" data-cursor-label={CURSOR.labels.caseRead}` |
| QBF video element wrapper | `data-cursor="play" data-cursor-label={CURSOR.labels.play}` |
| Hero illustration wrapper (in `Greeting.tsx`, NOT inside HeroIllustration) | `data-cursor="art"` |
| Invitation primary CTA | `data-cursor="absorb" data-cursor-label={CURSOR.labels.say}` |

`data-cursor` attributes are inert metadata — zero cost when the cursor system is inactive.

### 1.8 Evaluation toggle

`CursorToggle`: fixed `bottom-5 left-5 z-[60]`, hidden below `md`. A glass pill with two buttons — `ember` · `lens` — active one in `text-ink`, inactive `text-muted`; 11px uppercase Satoshi, `pressable`. `aria-label="Cursor style (preview)"`. Persists to `localStorage("cursor-mode")`. Rendered only while the cursor system is ACTIVE. **This is a temporary evaluation affordance** — once Sanya picks a winner we delete the toggle and the losing skin in a follow-up commit.

### 1.9 Performance & a11y invariants

- Pointer movement never triggers React renders — MotionValues + springs only.
- Target detection uses one delegated `pointerover` listener; rects measured once per target-enter.
- Overlay is `aria-hidden` + `pointer-events-none`; keyboard users are untouched (existing `:focus-visible` rings remain the keyboard affordance; chips are pointer-only).
- The whole system unmounts on reduced-motion/coarse-pointer — native cursor restored, `cursor-hidden` class removed.

## 2. Origin cards — lived-in scenes

`OriginVignettes.tsx` keeps its heading/intro/bridge; the card itself is extracted to `src/components/sections/about/VignetteCard.tsx`. Content shape in `content.ts` unchanged (kicker/title/body/tagline/glyph).

### 2.1 Entrance

Keep the existing `Reveal` stagger and offset rhythm (`md:mt-0 / md:mt-10 / md:mt-4`). Add a one-time **light-catch sheen**: an absolutely-positioned diagonal highlight strip (`linear-gradient(105deg, transparent 40%, var(--edge) 50%, transparent 60%)`, width 150%, `mix-blend: normal`, opacity 0.7) sweeping `translateX(-110%) → 110%` over 1.1s with `EASE`, delayed `0.45 + i * 0.15s`, triggered `whileInView once`. Reduced motion: sheen never renders.

### 2.2 Depth on hover (3-layer parallax + interior warmth)

Card-level `onPointerMove` (mouse only, same guard as `useMagnetic`) writes normalized `px/py ∈ [-1, 1]` MotionValues; springs `{ stiffness: 150, damping: 20 }`; reset to 0 on leave.

- **Glyph layer (deepest):** `translate: (-4 * px, -4 * py)` — moves *against* the cursor.
- **Text layer (kicker+title+body, mid):** `translate: (2 * px, 2 * py)`.
- **Tagline layer (closest):** `translate: (5 * px, 5 * py)`.
- **Interior warmth:** absolutely-positioned overlay `radial-gradient(140px circle at var(--vx) var(--vy), var(--glow-b), transparent 70%)` where `--vx/--vy` are percent CSS vars written from the same handler (via `useMotionTemplate` on a motion.div style). Opacity 0 → 0.45 on hover (300ms). Decorative layer under the text — it must not sit above text (no haze over copy).
- Whole card also lifts: `translateY(-3px)` + shadow `0 12px 32px oklch(0 0 0 / 0.08)` on hover, 300ms `EASE`.

Reduced motion / touch: none of the above; card renders exactly like today.

### 2.3 Living glyphs

`Glyph` gains a `hovered: boolean` prop (driven by the card's hover state). Draw-on behavior on entrance is unchanged. Hover life per glyph:

- **workshop:** the tilted sticky note (path index 4) peels and re-sticks — wrapped in a `motion.g` with `transform-origin` at the note's top-left; on `hovered`: rotate `0 → -10deg → 3deg → 0` and `y: 0 → -2 → 0`, 0.9s keyframes, once per hover.
- **phone:** on `hovered` the tick (index 3) re-draws (`pathLength 0 → 1`, 0.45s) and a ripple circle (`<motion.circle cx=32 cy=32 r=6>` stroke `var(--ink)` 1.2px) plays `scale 1 → 2.2`, `opacity 0.5 → 0`, 0.7s. The "nerve-wracking thing done effortlessly" moment, replayed.
- **book:** the three text-line paths (indices 2–3, both `M…` groups) shimmer as if being read: `strokeOpacity` keyframes `1 → 0.35 → 1`, 0.6s each, staggered 0.15s left-to-right, once per hover.

Hover animations run at most once per pointer-enter (retrigger on re-enter is fine). Reduced motion: `hovered` is ignored entirely.

### 2.4 Tagline handwrite

The Caveat tagline "inks itself in" on first hover:

- **Fine pointers (cursor active or not):** before first hover the tagline renders at `opacity 0.35` (a faint pencil sketch — always present, never hidden). On the card's first `pointerenter`, reveal via `clip-path: inset(0 100% 0 0) → inset(0 0% 0 0)` over 0.9s `easeInOut` on a full-opacity copy stacked over the pencil copy (grid-stack, same cell). After the reveal it stays inked (state, once per mount).
- **Touch & reduced motion:** full opacity from the start, no animation. Recruiters skimming never miss the taglines.

## 3. Site-wide delight layer — six moments

### 3.1 BeliefsBento — beliefs catch your light

Cursor-proximity **border glow** on the five domain tiles + anchor tile. One `onPointerMove` on the grid wrapper writes, per tile (6 rects cached on `pointerenter` of the grid, re-measured on resize): `--mx`, `--my` (cursor position relative to the tile, px) and `--md` (0–1 proximity: `1 - clamp(dist(cursorcenter)/320px)`). Each tile gets a decorative `::before` ring:

```css
.tile-glow::before {
  content: ""; position: absolute; inset: 0; border-radius: inherit;
  padding: 1px; /* ring thickness */
  background: radial-gradient(180px circle at var(--mx) var(--my), var(--glow-a), transparent 75%);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
  opacity: calc(var(--md, 0) * 0.9);
  pointer-events: none;
}
```

(Applied via a positioned wrapper inside `DomainTile`/anchor — the ring only, never a fill; text contrast untouched.) Grid `pointerleave` zeroes all `--md`. Reduced motion: class not applied. The existing idle spotlight + hover belief-crossfade behavior is unchanged; the turquoise inset ring for `lit` tiles remains the *clarity* accent, the travelling glow is *warmth* (`--glow-a`) — no accent-scarcity violation.

### 3.2 UntanglingMap — hover reveals connection

Desktop map only. Hovering chip `i` (existing MapChip hover) additionally fades in two straight SVG lines from chip `i`'s anchor point to chips `i-1` and `i+1` (array order; endpoints clamp at first/last): stroke `var(--hf-champagne)`, width 1, `opacity 0 → 0.5` (250ms), drawn in the map's existing percent coordinate space. Leave → fade out. Reduced motion: lines appear/disappear without transition. Mobile `<dl>` unchanged.

### 3.3 Workbench — artifacts respond to approach

- **Playbook artifact card:** on hover, pseudo-3D lean toward the cursor — `rotateX/rotateY` up to ±3deg (pointer-position driven, springs as §2.2), `translateY(-4px)`, shadow deepens; `perspective: 900px` on the parent. Plus `data-cursor="link" data-cursor-label={CURSOR.labels.open}` on the link wrapper. The iframe stays `pointer-events-none aria-hidden` (unchanged).
- **WipCard:** the outline that sits at `pathLength 0.62` draws forward to `0.78` on hover (0.5s `EASE`) and relaxes back on leave — progress teasing itself. Reduced motion: stays at 0.62.

### 3.4 ThreadNav — passing the light along the thread

Proximity glow (not just hover). In `ThreadNav`, when the cursor system would be active (same fine-pointer + motion check), a `window` `pointermove` handler — early-return unless `e.clientX > innerWidth - 160` — computes per-node distance (node centers cached, re-measured on resize) and sets per-node MotionValues `glow = 1 - clamp(d / 120px)`. Node dots scale `1 + 0.5 * glow` and gain `box-shadow: 0 0 ${10 * glow}px var(--glow-a)`. Active/hover states unchanged; labels unchanged. Reduced motion / coarse: no handler.

### 3.5 Invitation CTA — the finale

The primary CTA (already magnetic) gets `data-cursor="absorb"` + label `CURSOR.labels.say`, and a hover glow of its own (both modes, and even with cursor inactive): `box-shadow: 0 0 0 1px var(--edge), 0 0 36px var(--glow-a)` on hover, 350ms. Ember mode: bead absorbs into it (§1.4). Lens mode: lens hugs it (§1.5). This is the one place the cursor story resolves — the visitor's carried light joins the invitation.

### 3.6 Hero awareness

The illustration wrapper in `Greeting.tsx` gets `data-cursor="art"`. No changes inside `HeroIllustration.tsx`. Existing cursor-lean and hover shimmer remain; the ember halo / lens expansion layers on top from the cursor overlay.

## 4. Out of scope (explicit)

- No cursor trails, no WebGL/canvas distortion, no magnification of text.
- No new hover behavior on QuestionHeadings, body copy, case fragments, or footer (restraint).
- No changes to light temperatures, TEMP targets, STOPS, or text tokens.
- No mobile-specific new interactions (touch keeps today's experience).
- Toggle + losing skin removal happens AFTER Sanya's decision — not in this pass.

## 5. Verification (headless harness, `scratchpad/verify-live.mjs` pattern)

1. **Cursor active (desktop, fine pointer emulated):** overlay root exists; ember default → `html.cursor-hidden` present; switch toggle → lens → class removed, native cursor visible, disc element present; localStorage persists across reload.
2. **Context states:** dispatch `pointerover` on a nav node, the stage, the playbook link, the CTA → target kind/label chip text asserted for each mode.
3. **Reduced motion:** emulate `prefers-reduced-motion` → no overlay, no `cursor-hidden`, no toggle; vignette taglines full opacity; sheen/parallax absent; site renders as today.
4. **Mobile 375px (touch):** no overlay/toggle; vignette cards intact; map `<dl>` unchanged; no horizontal overflow.
5. **Vignettes:** pencil tagline at 0.35 before hover; after synthetic `pointerenter` → inked copy revealed; glyph hover animations fire (class/attr assertions); parallax transforms present on move.
6. **Bento/nav/workbench:** `--md` > 0 on near tile during synthetic move; nav node scale rises when pointer near right edge; WipCard pathLength target changes on hover.
7. **Contrast & console:** ink/muted tokens byte-identical to pre-pass values at temps 0/0.3/4; zero console errors; production build passes (`next build` with dev server stopped).
8. **Perf sanity:** no React render storms on pointermove (assert via React DevTools profiler once, manually, or by counting renders with a probe component in dev).
