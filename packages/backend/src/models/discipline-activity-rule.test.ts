import { describe, it, expect } from "vitest";
import { DisciplineActivityRule } from "./discipline-activity-rule";
import { DisciplinePosition } from "./disicpline-utils";

describe("Discipline Activity Rule", () => {
  it("Constructor Test", async () => {
    const rule = new DisciplineActivityRule({
      expression: "A1-A2",
      positionType: DisciplinePosition.AssociateProfessor,
      minimumCount: 200,
    });

    await expect(rule.validate()).resolves.not.toThrow();

    rule.expression = "A1-A.4";
    await expect(rule.validate()).rejects.toThrow();

    rule.expression = "A.1-A4";
    await expect(rule.validate()).rejects.toThrow();

    rule.expression = "A4-A1";
    await expect(rule.validate()).rejects.toThrow();

    rule.expression = "A1-A4";

    rule.minimumCount = 0;
    await expect(rule.validate()).rejects.toThrow();
  });
});
