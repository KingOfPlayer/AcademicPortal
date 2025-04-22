import { AcademicStaffDisciplineRules, IAcademicStaffDisciplineRules } from "../models/academic-staff-discipline-rules";
import { AcademicStaffDisciplineRulesDTO } from "../models/dtos/academic-staff-discipline-rules-dto";

export const AddDisciplineRule = async (DisciplineRule: AcademicStaffDisciplineRulesDTO) => {
    const disciplineRule = new AcademicStaffDisciplineRules(DisciplineRule);
    await disciplineRule.save();
}

export const UpdateDisciplineRule = async (DisciplineRule: AcademicStaffDisciplineRulesDTO) => {
    let disciplineRule = await AcademicStaffDisciplineRules.findOne({ disiciplineName: DisciplineRule.disiciplineName });

    if(disciplineRule == null) throw new Error("When Discipline rules update, disciplineRules not found");

    disciplineRule.$set(DisciplineRule);
    await disciplineRule.save();
}

export const GetDisciplineRule = async (DisciplineName:String): Promise<AcademicStaffDisciplineRulesDTO|null> => {
    return await AcademicStaffDisciplineRules.findOne({disiciplineName:DisciplineName});
}

export const GetAllDisciplineRules = async (): Promise<AcademicStaffDisciplineRulesDTO[]> => {
    return await AcademicStaffDisciplineRules.find({});
}

