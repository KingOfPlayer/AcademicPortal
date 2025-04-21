import { describe, it, expect } from "vitest";
import { AcademicStaffAnnouncementActivityRules } from "./academic-staff-announcement-activity-rules";

describe("Activity Rule", () => {
  it("Constructor Test", async () => {
    const academicStaffAnnouncementActivityRules: AcademicStaffAnnouncementActivityRules =
      new AcademicStaffAnnouncementActivityRules("Test 1", "A1", 200);

    expect(academicStaffAnnouncementActivityRules.description).toBe("Test 1");
  });
});
