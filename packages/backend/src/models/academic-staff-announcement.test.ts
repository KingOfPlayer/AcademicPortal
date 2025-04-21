import { describe, it, expect } from "vitest";
import { AcademicStaffAnnouncement } from "./academic-staff-announcement";
import { AcademicStaffAnnouncementActivityRules } from "./academic-staff-announcement-activity-rules";
import { AcademicStaffAnnouncementPointRules } from "./academic-staff-announcement-point-rules";

describe("Announcement Model", () => {
  it("Announcement Create", async () => {
    const announcement = new AcademicStaffAnnouncement();
    announcement.applyEndDate = new Date(Date.now() + 1000 * 60);
    announcement.resultPublishDate = new Date(Date.now() + 1000 * 300);
    announcement.title = "Announcement Title";
    announcement.description = "Announcement Description";
    announcement.activityRules = [
      new AcademicStaffAnnouncementActivityRules("ActivityRules", "123", 10),
    ];
    announcement.pointRules = [
      new AcademicStaffAnnouncementPointRules("ActivityRules", "123", 10, 20),
    ];

    await announcement.save();
  });

  it("Announcement Find", async () => {
    const announcement = await AcademicStaffAnnouncement.findOne({
      title: "Announcement Title",
    });

    expect(announcement?.description).toBe("Announcement Description");
  });

  it("Announcement Update", async () => {
    let announcement = await AcademicStaffAnnouncement.findOne({
      title: "Announcement Title",
    });

    announcement!.title = "Announcement Title 2";
    await announcement?.save();

    announcement = await AcademicStaffAnnouncement.findOne({
      title: "Announcement Title 2",
    });
    expect(announcement?.title).toBe("Announcement Title 2");
  });
});
