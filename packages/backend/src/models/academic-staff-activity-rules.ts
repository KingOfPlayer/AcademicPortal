import { model, Schema, SchemaDefinition } from "mongoose";
import { StaffPosition } from "./academic-staff-disicpline-utils";

export interface IAcademicStaffActivityRules {
  expression: string;
  positionType: StaffPosition;
  minimumCount: number;
}

const ValidateExpressionRange = (range: string) => {
  //Test format (A1-B2) or (B1)
  // For now just a char activity category
  if (!(/^[A-Z]\d+($|-[A-Z]\d+$)/gm.test(range))) {
    throw new Error("Invalid Range");
  }

  //Test same category
  const match_words = range.match(/[A-Z]+/gm);
  if (match_words == null) {
    throw new Error("Not Found Category");
  } else if (match_words.length == 2 && match_words[0] != match_words[1]) {
    throw new Error("Must Be Same Category");
  }

  const match_numbers = range.match(/\d+/gm);

  if (match_numbers == null) {
    throw new Error("Not Found Number of Range");
  }
  //
  if (+match_numbers[0] < 0 || +match_numbers[1] < 0)
    throw new Error("Range not be able to zero or below");

  if (+match_numbers[0] > +match_numbers[1]) {
    throw new Error("Maximum cannot be below the minimum");
  }
};

function ValidateRange(this: IAcademicStaffActivityRules, v: number) {
  if (v <= 0)
    throw new Error("Range not be able to zero or below");
}

export const AcademicStaffActivityRulesSchemaOptions: SchemaDefinition<IAcademicStaffActivityRules> =
{
  expression: { type: String, required: true, validate: ValidateExpressionRange },
  positionType: { type: String, enum: StaffPosition, required: true },
  minimumCount: { type: Number, required: true, validate: ValidateRange },
};

export const AcademicStaffActivityRulesSchema = new Schema<IAcademicStaffActivityRules>(AcademicStaffActivityRulesSchemaOptions, { autoCreate: false });

export const AcademicStaffActivityRules = model<IAcademicStaffActivityRules>("academic_staff_activity_rules", AcademicStaffActivityRulesSchema)
