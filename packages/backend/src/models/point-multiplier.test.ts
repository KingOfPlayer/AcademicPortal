import { describe, it, expect } from "vitest";
import { PointMultiplier } from "./point-multiplier";

describe("PointMultiplier Test", () => {
  it("Type 1", async () => {
    const pointMultiplier = new PointMultiplier("2", "1");
    expect(pointMultiplier.MatchRange(2)).toBe(true);
    expect(pointMultiplier.MatchRange(3)).toBe(false);
  });

  it("Type 2", async () => {
    const pointMultiplier = new PointMultiplier("2-5", "1/people");

    expect(pointMultiplier.MatchRange(1)).toBe(false);
    expect(pointMultiplier.MatchRange(2)).toBe(true);
    expect(pointMultiplier.MatchRange(4)).toBe(true);
    expect(pointMultiplier.MatchRange(5)).toBe(true);
    expect(pointMultiplier.MatchRange(6)).toBe(false);

    expect(pointMultiplier.EvaluateMultiplier(4)).toBe(1 / 4);
  });

  it("Type 3", async () => {
    const pointMultiplier = new PointMultiplier("+5", "1/people");

    expect(pointMultiplier.MatchRange(4)).toBe(false);
    expect(pointMultiplier.MatchRange(5)).toBe(true);
    expect(pointMultiplier.MatchRange(6)).toBe(true);

    expect(pointMultiplier.EvaluateMultiplier(10)).toBe(1 / 10);
  });
});
