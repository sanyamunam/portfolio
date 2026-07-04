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
  // NaN would otherwise crash deep inside the mixer (called per animation
  // frame) — fall back to the golden opening state instead.
  const v = Number.isNaN(t) ? 0 : Math.min(max, Math.max(0, t));
  const i = Math.min(max - 1, Math.floor(v));
  const f = v - i;
  const out = {} as LightTokens;
  for (const k of KEYS) {
    out[k] = toCss(mixOklch(STOPS[i][k], STOPS[i + 1][k], f));
  }
  return out;
}

/**
 * Named target temperatures per beat (spec §3).
 * These are ordinal positions on the STOPS axis above — inserting or
 * reordering a stop changes what every value here means. Edit both together.
 */
export const TEMP = {
  greeting: 0,
  about: 0.3,
  messyMiddle: 4,
  playground: 0.3,
  invitation: 0,
} as const;
