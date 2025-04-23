import { describe, it, expect } from "vitest";
import { AcademicStaffDisciplineRules } from "./academic-staff-discipline-rules";
import { AcademicStaffActivityRules } from "./academic-staff-activity-rules";
import { AcademicStaffPointRules } from "./academic-staff-point-rules";
import { StaffPosition } from "./academic-staff-disicpline-utils";

describe("Academic Staff Discipline Rule Model", () => {
  it("Create", async () => {
    const staffDiscipline = new AcademicStaffDisciplineRules();
    staffDiscipline.disiciplineName = "Sağlık Bilimleri";
    staffDiscipline.activityRules = [
      new AcademicStaffActivityRules({
        expression: "A1-A2",
        positionType: StaffPosition.AssociateProfessor,
        minimumCount: 200,
      }),
    ];
    staffDiscipline.pointRules = [
      new AcademicStaffPointRules({
        expression: "A1-A4",
        positionType: StaffPosition.Lecturer,
        minPoint: 0,
        maxPoint: 0,
      }),
    ];

    await staffDiscipline.save();
  });

  it("Find", async () => {
    const staffDiscipline = await AcademicStaffDisciplineRules.findOne({
      disiciplineName: "Sağlık Bilimleri",
    });

    expect(staffDiscipline?.activityRules.length).toBe(1);
  });

  it("Update", async () => {
    let staffDiscipline = await AcademicStaffDisciplineRules.findOne({
      disiciplineName: "Sağlık Bilimleri",
    });

    staffDiscipline?.activityRules.push(
      new AcademicStaffActivityRules({
        expression: "A1-A2",
        positionType: StaffPosition.Lecturer,
        minimumCount: 200,
      }),
    );
    await staffDiscipline?.save();

    staffDiscipline = await AcademicStaffDisciplineRules.findOne({
      disiciplineName: "Sağlık Bilimleri",
    });

    expect(staffDiscipline?.activityRules.length).toBe(2);
  });
});
