# Golden Hour — Portfolio V3 Design Spec

**Date:** 2026-07-04
**Project:** Total reinvention of Sanya Munam's portfolio. New parallel build in `portfolio-v3/` (own git repo). The V2 build in `portfolio/` stays untouched and runnable for comparison.
**Status:** Design approved section-by-section in brainstorming; this document is the consolidated spec.

---

## 1. Why this project exists

The V2 "Blueprint" site (charcoal + signal-lime, technical/structural) is disciplined and tasteful but:

1. **Too restrained / not memorable** — it doesn't produce the "I've never seen a portfolio like this" reaction.
2. **Wrong emotional register** — charcoal+lime reads technical/engineering; Sanya's warmth, curiosity, and human-centered practice need a richer, warmer, atmospheric world.

V3 is a from-scratch concept. Everything was on the table: positioning framing, structure, palette, interaction model.

## 2. The concept — "Golden Hour"

**A conversation with Sanya as the light slowly changes.**

Three ideas fused (chosen from five explored concepts):

- **Structure = The Conversation.** The portfolio is a warm dialogue, not a monologue. An unseen interviewer — standing in for the visitor — asks the questions everyone actually wants to ask, in large editorial type; Sanya answers in her voice. This replaces hero/about/work/contact with a structure that has a *reason*: asking good questions is her actual craft.
- **World = Living light.** The entire site is one continuous atmosphere that grades between four color worlds as the conversation moves. It opens at full golden-hour warmth (instant intimacy), deepens as the conversation enters complexity, and resolves back to warmth. Light follows the emotional temperature.
- **Motif = The thread.** One fine continuous line accompanies the conversation — tangling when the topic gets messy, smoothing when clarity lands, ending tied in a small bow beside the contact CTA. The meta-theme (clarity from complexity) given a physical body. Used sparingly; a drawing element, not a gimmick layer.

**Emotional core:** warm intimacy — being welcomed into a beautifully lit studio. Memorable through humanity, not spectacle (a deliberate contrast to the dark-monumental award-site default).

**Positioning:** clarity from complexity, retold by a **warm host** rather than a cool architect. She makes the complicated feel calm and human. Voice stays: humble, curious, quietly confident, dry-fun. She is NOT a UI/visual designer — UX strategy, discovery, facilitation, leadership, digital transformation.

## 3. Narrative arc — seven beats

The emotional shape is a valley: warm → deep → warm.

| # | Beat | Question (interviewer) | Content | Light |
|---|------|------------------------|---------|-------|
| 0 | Greeting | — (no question) | "Hi. I'm Sanya." + "You probably have questions. Good — questions are how I make a living." Label: `Sanya Munam — UX Strategy & Design Operations · Doha`. Thread enters loosely curled. Scroll cue: "go on, ask." | Full golden hour (orchid/cream) |
| 1 | What I do | "So… what do you actually do?" | Positioning as a promise: she untangles complicated products, teams, and decisions until they make sense to humans. Alongside it, **"the short version"** — a compact frosted-glass brief card (name, roles: UX Consultant / UX Strategist / UX Lead / Design Ops Lead; base: Doha; focus areas), framed as considerate hosting: *"In a hurry? Here's the short version."* The scannable bio recruiters need. | Warm, bright |
| 2 | Case studies | "What does that look like in real life?" | Three cases, each a **light valley** (see §4). QBF (live video) + confidential cases (abstracted glass mockups). | Deepens per case: wine → jet black at messiest → warmth restored at resolution |
| 3 | How she works + skills | "How do you handle the messy middle?" | Five working beliefs (discovery, strategy, alignment, leadership, AI & systems) told as habits/philosophy, one statement at a time, thread weaving between them. The beat closes with **"the practical list"** — a quiet, scannable skill index grouped under the five domains (UX strategy, product thinking, UX research, information architecture, stakeholder workshops & communication, requirement gathering, design systems, design ops & team leadership, AI-assisted product design, digital transformation). Philosophy first, receipts after. | Dusk-turquoise, contemplative |
| 4 | Story | "Who taught you to see like this?" | The three moments — a workshop, an app, a book — as small glass-framed vignettes. Personal, brief, no career timeline. | Warming back up |
| 5 | Hobby projects | "And what do you make when nobody's paying you?" | The playground: side/hobby projects as playful glass tiles with light, fun microcopy (V2 Playground content carries over as source material). Shows curiosity and range without pretending to be a visual-design showcase. | Bright, playful warmth |
| 6 | Invitation | "Got a wonderfully complicated problem?" | She asks the *visitor* a question for once. One big email CTA; thread ties into a bow beside it. Minimal footer. | Brightest screen on the site — warmer than the opening |

