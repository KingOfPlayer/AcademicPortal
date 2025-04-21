import { SchemaDefinition } from "mongoose";

export interface IAcademicStaffAnnouncementActivityRules {
  description: string;
  expression: string;
  minimumCount: number;
}

export const AcademicStaffAnnouncementActivityRulesOptions: SchemaDefinition<IAcademicStaffAnnouncementActivityRules> =
  {
    description: { type: String, required: true },
    expression: { type: String, required: true },
    minimumCount: { type: Number, required: true },
  };

export class AcademicStaffAnnouncementActivityRules
  implements IAcademicStaffAnnouncementActivityRules
{
  description: string;
  expression: string;
  minimumCount: number;

  constructor(description: string, expression: string, minimumCount: number) {
    this.description = description;
    this.expression = expression;
    this.minimumCount = minimumCount;
  }
}
