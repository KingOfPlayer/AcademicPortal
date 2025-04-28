import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Appeal } from "./appeal";
import { DisciplinePosition } from "./disicpline-utils";
import { DisciplinePointRule } from "./discipline-point-rule";
import { DisciplineActivityRule } from "./discipline-activity-rule";
import { DisciplineRule } from "./discipline-rule";
import { StaffAnnouncement } from "./staff-announcement";
import { User, UserRoles } from "./user";

describe("Appeal", () => {
  beforeAll(async () => {
    //Dicipline Rule
    const disciplineRule = new DisciplineRule({
      disiciplineName: "Test Rule",
      description: "Test Rule Description",
      activityRules: [
        new DisciplineActivityRule({
          activityName: "Test Activity 1",
          positionType: DisciplinePosition.Lecturer,
          expression: "A1",
          minimumCount: 1,
        }),
        new DisciplineActivityRule({
          activityName: "Test Activity 1",
          positionType: DisciplinePosition.AssociateProfessor,
          expression: "A2",
          minimumCount: 1,
        }),
        new DisciplineActivityRule({
          activityName: "Test Activity 1",
          positionType: DisciplinePosition.Professor,
          expression: "A3",
          minimumCount: 1,
        }),
      ],
      pointRules: [
        new DisciplinePointRule({
          expression: "A1",
          positionType: DisciplinePosition.Lecturer,
          minPoint: 0,
          maxPoint: 100,
        }),
        new DisciplinePointRule({
          expression: "A2",
          positionType: DisciplinePosition.AssociateProfessor,
          minPoint: 0,
          maxPoint: 100,
        }),
        new DisciplinePointRule({
          expression: "A3",
          positionType: DisciplinePosition.Professor,
          minPoint: 0,
          maxPoint: 100,
        }),
      ],
    });
    await disciplineRule.save();
    const disciplineRules = await DisciplineRule.find();

    //Staff Announcement
    const staffAnnouncement = new StaffAnnouncement({
      title: "Test Title",
      content: "Test Content",
      startDate: new Date(),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day from now
      disciplineRules: disciplineRules,
    });
    await staffAnnouncement.save();

    //User
    const user = new User({
      email: "test@test.com",
      roles: [UserRoles.Applicant],
      id_number: 12345678912,
      name: "Test_Name",
      surname: "Test_surname",
      password: "123456789",
      bornYear: 45, //temp
    });
    await user.save();
  });

  afterAll(async () => {
    await Appeal.deleteMany({});
    await StaffAnnouncement.deleteMany({});
    await User.deleteMany({});
    await DisciplineRule.deleteMany({});
  });

  it("Create Appeal", async () => {
    const announcement = await StaffAnnouncement.findOne({
      title: "Test Title",
    });
    const user = await User.findOne({ name: "Test_Name" });
    const appeal = new Appeal({
      announcement: announcement?._id,
      user: user?._id,
      appealContents: [],
    });
    await appeal.save();
  });

  it("Duplicate Appeal", async () => {
    const announcement = await StaffAnnouncement.findOne({
      title: "Test Title",
    });
    const user = await User.findOne({ name: "Test_Name" });
    const appeal = new Appeal({
      announcement: announcement?._id,
      user: user?._id,
      appealContents: [],
    });
    await expect(appeal.save()).rejects.toThrow();
  });

  it("Get Appeal", async () => {
    const user = await User.findOne({ name: "Test_Name" });
    const appeal = await Appeal.findOne({ user: user?._id });
    expect(appeal).not.toBeNull();
    expect(appeal?.announcement).not.toBeNull();
  });

  it("Delete Announcement", async () => {
    const announcement = await StaffAnnouncement.findOne({
      title: "Test Title",
    });
    if (announcement) {
      await StaffAnnouncement.deleteOne({ _id: announcement._id });
    }
    const appeal = await Appeal.findOne({ announcement: announcement?._id });
    expect(appeal).toBeNull();
  });
});