## 4. Case studies — the light-valley model

Each case is a complete emotional journey through light:

1. **The mess first.** Scrolling into the case, the atmosphere deepens through wine toward jet black while the thread tangles. The problem is told plainly and concretely (e.g. "Fourteen stakeholders. Three vendors. No one agreed what the app was for.").
2. **The turn.** What she actually did. Light begins returning.
3. **The resolution.** Outcomes land in restored warmth; the thread smooths and flashes turquoise. Key metrics glow turquoise (the only place the color appears).

QBF closes with the live-site video in a glass frame (assets exist: `portfolio/public/media/qbf-hero.{mp4,webm}` + poster — copy into this repo). Confidential cases use abstracted glass mockups. Calm wine-toned breather screens between cases.

## 5. Art direction

### 5.1 The world is light, not pages

Background = one living atmosphere: slow-drifting warm gradient (layered radial gradients, barely perceptible motion) + fine film grain overlay. Content floats in it. No page backgrounds, no section boxes.

### 5.2 Color worlds (from the dyslove.design palette cards)

| World | Anchor | Role |
|-------|--------|------|
| Orchid | `#E5BDDF` + warm cream `#F6EFE7` | Human warmth — greeting, story, contact. The golden hour itself. |
| Wine Ash | `#322929` | Depth — the serious middle of case studies. |
| Jet Black | `#1A1A1A` (never `#000000`) | The messiest moment only. Brief — the darkest minute before resolution. |
| Turquoise | `#99E1D9` | Clarity — appears ONLY when a resolution lands (thread flash, key metric glow). Scarce, therefore meaningful. |

Text grades warm-cream ↔ wine-ink with the world; every world's text tokens are AA-contrast checked. Interpolation happens in OKLCH for perceptually smooth grades.

### 5.3 Typography — two voices, both sans

