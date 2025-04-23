import { describe, it, expect } from "vitest";
import { AcademicStaffActivityRules } from "./academic-staff-activity-rules";
import { StaffPosition } from "./academic-staff-disicpline-utils";

describe("Academic Staff Activity Rule", () => {
  it("Constructor Test", async () => {
    const rule =
      new AcademicStaffActivityRules({
        expression: "A1-A2",
        positionType: StaffPosition.AssociateProfessor,
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
