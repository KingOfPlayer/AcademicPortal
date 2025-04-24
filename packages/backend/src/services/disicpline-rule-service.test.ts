import { describe, it, expect, afterAll } from "vitest";

import { DisciplineRule } from "../models/discipline-rule";
import { DisciplineActivityRule } from "../models/discipline-activity-rule";
import { DisciplinePosition } from "../models/disicpline-utils";
import { DisciplineStaffPointRule } from "../models/discipline-point-rule";
import { DisciplineRuleDTO } from "../models/dtos/academic-staff-discipline-rules-dto";
import {
  AddDisciplineRule,
  GetAllDisciplineRules,
  GetDisciplineRule,
  UpdateDisciplineRule,
} from "./disicpline-rule-service";

describe("Disicpline Rule Service Test", () => {
  afterAll(async () => {
    DisciplineRule.deleteMany();
  });

  it("Disicpline Rule Create", async () => {
    const staffDisciplineDTO = new DisciplineRule({
      disiciplineName: "Test 1",
      activityRules: [
        new DisciplineActivityRule({
          expression: "A1-A2",
          positionType: DisciplinePosition.AssociateProfessor,
          minimumCount: 200,
        }),
      ],
      pointRules: [
        new DisciplineStaffPointRule({
          expression: "A1-A4",
          positionType: DisciplinePosition.Lecturer,
          minPoint: 0,
          maxPoint: 0,
        }),
      ],
    }) as DisciplineRuleDTO;
    await AddDisciplineRule(staffDisciplineDTO);
  });

  it("Disicpline Rule Update", async () => {
    const staffDisciplineDTO = await GetDisciplineRule("Test 1");
    staffDisciplineDTO!.disiciplineName = "asd";
    staffDisciplineDTO!.pointRules!.push(
      new DisciplineStaffPointRule({
        expression: "A1",
        positionType: DisciplinePosition.Professor,
        minPoint: 0,
        maxPoint: 45,
      }),
    );
    await UpdateDisciplineRule("Test 1", staffDisciplineDTO!);

    await GetDisciplineRule("Test 1");
  });

  it("Disicpline Rule GetAll", async () => {
    const staffDisciplineDTO = new DisciplineRule({
      disiciplineName: "Test 2",
      activityRules: [
        new DisciplineActivityRule({
          expression: "A1-A2",
          positionType: DisciplinePosition.AssociateProfessor,
          minimumCount: 200,
        }),
      ],
      pointRules: [
        new DisciplineStaffPointRule({
          expression: "A1-A4",
          positionType: DisciplinePosition.Lecturer,
          minPoint: 0,
          maxPoint: 0,
        }),
      ],
    }) as DisciplineRuleDTO;
    await AddDisciplineRule(staffDisciplineDTO);

    const staffDisciplineDTOs = await GetAllDisciplineRules();
    expect(staffDisciplineDTOs.length).toBe(2);
  });
});
