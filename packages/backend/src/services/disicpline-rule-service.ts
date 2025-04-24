import { DisciplineRule } from "../models/discipline-rules";
import { DisciplineRuleDTO } from "../models/dtos/academic-staff-discipline-rules-dto";

export const AddDisciplineRule = async (disciplineRule: DisciplineRuleDTO) => {
  const rule = new DisciplineRule(disciplineRule);
  await rule.save();
};

export const UpdateDisciplineRule = async (
  disciplineRuleName: string,
  disciplineRule: DisciplineRuleDTO,
) => {
  const rule = await DisciplineRule.findOne({
    disiciplineName: disciplineRuleName,
  });

  if (rule == null)
    throw new Error("When Discipline rules update, disciplineRules not found");

  rule!.$set(disciplineRule);
  await rule!.save();
};

export const GetDisciplineRule = async (
  disciplineName: string,
): Promise<DisciplineRuleDTO | null> => {
  return await DisciplineRule.findOne({
    disiciplineName: disciplineName,
  });
};

export const GetAllDisciplineRules = async (): Promise<DisciplineRuleDTO[]> => {
  return await DisciplineRule.find();
};
