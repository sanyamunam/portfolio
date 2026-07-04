import { describe, expect, it } from "vitest";
import { proximity, stretchFor } from "./cursor";

describe("stretchFor", () => {
  it("is 1 at rest", () => {
    expect(stretchFor(0)).toBe(1);
  });
  it("grows with speed", () => {
    expect(stretchFor(2500)).toBeCloseTo(1.15);
  });
  it("caps at 1.3", () => {
    expect(stretchFor(50000)).toBe(1.3);
  });
  it("never dips below 1 for negative speeds", () => {
    expect(stretchFor(-500)).toBe(1);
  });
});

describe("proximity", () => {
  it("is 1 at zero distance", () => {
    expect(proximity(0, 120)).toBe(1);
  });
  it("fades linearly", () => {
    expect(proximity(60, 120)).toBeCloseTo(0.5);
  });
  it("clamps to 0 beyond the radius", () => {
    expect(proximity(200, 120)).toBe(0);
  });
  it("is 0 for a degenerate radius", () => {
    expect(proximity(10, 0)).toBe(0);
  });
});
