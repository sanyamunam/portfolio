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
