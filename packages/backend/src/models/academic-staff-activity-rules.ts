import { SchemaDefinition } from "mongoose";
import { StaffPosition } from "./academic-staff-discipline-rules";

export interface IAcademicStaffActivityRules {
  expression: string;
  positionType: StaffPosition;
  minimumCount: number;
}

export const AcademicStaffActivityRulesOptions: SchemaDefinition<IAcademicStaffActivityRules> =
  {
    expression: { type: String, required: true },
    positionType: { type: String, enum: StaffPosition, required: true },
    minimumCount: { type: Number, required: true },
  };

export class AcademicStaffActivityRules implements IAcademicStaffActivityRules {
  expression: string;
  positionType: StaffPosition;
  minimumCount: number;

  constructor(
    expression: string,
    positionType: StaffPosition,
    minimumCount: number,
  ) {
    this.expression = expression;
    this.positionType = positionType;
    this.minimumCount = minimumCount;
  }
}
