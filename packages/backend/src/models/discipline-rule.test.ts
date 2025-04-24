import { describe, it, expect, afterAll } from "vitest";
import { DisciplineRule } from "./discipline-rule";
import { DisciplineActivityRule } from "./discipline-activity-rule";
import { DisciplineStaffPointRule } from "./discipline-point-rule";
import { DisciplinePosition } from "./disicpline-utils";

describe("Academic Staff Discipline Rule Model", () => {
  afterAll(async () => {
    await DisciplineRule.deleteMany();
  });

  it("Create", async () => {
    const staffDiscipline = new DisciplineRule();
    staffDiscipline.disiciplineName = "Sağlık Bilimleri";
    staffDiscipline.activityRules = [
      new DisciplineActivityRule({
        expression: "A1-A2",
        positionType: DisciplinePosition.AssociateProfessor,
        minimumCount: 200,
      }),
    ];
    staffDiscipline.pointRules = [
      new DisciplineStaffPointRule({
        expression: "A1-A4",
        positionType: DisciplinePosition.Lecturer,
        minPoint: 0,
        maxPoint: 0,
      }),
    ];

    await staffDiscipline.save();
  });

  it("Find", async () => {
    const staffDiscipline = await DisciplineRule.findOne({
      disiciplineName: "Sağlık Bilimleri",
    });

    expect(staffDiscipline?.activityRules.length).toBe(1);
  });

  it("Update", async () => {
    let staffDiscipline = await DisciplineRule.findOne({
      disiciplineName: "Sağlık Bilimleri",
    });

    staffDiscipline?.activityRules.push(
      new DisciplineActivityRule({
        expression: "A1-A2",
        positionType: DisciplinePosition.Lecturer,
        minimumCount: 200,
      }),
    );
    await staffDiscipline?.save();

    staffDiscipline = await DisciplineRule.findOne({
      disiciplineName: "Sağlık Bilimleri",
    });

    expect(staffDiscipline?.activityRules.length).toBe(2);
  });
});
