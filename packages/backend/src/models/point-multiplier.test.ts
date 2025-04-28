import { describe, it, expect } from "vitest";
import { PointMultiplier } from "./point-multiplier";

describe("PointMultiplier Test", () => {
  it("Type 1", async () => {
    const pointMultiplier = new PointMultiplier({
      peopleCountCondition: "2",
      multiplier: "1",
    });
    expect(PointMultiplier.MatchRange(pointMultiplier, 2)).toBe(true);
    expect(PointMultiplier.MatchRange(pointMultiplier, 3)).toBe(false);
  });

  it("Type 2", async () => {
    const pointMultiplier = new PointMultiplier({
      peopleCountCondition: "2-5",
      multiplier: "1/people",
    });

    expect(PointMultiplier.MatchRange(pointMultiplier, 1)).toBe(false);
    expect(PointMultiplier.MatchRange(pointMultiplier, 2)).toBe(true);
    expect(PointMultiplier.MatchRange(pointMultiplier, 4)).toBe(true);
    expect(PointMultiplier.MatchRange(pointMultiplier, 5)).toBe(true);
    expect(PointMultiplier.MatchRange(pointMultiplier, 6)).toBe(false);

    expect(PointMultiplier.EvaluateMultiplier(pointMultiplier, 4)).toBe(1 / 4);
  });

  it("Type 3", async () => {
    const pointMultiplier = new PointMultiplier({
      peopleCountCondition: "+5",
      multiplier: "1/people",
    });

    expect(PointMultiplier.MatchRange(pointMultiplier, 4)).toBe(false);
    expect(PointMultiplier.MatchRange(pointMultiplier, 5)).toBe(true);
    expect(PointMultiplier.MatchRange(pointMultiplier, 6)).toBe(true);

    expect(PointMultiplier.EvaluateMultiplier(pointMultiplier, 10)).toBe(
      1 / 10,
    );
  });
});