- **Interviewer's questions:** **Bricolage Grotesque** (Google Fonts; variable — optical size axis available for animation). The warmest characterful grotesk; display sizes have real personality. The biggest type moments on the site.
- **Sanya's answers + all UI:** **Satoshi** (Fontshare). Clean, warm-neutral.
- **No serif. No mono.** (Mono was Blueprint's engineering accent; this world is human.) No Inter.

### 5.4 Material

One material only: **soft frosted glass** — the language of the palette cards. Blurred panel, 1px inner light edge (`border-white/10` + inset highlight), content on atmosphere. Used for: case-study content panels, media frames, story vignettes, contact card. No hard cards, no borders-as-boxes; hierarchy from light, scale, and space.

## 6. Motion & interaction language

**Governing rule: the environment moves slowly; the interface responds instantly.** Two registers, never mixed:

- **Atmosphere (slow):** light grades over 1.5–2.5s at beat boundaries — you feel the room change, never watch it. Thread draws/untangles scrubbed directly by scroll progress.
- **Interface (fast):** every interactive element answers in <300ms with `cubic-bezier(0.23, 1, 0.32, 1)` (strong ease-out). Buttons compress `scale(0.97)` on `:active`. Keyboard-triggered actions never animate.

### Signature interactions (exactly four)

1. **Warmth follows you.** The atmosphere's gradient leans gently toward the pointer (spring-smoothed `useSpring`, decorative, disabled on touch). Not a custom cursor, not a spotlight — the room notices you.
2. **Questions arrive like they're being asked.** Masked line-by-line rise + subtle variable-font settle (Bricolage optical size eases to resting). Intonation, not animation.
3. **The thread reacts.** Hovering a case resolution straightens the nearby thread and warms it turquoise momentarily.
4. **Glass responds to light, not tilt.** Panel inner edge / internal glow shifts with pointer position. No 3D tilt.

### Choreography rules

- Staggered reveals 40–60ms apart; enters `ease-out`; on-screen morphs `ease-in-out`; exits faster than entries.
- No parallax stacking — the living light IS the depth cue.
- Hover states gated behind `@media (hover: hover) and (pointer: fine)`.

### Reduced motion

Full `prefers-reduced-motion` fallback: static gradient per beat (instant changes at boundaries), thread rendered fully resolved, all reveals become simple fades. Every motion hook passes through `useReducedMotion`.

## 7. Navigation

Near-invisible: a fine vertical thread at the screen edge with seven subtle nodes (the beats). Current question appears in tiny text on hover. Click travels to the beat. Keyboard-operable with visible focus. Mobile: single column; cursor-warmth off; atmosphere and thread simplified but present.

## 8. Technical architecture

### 8.1 Stack

- Next.js 16 (App Router) + React 19
- Tailwind v4, CSS-first (`@theme inline`; no tailwind.config)
- Framer Motion v12 + Lenis
- **No GSAP, no Three.js/R3F** — atmosphere is 2D (layered gradients), all this concept needs
- **No dark-mode toggle / no next-themes** — the site is its own lighting system

### 8.2 Three engines, one script

- **`LightScript`** — single source of truth: declarative timeline mapping scroll ranges → color worlds (OKLCH stops). Everything reads from it.
- **`Atmosphere`** — fixed full-viewport client component: layered radial gradients driven by motion values (GPU-cheap), fixed `pointer-events-none` grain layer, cursor-warmth spring. Subscribes to LightScript and flips CSS custom properties (`--ink`, `--surface`, …) so text/UI grade with the world.
- **`Thread`** — per-beat SVG segments (not one giant path) scrubbed via `pathLength`; tangle/resolve states are precomputed path pairs interpolated by scroll.

### 8.3 Sections & data

Beats as data-driven sections: `Greeting` · `WhatIDo` (incl. short-version brief card) · `CaseValley` (×3) · `MessyMiddle` (incl. skill index) · `Story` · `Playground` · `Invitation` + `ThreadNav`. All copy and case data live in one `content.ts` — no prose in components.

### 8.4 Performance rules

- Animate `transform`/`opacity` only; atmosphere isolated on its own layer; `will-change` sparing.
- Video lazy-loaded with poster; pause control provided.
- Scroll scrubbing via Framer `useScroll`; **nav jumps use smooth `scrollTo`** (V2 lesson: single programmatic jumps get missed by motion-value change events; smooth scrolling emits continuous events and always registers with Lenis).
- Grain/noise only on fixed `pointer-events-none` layers, never scrolling containers.
- Target smooth 60fps; perpetual animations isolated in leaf client components.

### 8.5 Accessibility

- Questions are real `h2`s in a semantic document; sane heading order; the conversation reads correctly with CSS off.
- AA contrast per world (tokens defined per light stop).
- Full reduced-motion fallback (see §6).
- ThreadNav keyboard-operable, `focus-visible` styles, `aria-current` on active beat.
- Video: muted autoplay with poster + accessible pause control; alt text everywhere.

## 9. Content inputs

- Case-study copy: adapt from V2's `content` / `docs/case-study-intake.md` in `portfolio/`, rewritten into the mess → turn → resolution shape and the warmer host voice.
- Story moments (workshop / app / book) carry over from V2's About, retold shorter.
- Hobby/side projects: carry over from V2's Playground section, rewritten into the host voice for Beat 5.
- Skill index (Beat 3) and short-version brief card (Beat 1): source facts from the master prompt's expertise list + V2 Capabilities domains.
- QBF video assets copied from `portfolio/public/media/`.
- Still pending from Sanya (do not block build): Field Notes personal bits, real case metrics, confirmation of drafted microcopy lines.

## 10. Dev environment notes

- OneDrive folder = flaky file watching; dev server can zombie. Register a new server name (e.g. `portfolio-v3`) in `.claude/launch.json` with autoPort; kill zombie `next dev` node processes when needed.
- Preview iframe caps at ~650px wide — verify two-column/desktop layouts in a real browser.
- JSX gotcha: wrap inline `<span>` highlights with `{" "}` on both sides.

## 11. Testing & verification

- Verify each beat at desktop and mobile widths via preview tools + real browser.
- Reduced-motion pass (emulate `prefers-reduced-motion`).
- Contrast audit per color world.
- Lighthouse performance check.
- Scroll-jump testing: sweep incrementally, wait ≥800ms after programmatic jumps (Lenis re-dispatch delay).

## 12. Explicitly out of scope

- Deployment (no GitHub/Vercel yet; `gh` not installed).
- The standalone single-file HTML mirror (V2 concern; V3 gets one only if Sanya asks).
- Editing/removing anything in `portfolio/` (V2 stays intact).
- Light/dark theme toggle.

## 13. Success criteria

1. First ten seconds feel like being welcomed somewhere warm — not shown a monument.
2. A designer scrolling it thinks "I've never seen a portfolio structured like this" (the conversation device).
3. The light valley is *felt* — complexity has weight, clarity has release.
4. Every interaction answers instantly; nothing is gimmicky; 60fps.
5. Fully usable with keyboard, reduced motion, and screen reader.
6. True to Sanya: UX strategist and host, not visual designer; humble, curious, dry-fun voice.
