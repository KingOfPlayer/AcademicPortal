import { SchemaDefinition, model, Schema, Types } from "mongoose";
import { DisciplinePosition } from "./disicpline-utils";

export interface IDisciplinePointRule {
  _id?: Types.ObjectId;
  expression: string;
  positionType: DisciplinePosition;
  minPoint: number;
  maxPoint: number;
}

const ValidateExpressionRange = (range: string) => {
  //Test format (A1-B2) or (B1)
  // For now just a char activity category
  if (!/^[A-Z]\d+($|-[A-Z]\d+$)/gm.test(range)) {
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

function ValidateRange(this: IDisciplinePointRule, v: number) {
  if (v < 0)
    // can 0
    throw new Error("Range not be able to zero or below");
  if (this.minPoint > this.maxPoint)
    throw new Error("Maximum point cannot be able to under minimum point");
}

export const DisciplinePointRuleSchemaOptions: SchemaDefinition<IDisciplinePointRule> =
  {
    expression: {
      type: String,
      required: true,
      validate: ValidateExpressionRange,
    },
    positionType: { type: String, enum: DisciplinePosition, required: true },
    minPoint: {
      type: Number,
      required: true,
      validate: ValidateRange,
    },
    maxPoint: {
      type: Number,
      required: true,
      validate: ValidateRange,
    },
  };

export const DisciplinePointRuleSchema = new Schema<IDisciplinePointRule>(
  DisciplinePointRuleSchemaOptions,
  {
    autoCreate: false,
  },
);

export const DisciplinePointRule = model<IDisciplinePointRule>(
  "academic_staff_point_rules",
  DisciplinePointRuleSchema,
);
