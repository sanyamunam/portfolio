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
  it("never returns -0", () => {
    // exact-cancellation case: without the guard, the raw modulo math can yield -0
    expect(Object.is(lerpHue(0, 180, 0), -0)).toBe(false);
    expect(lerpHue(0, 180, 0)).toBe(0);
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
