import { describe, it, expect } from "vitest";


import { AcademicStaffDisciplineRules } from "../models/academic-staff-discipline-rules";
import { AcademicStaffActivityRules } from "../models/academic-staff-activity-rules";
import { StaffPosition } from "../models/academic-staff-disicpline-utils";
import { AcademicStaffPointRules } from "../models/academic-staff-point-rules";
import { AcademicStaffDisciplineRulesDTO } from "../models/dtos/academic-staff-discipline-rules-dto";
import { AddDisciplineRule, GetAllDisciplineRules, GetDisciplineRule, UpdateDisciplineRule } from "./disicpline-rule-service";

describe("Disicpline Rule Service Test", () => {
  it("Disicpline Rule Create", async () => {
    const staffDisciplineDTO = new AcademicStaffDisciplineRules({
      disiciplineName: "Test 1",
      activityRules: [
        new AcademicStaffActivityRules({
          expression: "A1-A2",
          positionType: StaffPosition.AssociateProfessor,
          minimumCount: 200,
        }),
      ],
      pointRules: [
        new AcademicStaffPointRules({
          expression: "A1-A4", positionType: StaffPosition.Lecturer, minPoint: 0, maxPoint: 0
        }),
      ]
    }) as AcademicStaffDisciplineRulesDTO;
    await AddDisciplineRule(staffDisciplineDTO);
  });

  it("Disicpline Rule Update", async () => {
    const staffDisciplineDTO = await GetDisciplineRule("Test 1");
    staffDisciplineDTO!.disiciplineName = "asd";
    staffDisciplineDTO!.pointRules!.push(new AcademicStaffPointRules({"expression":"A1",positionType:StaffPosition.Professor, minPoint:0, maxPoint:45}));
    await UpdateDisciplineRule("Test 1",staffDisciplineDTO!);

    await GetDisciplineRule("Test 1");
  });

  it("Disicpline Rule GetAll", async () => {
    const staffDisciplineDTO = new AcademicStaffDisciplineRules({
      disiciplineName: "Test 2",
      activityRules: [
        new AcademicStaffActivityRules({
          expression: "A1-A2",
          positionType: StaffPosition.AssociateProfessor,
          minimumCount: 200,
        }),
      ],
      pointRules: [
        new AcademicStaffPointRules({
          expression: "A1-A4", positionType: StaffPosition.Lecturer, minPoint: 0, maxPoint: 0
        }),
      ]
    }) as AcademicStaffDisciplineRulesDTO;
    await AddDisciplineRule(staffDisciplineDTO);

    const staffDisciplineDTOs = await GetAllDisciplineRules();
    expect(staffDisciplineDTOs.length).toBe(2);
  });
});
