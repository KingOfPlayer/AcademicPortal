import { DisciplineRule } from "../models/discipline-rule";
import { DisciplineRuleDTO } from "../models/dtos/academic-staff-discipline-rules-dto";

export const AddDisciplineRule = async (disciplineRule: DisciplineRuleDTO) => {
  const rule = new DisciplineRule(disciplineRule);
  await rule.save();
};

export const UpdateDisciplineRule = async (
  disciplineRuleName: string,
  disciplineRule: DisciplineRuleDTO,
) => {
  await DisciplineRule.findOneAndUpdate(
    { disiciplineName: disciplineRuleName },
    { $set: disciplineRule },
    { new: true },
  );
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
