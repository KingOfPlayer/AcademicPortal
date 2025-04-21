import { describe, it, expect } from "vitest";
import {
  AcademicStaffDisciplineRules,
  StaffPosition,
} from "./academic-staff-discipline-rules";
import { AcademicStaffActivityRules } from "./academic-staff-activity-rules";
import { AcademicStaffPointRules } from "./academic-staff-point-rules";

describe("Academic Staff Discipline Rule Model", () => {
  it("Create", async () => {
    const staffDiscipline = new AcademicStaffDisciplineRules();
    staffDiscipline.description = "Sağlık Bilimleri";
    staffDiscipline.activityRules = [
      new AcademicStaffActivityRules(
        "A.1-A.2",
        StaffPosition.AssociateProfessor,
        200,
      ),
    ];
    staffDiscipline.pointRules = [
      new AcademicStaffPointRules("A.1-A.4", StaffPosition.Lecturer, 45, 0),
    ];

    await staffDiscipline.save();
  });

  it("Find", async () => {
    const staffDiscipline = await AcademicStaffDisciplineRules.findOne({
      description: "Sağlık Bilimleri",
    });

    expect(staffDiscipline?.activityRules.length).toBe(1);
  });

  it("Update", async () => {
    let staffDiscipline = await AcademicStaffDisciplineRules.findOne({
      description: "Sağlık Bilimleri",
    });

    staffDiscipline?.activityRules.push(
      new AcademicStaffActivityRules("A.1-A.2", StaffPosition.Lecturer, 200),
    );
    await staffDiscipline?.save();

    staffDiscipline = await AcademicStaffDisciplineRules.findOne({
      description: "Sağlık Bilimleri",
    });

    expect(staffDiscipline?.activityRules.length).toBe(2);
  });
});
