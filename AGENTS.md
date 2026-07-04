# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# Project notes

- Spec: `docs/superpowers/specs/2026-07-04-golden-hour-portfolio-design.md`. Read it before design decisions.
- One motion value (light temperature 0–4) drives the whole atmosphere. Do not add per-section backgrounds.
- All copy lives in `src/content/content.ts` — no prose in components.
- Every animation must have a `useReducedMotion` / `prefers-reduced-motion` fallback.
- Animate only `transform`/`opacity` (background gradients are driven via CSS variables on fixed layers).
