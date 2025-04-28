import { describe, it, expect, afterAll, beforeAll } from "vitest";
import { User, UserRoles } from "../models/user";
import { AddUser, GetUser } from "./user-service";
import {
  AddStaffAnnouncement,
  DeleteStaffAnnouncement,
  GetJuriesFromStaffAnnouncement,
  GetStaffAnnouncementById,
  GetStaffAnnouncements,
  GetStaffAnnouncementsByJuryIdNumber,
  UpdateDisciplineRulesAtStaffAnnouncement,
  UpdateStaffAnnouncement,
} from "./staff-announcement";
import { StaffAnnouncementDTO } from "../models/dtos/staff-announcement-dto";
import { AddDisciplineRule } from "./disicpline-rule-service";
import { DisciplineActivityRule } from "../models/discipline-activity-rule";
import { DisciplinePosition } from "../models/disicpline-utils";
import { DisciplinePointRule } from "../models/discipline-point-rule";

describe("Staff Announcement Service Test", () => {
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
  });

  afterAll(async () => {
    User.deleteMany();
  });

  it("Add Staff Announcement", async () => {
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

  it("Get Staff Announcements", async () => {
    const staffAnnouncements = await GetStaffAnnouncements();
    expect(staffAnnouncements).toBeDefined();
    expect(staffAnnouncements.length).toBeGreaterThan(0);
  });

  it("Get Staff Anncouncement By Id", async () => {
    const staffAnnouncements = await GetStaffAnnouncements();
    expect(staffAnnouncements).toBeDefined();
    expect(staffAnnouncements.length).toBeGreaterThan(0);
    const staffAnnouncement = staffAnnouncements[0];
    const staffAnnouncementById = await GetStaffAnnouncementById(
      staffAnnouncement._id!.toString(),
    );
    expect(staffAnnouncementById).toBeDefined();
    expect(staffAnnouncementById?._id).toEqual(staffAnnouncement._id);
  });

  it("Get Staff Announcements By Jury", async () => {
    const jury = await GetUser(12345678901);
    expect(jury).toBeDefined();
    expect(jury?.roles).toContain(UserRoles.Jury);

    const staffAnnouncements = await GetStaffAnnouncementsByJuryIdNumber(
      jury!.id_number!,
    );
    expect(staffAnnouncements).toBeDefined();
    expect(staffAnnouncements.length).toBeGreaterThan(0);
  });

  it("Get Juries From Staff Announcement", async () => {
    const staffAnnouncements = await GetStaffAnnouncements();
    expect(staffAnnouncements).toBeDefined();
    const juries = await GetJuriesFromStaffAnnouncement(
      staffAnnouncements[0]._id!.toString(),
    );
    expect(juries).toBeDefined();
    expect(juries.length).toBeGreaterThan(0);
  });

  it("Update Staff Announcement", async () => {
    const staffAnnouncements = await GetStaffAnnouncements();
    expect(staffAnnouncements).toBeDefined();
    expect(staffAnnouncements.length).toBeGreaterThan(0);
    const staffAnnouncement = staffAnnouncements[0];
    const updatedStaffAnnouncement: StaffAnnouncementDTO = {
      title: "Updated Test Staff Announcement",
      content: "Updated Test Staff Announcement Description",
      startDate: new Date(),
      endDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      juries: [],
    };
    const updatedStaffAnnouncementResult = await UpdateStaffAnnouncement(
      staffAnnouncement._id!.toString(),
      updatedStaffAnnouncement,
    );
    expect(updatedStaffAnnouncementResult).toBeDefined();
    expect(updatedStaffAnnouncementResult?.title).toEqual(
      updatedStaffAnnouncement.title,
    );
    expect(updatedStaffAnnouncementResult?.juries).toEqual([]);
  });

  it("Update Discipline Rules At Staff Announcement", async () => {
    const staffAnnouncements = await GetStaffAnnouncements();
    const updatedstaffAnnouncements =
      await UpdateDisciplineRulesAtStaffAnnouncement(
        staffAnnouncements[0]._id!.toString(),
      );
    expect(updatedstaffAnnouncements).toBeDefined();
    expect(updatedstaffAnnouncements?.disciplineRules).toBeDefined();
    expect(updatedstaffAnnouncements?.disciplineRules!.length).toBeGreaterThan(
      0,
    );
  });

  it("Delete Staff Announcement", async () => {
    const staffAnnouncements = await GetStaffAnnouncements();
    expect(staffAnnouncements).toBeDefined();
    expect(staffAnnouncements.length).toBeGreaterThan(0);
    const staffAnnouncement = staffAnnouncements[0];
    await DeleteStaffAnnouncement(staffAnnouncement._id!.toString());
    const afterStaffAnnouncements = await GetStaffAnnouncements();
    expect(afterStaffAnnouncements).toBeDefined();
    expect(afterStaffAnnouncements.length).toBeLessThan(
      staffAnnouncements.length,
    );
  });
});
