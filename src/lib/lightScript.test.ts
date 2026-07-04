import { describe, expect, it } from "vitest";
import { sampleLight, STOPS, TEMP } from "./lightScript";

describe("sampleLight", () => {
  it("returns the exact stop at integer temperatures", () => {
    const t0 = sampleLight(0);
    expect(t0.bg).toBe("oklch(0.94 0.025 70 / 1)");
    const t3 = sampleLight(3);
    expect(t3.bg).toBe("oklch(0.2 0.005 0 / 1)");
  });

  it("clamps out-of-range temperatures", () => {
    expect(sampleLight(-1)).toEqual(sampleLight(0));
    expect(sampleLight(99)).toEqual(sampleLight(STOPS.length - 1));
  });

  it("falls back to the golden stop on NaN instead of crashing", () => {
    expect(sampleLight(NaN)).toEqual(sampleLight(0));
  });

  it("interpolates between stops", () => {
    const mid = sampleLight(0.5);
    expect(mid.bg).not.toBe(sampleLight(0).bg);
    expect(mid.bg).not.toBe(sampleLight(1).bg);
    // lightness halfway between golden 0.94 and ember 0.52
    expect(mid.bg).toContain("oklch(0.73");
  });

  it("exposes named beat temperatures within stop range", () => {
    for (const v of Object.values(TEMP)) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(STOPS.length - 1);
    }
  });
});
