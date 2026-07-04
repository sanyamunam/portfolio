/** [lightness 0-1, chroma, hue deg, alpha 0-1 (default 1)] */
export type Ok = [number, number, number, number?];

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Hue interpolation along the shortest arc (handles the 0/360 wrap). */
export function lerpHue(a: number, b: number, t: number): number {
  const d = ((b - a + 540) % 360) - 180;
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
