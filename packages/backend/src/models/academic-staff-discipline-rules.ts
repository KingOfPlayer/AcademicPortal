import { model, Schema, SchemaDefinition } from "mongoose";
import {
  AcademicStaffActivityRulesSchema,
  IAcademicStaffActivityRules,
} from "./academic-staff-activity-rules";
import {
  AcademicStaffPointRulesSchema,
  IAcademicStaffPointRules,
} from "./academic-staff-point-rules";

export interface IAcademicStaffDisciplineRules {
  disiciplineName: string;
  activityRules: IAcademicStaffActivityRules[];
  pointRules: IAcademicStaffPointRules[];
}

export const AcademicStaffDisciplineRulesOptions: SchemaDefinition<IAcademicStaffDisciplineRules> =
  {
    disiciplineName: { type: String, required: true, unique: true },
    activityRules: {
      type: [AcademicStaffActivityRulesSchema],
      required: true,
    },
    pointRules: {
      type: [AcademicStaffPointRulesSchema],
      required: true,
    },
  };

const AcademicStaffDisciplineRulesSchema =
  new Schema<IAcademicStaffDisciplineRules>(
    AcademicStaffDisciplineRulesOptions,
    { autoCreate: false },
  );

export const AcademicStaffDisciplineRules =
  model<IAcademicStaffDisciplineRules>(
    "academic_staff_discipline",
    AcademicStaffDisciplineRulesSchema,
  );
