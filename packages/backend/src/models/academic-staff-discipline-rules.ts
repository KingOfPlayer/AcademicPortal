import { model, Schema, SchemaDefinition } from "mongoose";
import {
  AcademicStaffActivityRulesOptions,
  IAcademicStaffActivityRules,
} from "./academic-staff-activity-rules";
import {
  AcademicStaffPointRulesSchemaOptions,
  IAcademicStaffPointRules,
} from "./academic-staff-point-rules";

export enum StaffPosition {
  Lecturer = "Lecturer", // Dr. Öğr. Üyesi
  AssociateProfessor = "AssociateProfessor", // Doçent
  Professor = "AssociateProfessor", // Profesör
}

export interface IAcademicStaffDisciplineRules {
  description: string;
  activityRules: IAcademicStaffActivityRules[];
  pointRules: IAcademicStaffPointRules[];
}

export const AcademicStaffDisciplineRulesOptions: SchemaDefinition<IAcademicStaffDisciplineRules> =
  {
    description: { type: String, required: true },
    activityRules: {
      type: [AcademicStaffActivityRulesOptions],
      required: true,
    },
    pointRules: {
      type: [AcademicStaffPointRulesSchemaOptions],
      required: true,
    },
  };

const AcademicStaffDisciplineRulesSchema =
  new Schema<IAcademicStaffDisciplineRules>(
    AcademicStaffDisciplineRulesOptions,
  );

export const AcademicStaffDisciplineRules =
  model<IAcademicStaffDisciplineRules>(
    "academic_staff_discipline",
    AcademicStaffDisciplineRulesSchema,
  );
