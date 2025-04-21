import { SchemaDefinition } from "mongoose";
import { StaffPosition } from "./academic-staff-discipline-rules";

export interface IAcademicStaffPointRules {
  expression: string;
  positionType: StaffPosition;
  minPoint: number;
  maxPoint: number;
}

export const AcademicStaffPointRulesSchemaOptions: SchemaDefinition<IAcademicStaffPointRules> =
  {
    expression: { type: String, required: true },
    positionType: { type: String, enum: StaffPosition, required: true },
    minPoint: { type: Number, required: true },
    maxPoint: { type: Number, required: true },
  };

export class AcademicStaffPointRules implements IAcademicStaffPointRules {
  expression: string;
  positionType: StaffPosition;
  minPoint: number;
  maxPoint: number;

  constructor(
    expression: string,
    positionType: StaffPosition,
    minPoint: number,
    maxPoint: number,
  ) {
    this.expression = expression;
    this.positionType = positionType;
    this.minPoint = minPoint;
    this.maxPoint = maxPoint;
  }
}
