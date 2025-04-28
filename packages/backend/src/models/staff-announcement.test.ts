import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { StaffAnnouncement } from "./staff-announcement";
import { DisciplineRule } from "./discipline-rule";
import { DisciplineActivityRule } from "./discipline-activity-rule";
import { DisciplinePointRule } from "./discipline-point-rule";
import { DisciplinePosition } from "./disicpline-utils";
import { IUser, User, UserRoles } from "./user";

describe("StaffAnnouncement", async () => {
  afterAll(async () => {
    await DisciplineRule.deleteMany();
    await StaffAnnouncement.deleteMany();
  });

  beforeAll(async () => {
    //Dicipline Rule
    const disciplineRules = new DisciplineRule({
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
    await disciplineRules.save();

    const user = new User({
      name: "Test User",
      surname: "Test Surname",
      email: "test@test.com",
      password: "testpassword",
      id_number: 12345678901,
      roles: UserRoles.Jury,
      bornYear: 1990,
      age: 33,
    });
    await user.save();
  });

  it("Create a new staff announcement", async () => {
    const disciplineRules = await DisciplineRule.find({});
    const jury = await User.findOne({ roles: UserRoles.Jury });

    const staffAnnouncement = new StaffAnnouncement({
      title: "Test Title",
      content: "Test Content",
      startDate: new Date(),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day from now
      disciplineRules: disciplineRules,
      juries: [jury],
    });

    await staffAnnouncement.save();
  });

  it("Get staff announcement juries", async () => {
    const staffAnnouncement = await StaffAnnouncement.findOne({
      title: "Test Title",
    }).populate<{ juries: IUser[] }>("juries");
    expect(staffAnnouncement).toBeDefined();
    expect(staffAnnouncement!.juries.length).toBeGreaterThan(0);
    console.log(staffAnnouncement!.juries);
    expect(staffAnnouncement!.juries[0].name).toBe("Test User");
  });

  it("Get all staff announcements", async () => {
    const staffAnnouncements = await StaffAnnouncement.find();
    expect(staffAnnouncements).toBeDefined();
    expect(staffAnnouncements.length).toBeGreaterThan(0);
    expect(staffAnnouncements[0].title).toBe("Test Title");
    expect(staffAnnouncements[0].content).toBe("Test Content");
  });
});
