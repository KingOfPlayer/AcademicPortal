import { DisciplineRule } from "../models/discipline-rules";
import { DisciplineRuleDTO } from "../models/dtos/academic-staff-discipline-rules-dto";

export const AddDisciplineRule = async (
  DisciplineRule: DisciplineRuleDTO,
) => {
  const disciplineRule = new DisciplineRule(DisciplineRule);
  await disciplineRule.save();
};

export const UpdateDisciplineRule = async (
  DisciplineRuleName: string,
  DisciplineRule: DisciplineRuleDTO,
) => {
  const disciplineRule = await DisciplineRule.findOne({
    disiciplineName: DisciplineRuleName,
  });

  if (disciplineRule == null)
    throw new Error("When Discipline rules update, disciplineRules not found");

  disciplineRule!.$set(DisciplineRule);
  await disciplineRule!.save();
};

export const GetDisciplineRule = async (
  DisciplineName: string,
): Promise<DisciplineRuleDTO | null> => {
  return await DisciplineRule.findOne({
    disiciplineName: DisciplineName,
  });
};

export const GetAllDisciplineRules = async (): Promise<
  DisciplineRuleDTO[]
> => {
  return await DisciplineRule.find({});
};
