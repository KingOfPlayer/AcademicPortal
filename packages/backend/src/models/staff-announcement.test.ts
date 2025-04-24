import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { StaffAnnouncement } from "./staff-announcement";
import { DisciplineRule } from "./discipline-rule";
import { DisciplineActivityRule } from "./discipline-activity-rule";
import { DisciplinePointRule } from "./discipline-point-rule";
import { DisciplinePosition } from "./disicpline-utils";
import { ActivityCategory } from "./activity-category";

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
                    minimumCount: 1
                }),
                new DisciplineActivityRule({
                    activityName: "Test Activity 1",
                    positionType: DisciplinePosition.AssociateProfessor,
                    expression: "A2",
                    minimumCount: 1
                }),
                new DisciplineActivityRule({
                    activityName: "Test Activity 1",
                    positionType: DisciplinePosition.Professor,
                    expression: "A3",
                    minimumCount: 1
                }),
            ],
            pointRules: [
                new DisciplinePointRule({
                    expression: "A1",
                    positionType: DisciplinePosition.Lecturer,
                    minPoint: 0,
                    maxPoint: 100
                }),
                new DisciplinePointRule({
                    expression: "A2",
                    positionType: DisciplinePosition.AssociateProfessor,
                    minPoint: 0,
                    maxPoint: 100
                }),
                new DisciplinePointRule({
                    expression: "A3",
                    positionType: DisciplinePosition.Professor,
                    minPoint: 0,
                    maxPoint: 100
                })
            ]
        });
        await disciplineRules.save();
    });

    it('Create a new staff announcement', async () => {
        const disciplineRules = await DisciplineRule.find({});

        const staffAnnouncement = new StaffAnnouncement({
            title: "Test Title",
            content: "Test Content",
            startDate: new Date(),
            endDate: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day from now
            disciplineRules: disciplineRules,
        });

        await staffAnnouncement.save();
    });

    it('Get all staff announcements', async () => {
        const staffAnnouncements = await StaffAnnouncement.find();
        expect(staffAnnouncements).toBeDefined();
        expect(staffAnnouncements.length).toBeGreaterThan(0);
        expect(staffAnnouncements[0].title).toBe("Test Title");
        expect(staffAnnouncements[0].content).toBe("Test Content");
    });
});