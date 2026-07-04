# The Exhibition — Golden Hour V3.5 Redesign Spec

**Date:** 2026-07-04
**Status:** Design approved part-by-part in brainstorming; this is the consolidated spec.
**Builds on:** `2026-07-04-golden-hour-portfolio-design.md` (the shipped V3). This redesign is **evolutionary**: it rebuilds the five middle beats' composition and interaction model on top of the preserved atmosphere/light/glass/thread systems.

---

## 1. Diagnosis (why this redesign)

The shipped V3 is a beautiful presentation, not yet an interactive experience:

1. **One compositional DNA everywhere** — heading → paragraph → glass card, repeated across all five middle beats.
2. **Low interaction density** — outside the hero and nav, almost nothing responds to the visitor.
3. **Excessive length** — ~23 viewports (~18.5k px), with the case valleys alone ~65% of scroll; pacing feels slow.
4. **Text does the storytelling** — ideas are explained, not shown.

## 2. Non-negotiables (preserved, per Sanya)

- **The Hero** — composition, layout, hierarchy, atmosphere, and the animated SVG illustration stay as-is. Only additive enhancement allowed.
- **The light-temperature journey** — same LightScript, same beat temperatures, same emotional arc (golden → valleys → dusk → ember → golden). Valleys still dip per case (Kahramaa still reaches jet).
- **Glassmorphism language** — evolves (edge lighting, layering), never removed.
- Voice, content facts, accent grammar (turquoise = clarity only), reduced-motion discipline, `content.ts` as the single copy source.

## 3. Approved direction

**"The Exhibition" + thread-as-spine (A+B hybrid).** Each middle beat becomes a distinct installation with its own interaction model — story-then-interaction (About) → cinema (Work) → diagram (Bento) → object (Workbench) — while the continuous thread line morphs through the whole journey as first-class connective tissue.

**Decisions locked in brainstorming:** pinned scrubbed case stage · pseudo-3D only (no WebGL/R3F) · full copy license, but balanced — paragraphs are reduced and restructured into UI patterns, not eliminated · Beat 3 = glass bento (not orbital constellation).

## 4. Page architecture & compression budget

| Beat | Now | Target | Form |
|---|---|---|---|
| 0 Hero | 1.0 vh-units | 1.0 | untouched |
| 1 About Sanya | ~3.4 (What-I-do + Story combined) | ~2.0 | Origin Vignettes → Untangling Map + brief |
| 2 Work | ~14.6 | 4.2 scroll → pinned 1.0 stage | Case Stage |
| 3 Messy middle | ~5.3 | ~1.2 | Glass Bento |
| 4 Playground | ~1.5 | ~1.0 | Living Bento |
| 5 Invitation | 1.0 | 1.0 | kept + magnetic CTA |
| **Total** | **~23** | **~10.4** | ≈55% shorter |

**Beat order note (Sanya, 2026-07-04):** the old Beat 1 (What I do) and Beat 4 (Story) merge into ONE "About Sanya" section directly after the Hero — origin story FIRST (how she was inspired into UX), then what she does + her skills. Nav shrinks to six nodes: hello · about · work · how · play · talk.

Every stopped viewport must read as a finished composition — no screens that are mostly empty or top-loaded.

## 5. The thread spine — three morph moments

Continuity is a shared visual grammar (the `--hf-*` flowing-gradient stroke, consistent weight, entry/exit stubs aligned on a shared x-lane at section boundaries), not literally one DOM path.

- **M1 · Hero → Beads → Tangle.** The illustration's tail extends downward with early scroll (scrubbed stub), links the three origin vignettes like beads on a string, then feeds the untangling map's tangle — the line that drew her carries her story, then drags the mess in behind it.
- **M2 · Case connector.** Inside the pinned stage, a horizontal thread behind the content knots during each case's mess phase and pulls straight at its resolution (scrub-linked), flashing turquoise at each outcome. Four knots, four releases.
- **M3 · Grid → unfinished outline → bow.** The thread draws the bento's grid lines as Beat 3 enters; in Beat 4 it IS the partially-drawn Laws of UX outline — visibly stopping mid-stroke (a work the line hasn't finished drawing); then it ties the existing bow at the CTA.

