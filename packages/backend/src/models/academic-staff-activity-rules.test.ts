import { describe, it, expect } from "vitest";
import { AcademicStaffActivityRules } from "./academic-staff-activity-rules";
import { StaffPosition } from "./academic-staff-discipline-rules";

describe("Academic Staff Activity Rules", () => {
  it("Constructor Test", async () => {
    const academicStaffActivityRules: AcademicStaffActivityRules =
      new AcademicStaffActivityRules(
        "A.1-A.2",
        StaffPosition.AssociateProfessor,
        200,
      );

    expect(academicStaffActivityRules.expression).toBe("A.1-A.2");
  });
});
