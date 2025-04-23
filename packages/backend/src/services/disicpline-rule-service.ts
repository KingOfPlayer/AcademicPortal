import { AcademicStaffDisciplineRules } from "../models/academic-staff-discipline-rules";
import { AcademicStaffDisciplineRulesDTO } from "../models/dtos/academic-staff-discipline-rules-dto";

export const AddDisciplineRule = async (
  DisciplineRule: AcademicStaffDisciplineRulesDTO,
) => {
  const disciplineRule = new AcademicStaffDisciplineRules(DisciplineRule);
  await disciplineRule.save();
};

export const UpdateDisciplineRule = async (
  DisciplineRuleName: string,
  DisciplineRule: AcademicStaffDisciplineRulesDTO,
) => {
  const disciplineRule = await AcademicStaffDisciplineRules.findOne({
    disiciplineName: DisciplineRuleName,
  });

  if (disciplineRule == null)
    throw new Error("When Discipline rules update, disciplineRules not found");

  disciplineRule!.$set(DisciplineRule);
  await disciplineRule!.save();
};

export const GetDisciplineRule = async (
  DisciplineName: string,
): Promise<AcademicStaffDisciplineRulesDTO | null> => {
  return await AcademicStaffDisciplineRules.findOne({
    disiciplineName: DisciplineName,
  });
};

export const GetAllDisciplineRules = async (): Promise<
  AcademicStaffDisciplineRulesDTO[]
> => {
  return await AcademicStaffDisciplineRules.find({});
};
