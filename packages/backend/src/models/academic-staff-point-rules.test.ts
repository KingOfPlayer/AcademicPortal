import { describe, it, expect } from "vitest";
import { AcademicStaffPointRules } from "./academic-staff-point-rules";
import { StaffPosition } from "./academic-staff-discipline-rules";

describe("Academic Staff Point Rule", () => {
  it("Constructor Test", async () => {
    const academicStaffPointRules: AcademicStaffPointRules =
      new AcademicStaffPointRules("A.1-A.4", StaffPosition.Lecturer, 45, 0);
    expect(academicStaffPointRules.expression == "A.1-A.4").toBe(true);
  });
});
