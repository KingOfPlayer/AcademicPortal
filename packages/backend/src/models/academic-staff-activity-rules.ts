import { model, Schema, SchemaDefinition } from "mongoose";
import { StaffPosition } from "./academic-staff-discipline-rules";

export interface IAcademicStaffActivityRules {
  expression: string;
  positionType: StaffPosition;
  minimumCount: number;
}

export const AcademicStaffActivityRulesSchemaOptions: SchemaDefinition<IAcademicStaffActivityRules> =
  {
    expression: { type: String, required: true },
    positionType: { type: String, enum: StaffPosition, required: true },
    minimumCount: { type: Number, required: true },
  };

const AcademicStaffActivityRulesSchema = new Schema<IAcademicStaffActivityRules>(AcademicStaffActivityRulesSchemaOptions);

export const AcademicStaffActivityRules = model<IAcademicStaffActivityRules>("academic_staff_activity_rules",AcademicStaffActivityRulesSchema)
