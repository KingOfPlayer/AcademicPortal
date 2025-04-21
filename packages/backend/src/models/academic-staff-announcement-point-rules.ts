import { SchemaDefinition } from "mongoose";

export interface IAcademicStaffAnnouncementPointRules {
  description: string;
  expression: string;
  minPoint: number;
  maxPoint: number;
}

export const AcademicStaffAnnouncementPointRulesSchemaOptions: SchemaDefinition<IAcademicStaffAnnouncementPointRules> =
  {
    description: { type: String, required: true },
    expression: { type: String, required: true },
    minPoint: { type: Number, required: true },
    maxPoint: { type: Number, required: true },
  };

export class AcademicStaffAnnouncementPointRules
  implements IAcademicStaffAnnouncementPointRules
{
  description: string;
  expression: string;
  minPoint: number;
  maxPoint: number;

  constructor(
    description: string,
    expression: string,
    minPoint: number,
    maxPoint: number,
  ) {
    this.description = description;
    this.expression = expression;
    this.minPoint = minPoint;
    this.maxPoint = maxPoint;
  }
}
