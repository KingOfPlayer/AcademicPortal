import { describe, it, expect, afterAll, beforeAll } from "vitest";

import { User, UserRoles } from "../models/user";
import { DisciplineActivityRule } from "../models/discipline-activity-rule";
import { StaffAnnouncement } from "../models/staff-announcement";
import { DisciplinePosition } from "../models/disicpline-utils";
import { DisciplineRule } from "../models/discipline-rule";
import { AddUser, GetUser } from "./user-service";
import { AddDisciplineRule } from "./disicpline-rule-service";
import { DisciplinePointRule } from "../models/discipline-point-rule";
import { StaffAnnouncementDTO } from "../models/dtos/staff-announcement-dto";
import { AddStaffAnnouncement, GetStaffAnnouncements } from "./staff-announcement";
import { AddAppeal, DeleteAppeal, DeleteAppealContent, GetAppeal, GetAppealByAnnouncementIdAndUserId, GetAppeals, GetAppealsByAnnouncementId, GetAppealsByUserId, InsertAppealContent, UpdateAppeal } from "./appeal-service";

describe("Appeal Service Test", () => {
  beforeAll(async () => {
    await AddUser({
      password: "testpassword",
      email: "test@test.com",
      name: "Test",
      surname: "User",
      roles: [UserRoles.Jury],
      id_number: 12345678901,
      age: 30,
      bornYear: 1993,
    });

    await AddUser({
      password: "testpassword",
      email: "test@test.com",
      name: "Test",
      surname: "User",
      roles: [UserRoles.Applicant],
      id_number: 12345678902,
      age: 30,
      bornYear: 1993,
    });

    await AddDisciplineRule({
      disiciplineName: "Test 1",
      activityRules: [
        new DisciplineActivityRule({
          expression: "A1-A2",
          positionType: DisciplinePosition.AssociateProfessor,
          minimumCount: 200,
        }),
      ],
      pointRules: [
        new DisciplinePointRule({
          expression: "A1-A4",
          positionType: DisciplinePosition.Lecturer,
          minPoint: 0,
          maxPoint: 0,
        }),
      ],
    });

    const jury = await GetUser(12345678901);
    expect(jury).toBeDefined();
    expect(jury?.roles).toContain(UserRoles.Jury);

    const staffAnnouncement: StaffAnnouncementDTO = {
      title: "Test Staff Announcement",
      content: "Test Staff Announcement Description",
      startDate: new Date(),
      endDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      juries: [jury._id!],
    };
    await AddStaffAnnouncement(staffAnnouncement);
  });

  afterAll(async () => {
    User.deleteMany();
    DisciplineRule.deleteMany();
    StaffAnnouncement.deleteMany();
  });

  it("Create Appeal", async () => {
    const applicantUser = await GetUser(12345678902);
    expect(applicantUser).toBeDefined();
    expect(applicantUser?.roles).toContain(UserRoles.Applicant);

    const announcements = await GetStaffAnnouncements();
    expect(announcements).toBeDefined();
    expect(announcements.length).toBeGreaterThan(0);

    const announcement = announcements[0];
    await AddAppeal({
      announcement: announcement._id!,
      user: applicantUser,
      appealContents: [],
    });
  });

  it("Get Appeals", async () => {
    const appeals = await GetAppeals();
    expect(appeals).toBeDefined();
    expect(appeals.length).toBeGreaterThan(0);
  });

  it("Get user appeals", async () => {
    const applicantUser = await GetUser(12345678902);
    expect(applicantUser).toBeDefined();
    expect(applicantUser?.roles).toContain(UserRoles.Applicant);

    const appeals = await GetAppealsByUserId(applicantUser._id!.toString());
    expect(appeals).toBeDefined();
    expect(appeals.length).toBeGreaterThan(0);
  });

  it("Get announcement appeals", async () => {
    const announcements = await GetStaffAnnouncements();
    expect(announcements).toBeDefined();
    expect(announcements.length).toBeGreaterThan(0);

    const announcement = announcements[0];
    expect(announcement).toBeDefined();

    const appeals = await GetAppealsByAnnouncementId(
      announcement!._id!.toString(),
    );
    expect(appeals).toBeDefined();
    expect(appeals.length).toBeGreaterThan(0);
  });

  it("Get appeals by announcement and user", async () => {
    const applicantUser = await GetUser(12345678902);
    expect(applicantUser).toBeDefined();
    expect(applicantUser?.roles).toContain(UserRoles.Applicant);
    const announcements = await GetStaffAnnouncements();
    expect(announcements).toBeDefined();
    expect(announcements.length).toBeGreaterThan(0);
    const announcement = announcements[0];
    expect(announcement).toBeDefined();
    const appeal = await GetAppealByAnnouncementIdAndUserId(
      announcement!._id!.toString(),
      applicantUser!._id!.toString(),
    );
    expect(appeal).toBeDefined();
    expect(appeal!.announcement._id!.toString()).toBe(announcement._id!.toString());
    expect(appeal!.user._id!.toString()).toBe(applicantUser._id!.toString());
  });

  it("Insert Appeal Content", async () => {
    const user = await GetUser(12345678902);
    expect(user).toBeDefined();
    expect(user?.roles).toContain(UserRoles.Applicant);
    const appeals = await GetAppealsByUserId(user!._id!.toString());
    expect(appeals).toBeDefined();
    expect(appeals.length).toBeGreaterThan(0);
    const appeal = appeals[0];
    expect(appeal).toBeDefined();
    expect(appeal.appealContents.length).toBe(0);
    await InsertAppealContent(
      appeal._id!.toString(),
      {
        content: "Test Appeal Content",
        contentPath: "test/path",
        createdAt: new Date(),
        updatedAt: new Date(),
        activityType: [
          {
            categoryCode: "A",
            categoryID: 1,
          },
        ],
      }
    );
    const updatedAppeal = await GetAppeal(appeal._id!.toString());
    expect(updatedAppeal).toBeDefined();
    expect(updatedAppeal?.appealContents.length).toBe(1);
    expect(updatedAppeal?.appealContents[0].content).toBe("Test Appeal Content");
  });

  it("Delete Appeal Content", async () => {
    const user = await GetUser(12345678902);
    expect(user).toBeDefined();
    expect(user?.roles).toContain(UserRoles.Applicant);
    const appeals = await GetAppealsByUserId(user!._id!.toString());
    expect(appeals).toBeDefined();
    expect(appeals.length).toBeGreaterThan(0);
    const appeal = appeals[0];
    expect(appeal).toBeDefined();
    expect(appeal.appealContents.length).toBe(1);
    await DeleteAppealContent(
      appeal._id!.toString(),
      appeal.appealContents[0]._id!.toString(),
    );
    const updatedAppeal = await GetAppeal(appeal._id!.toString());
    expect(updatedAppeal).toBeDefined();
    expect(updatedAppeal?.appealContents.length).toBe(0);
  });

  it("Delete Appeal", async () => {
    const user = await GetUser(12345678902);
    expect(user).toBeDefined();
    expect(user?.roles).toContain(UserRoles.Applicant);
    const appeals = await GetAppealsByUserId(user!._id!.toString());
    expect(appeals).toBeDefined();
    expect(appeals.length).toBeGreaterThan(0);
    const appeal = appeals[0];
    await DeleteAppeal(appeal._id!.toString());
    const updatedAppeal = await GetAppeal(appeal._id!.toString());
    expect(updatedAppeal).toBeNull();
    const updatedAppeals = await GetAppealsByUserId(user!._id!.toString());
    expect(updatedAppeals).toBeDefined();
    expect(updatedAppeals.length).toBe(0);
  });
});
