import { describe, it, expect } from "vitest";
import { AcademicStaffActivityRules } from "./academic-staff-activity-rules";
import { StaffPosition } from "./academic-staff-disicpline-utils";

describe("Academic Staff Activity Rules", () => {
  it("Constructor Test", async () => {
    const academicStaffActivityRules =
      new AcademicStaffActivityRules({
        expression: "A1-A2",
        positionType: StaffPosition.AssociateProfessor,
        minimumCount: 200,
      });

    expect(academicStaffActivityRules.expression).toBe("A1-A2");
  });
});