Reduced motion: every segment renders resolved and static.

## 6. Beat designs

### 6.1 Beat 1 — About Sanya *(story-first, then interaction-first; ~2.0 viewports, two movements)*

One section, one nav node ("About"), two conversation questions in sequence — inspiration before practice.

**Movement 1 — The Origin (illustrated vignettes).** Question: *"Who taught you to see like this?"* The three influences that moved her into UX, as glass cards linked by the thread like beads (M1), each with a small hand-authored **line-art glyph in the hero's stroke language** that draws itself on entry:

1. **A workshop** — attending her first design-thinking workshop (sticky-note wall glyph).
2. **An app** — experiencing the impact a really good interface makes: watching her dad use Google Pay (phone-with-delighted-tap glyph).
3. **A book** — the Steve Jobs biography: realizing how central design is to the success of a product, and in turn the company (open-book glyph). *(Body copy updated to carry this design-drives-product-success framing.)*

Titles + two-sentence bodies kept from the current STORY content (book body revised per above). The closing line *"Mostly, I just love figuring out people."* becomes the kinetic-type bridge into Movement 2.

**Movement 2 — The Untangling Map (what she does + skills).** Question: *"So… what do you actually do?"* Split composition. **Backdrop/right: a living tangle** — ~12 glass node-chips labeled with real mess-vocabulary ("14 stakeholders", "3 vendors", "legacy systems", "no single owner", "conflicting KPIs"…) joined by knotted gradient threads, fed by the vignette bead-string. On entry the tangle **organizes itself**: nodes glide into a four-stage flow — *Listen → Untangle → Align → Ship* — and threads pull straight. Cursor proximity perturbs nearby nodes (springy, ±4px); a "make it messy again" affordance replays it. **Left:** one kept short paragraph + the brief card (roles · base · focus areas) with upgraded per-row hover states — this is the section's **skills display**; the full per-domain skill lists remain with their beliefs in the Beat 3 bento. SR fallback: visually-hidden stage list. Reduced motion: organized, static.

Light: the whole About section sits in the warm world (temp ≈ 0.3). The old dedicated ember beat disappears with the merge; the dusk→playground transition still passes through the warm hues naturally on its way back to golden.

### 6.2 Beat 2 — The Case Stage *(cinema-first)*

