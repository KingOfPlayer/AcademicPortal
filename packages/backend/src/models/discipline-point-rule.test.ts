import { describe, it, expect } from "vitest";
import { DisciplineStaffPointRule } from "./discipline-point-rule";
import { DisciplinePosition } from "./disicpline-utils";

describe("Academic Staff Point Rule", () => {
  it("Constructor Test", async () => {
    const rule = new DisciplineStaffPointRule({
      expression: "A1-A4",
      positionType: DisciplinePosition.Professor,
      minPoint: 1,
      maxPoint: 45,
    });

    await expect(rule.validate()).resolves.not.toThrow();

    rule.expression = "A1-A.4";
    await expect(rule.validate()).rejects.toThrow();

    rule.expression = "A.1-A4";
    await expect(rule.validate()).rejects.toThrow();

    rule.expression = "A4-A1";
    await expect(rule.validate()).rejects.toThrow();

    rule.expression = "A1-A4";

    rule.minPoint = 0;
    rule.maxPoint = 45;
    await expect(rule.validate()).resolves.not.toThrow();

    rule.minPoint = 0;
    rule.maxPoint = 0;
    await expect(rule.validate()).resolves.not.toThrow();

    rule.minPoint = 45;
    rule.maxPoint = 0;
    await expect(rule.validate()).rejects.toThrow();
  });
});
