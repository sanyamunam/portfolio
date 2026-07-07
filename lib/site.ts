/* The site now lives at the domain root (sanyamunam.com), so raw asset
   URLs need no prefix. withBase stays as the single indirection point
   in case the serving path ever changes again. */
export const SITE_URL = 'https://sanyamunam.com';

export const BASE = '';

export const withBase = (path: string) => `${BASE}${path}`;

/* Theme-aware accent tint: mixes a brand token with transparency so the
   same markup renders pale washes in the darkroom and deep inks in
   daylight. pct is the opaque share (0–100). */
export const mix = (token: string, pct: number) =>
  `color-mix(in srgb, var(--${token}) ${pct}%, transparent)`;

/* Surface wash: like mix(), but amplified by --wash-boost (1 in the
   darkroom, >1 in daylight) so background washes stay visible on paper
   without touching the dark theme. Use for surfaces only — keep the
   base pct low enough that pct × boost stays under 100. */
export const wash = (token: string, pct: number) =>
  `color-mix(in srgb, var(--${token}) calc(${pct}% * var(--wash-boost, 1)), transparent)`;