~420vh scroll drives a sticky 100vh stage. Each case owns ~100vh, split into three sub-phases crossfading **in place** (opacity/translate grid-stack — V2's production-proven pattern): *mess → turn → what changed*. Between cases: ~0.3vh breathers where the stage empties to atmosphere + straightened thread.

Stage anatomy:
- **Left rail:** case index `01–04` + clients, active state in accent; click scrubs to the segment via Lenis scrollTo (the shipped ThreadNav jump pattern).
- **Center:** mess phase = **fragment stack** — the chaos as staggered glass shards of short sentences ("14 stakeholders." "3 vendors." "No one agreed what the app was for.") scattering in; turn phase = fragments pull into one aligned kept paragraph; resolution = turquoise outcome line.
- **Right:** media panel (QBF LiveFrame / ConfidentialFrames reused) with a subtle per-phase perspective tilt (pseudo-3D).
- **Background:** M2 thread + the light valley scrubbed from segment progress (per-case depths unchanged).

Mobile: no pin — four compact stacked case cards (fragments collapse to a tight list), valleys intact.

### 6.3 Beat 3 — The Glass Bento *(diagram-first)*

One viewport, dusk world. **Asymmetric 5-tile monochrome glass bento** (one wide anchor tile carrying the beat's closing thought + four standard tiles), one tile per domain. At rest each tile shows its turquoise domain kicker + skill list; hover/focus **crossfades the tile face to the belief statement** (kept verbatim). Idle: a soft spotlight drifts tile-to-tile so the grid performs unattended; any interaction takes over. The thread draws the grid's dividing lines on entry (M3). Tiles are keyboard-focusable; beliefs+skills mirrored semantically. Explicitly NOT a colour bento (V2 lesson: she rejected colour tiles; glass + accent kickers only).

### 6.4 Beat 4 — The Workbench Pair *(object-first)*

**Exactly two hobby projects** (per Sanya, 2026-07-04), presented as objects at honestly different stages — the asymmetry IS the design. Bento explicitly rejected (too thin with two cells).

- **Prompt Playbook** *(the finished artifact, larger)* — a glass browser frame showing a **live miniature of the actual shipped page** (`/prompt-playbook.html` — a scaled, non-interactive iframe or faithful static preview; the real thing, not a mockup), with title, one-line body, and the open-in-new-tab link. Subtle looping typewriter in the frame's chrome bar cycling real prompt fragments.
- **Laws of UX** *(still on the workbench, smaller)* — a card rendered as a **partially-drawn line outline** in the thread's stroke language: the card's border visibly stops mid-draw (the site's motif — the line simply hasn't finished drawing it yet), auto-cycling law names ghost through the unfinished interior (pauses on hover), quiet "in the making" note. NOT a link. Reduced motion: outline shown at its partial state, static; names static.
- **"Talked out of building" aside** — kept as a small margin strip beneath the pair (personality moment, not a project): slow ticking counter + strikethrough animation.

Both objects gain cursor-aware spotlight treatment. Loops are isolated leaf components; reduced-motion silences them. SR: both projects exposed as a semantic list with status ("available" / "in progress").

### 6.5 Beat 5 — Invitation *(kept)*

Composition unchanged. CTA becomes magnetic (≤6px pull toward cursor); bow unchanged; footer unchanged.

## 7. Global density pass

- **QuestionHeading:** upgrade from block blur-rise to **word-stagger kinetic reveal** (same ease family).
- **Temperature-reactive glass edges:** the 1px `--edge` highlight subtly brightens/dims with the world's light so glass lives in the atmosphere.
- **Magnetic primary CTAs** site-wide (invitation CTA, live-site link).
- ThreadNav, grain, Atmosphere: unchanged.

## 8. Engineering constraints

- Framer Motion only (no GSAP); transform/opacity only; pseudo-3D via perspective transforms and layering — **no WebGL/R3F**.
- Every new animation has a `useReducedMotion`/media-query fallback (diagrams: resolved static states; loops: off; stage: instant phase switches).
- Pinned stage: rAF-safe scroll scrubbing (Framer `useScroll` on the section), programmatic jumps via Lenis; keyboard access — rail buttons focusable, arrow-key case switching; wait-after-jump testing discipline (≥800ms, Lenis).
- Diagrams/bento: semantic mirrors for screen readers; heading outline preserved (one h1, h2 questions, h3 titles).
- All copy restructured into `content.ts` data shapes (fragments, tiles, glyph labels, map nodes) — no prose in components.
- Perf: loops isolated in leaf client components; idle spotlight/typewriter etc. must not re-render parents; 60fps target on the stage scrub.
- May draw *inspiration* from Magic UI / ReactBits / Aceternity patterns (MCP available), but every component is hand-built in this design language — no drop-in library styling.

## 9. Out of scope

Hero changes beyond additive polish · LightScript/Atmosphere changes · deployment · new case-study content (still pending real metrics from Sanya) · WebGL.

## 10. Success criteria

1. Page ≤ ~11 viewports; every stopped screen is a complete composition.
2. Each middle beat has a distinct composition + at least one meaningful interaction; the heading→paragraph→card rhythm is gone.
3. The thread visibly travels the whole journey (M1–M3) and still turns turquoise only at clarity moments.
4. The light arc measures the same at every beat as the shipped V3 (goldens/valleys/dusk/ember exact).
5. Ideas land visually before they're read — a visitor who reads nothing still understands: how she found UX and that she untangles messes (Beat 1), took four organizations through it (Beat 2), works five disciplines as one loop (Beat 3).
6. Full keyboard + reduced-motion + SR parity; 60fps scrub; zero console errors.
