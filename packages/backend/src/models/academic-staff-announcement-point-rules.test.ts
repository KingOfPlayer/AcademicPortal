import { describe, it, expect } from "vitest";
import { AcademicStaffAnnouncementPointRules } from "./academic-staff-announcement-point-rules";

describe("Point Rule", () => {
  it("Constructor Test", async () => {
    const academicStaffAnnouncementPointRules: AcademicStaffAnnouncementPointRules =
      new AcademicStaffAnnouncementPointRules("Test 1", "20", 10, 50);
    expect(academicStaffAnnouncementPointRules.description == "Test 1").toBe(
      true,
    );
  });
});
