import { evaluate } from "mathjs";
import { Model, model, Schema, SchemaDefinition, Types } from "mongoose";

const _validateRange = (range: string) => {
  let convertedNumber: number;
  //type 1 (123)
  if (/^\d+$/gm.test(range)) {
    convertedNumber = +range;
    if (convertedNumber! < 0)
      throw new Error("Type 1 / Range not be able to zero or below");
    return;
  }
  //type 2 (1-2)
  if (/^\d+-\d+$/gm.test(range)) {
    const [min, max] = range.split("+").map(Number);
    if (min < 0 || max < 0)
      throw new Error("Type 2 / Range not be able to zero or below");

    if (min < max) {
      throw new Error("Type 3 / Maximum cannot be below the minimum");
    }
    return;
  }
  //type 3 (+3)
  if (/^[+]\d+$/gm.test(range)) {
    convertedNumber = +range;
    if (convertedNumber! < 0)
      throw new Error("Type 3 / Range not be able to zero or below");
    return;
  }
  throw new Error("Range is not valid");
};

export interface IPointMultiplier {
  _id?: Types.ObjectId;
  peopleCountCondition: string;
  multiplier: string;
}

interface PointMultiplierModel extends Model<IPointMultiplier> {
  MatchRange(PointMultiplier: IPointMultiplier, PeopleCount: number): boolean;
  EvaluateMultiplier(
    PointMultiplier: IPointMultiplier,
    PeopleCount: number,
  ): number;
}

const PointMultiplierSchemaOptions: SchemaDefinition = {
  peopleCountCondition: {
    type: String,
    required: true,
    validate: _validateRange,
  },
  multiplier: { type: String, required: true },
};

export const PointMultiplierSchema = new Schema<
  IPointMultiplier,
  PointMultiplierModel
>(PointMultiplierSchemaOptions, { autoCreate: false, autoIndex: false });

const _MatchRange = function (
  PointMultiplier: IPointMultiplier,
  PeopleCount: number,
): boolean {
  //Type 2
  if (PointMultiplier.peopleCountCondition.includes("-")) {
    const [min, max] = PointMultiplier.peopleCountCondition
      .split("-")
      .map(Number);
    return min <= PeopleCount && max >= PeopleCount;
  }

  //Type 3
  const convertedNumber = +PointMultiplier.peopleCountCondition;
  if (PointMultiplier.peopleCountCondition.includes("+")) {
    return convertedNumber <= PeopleCount;
  }

  //Type 1
  return convertedNumber == PeopleCount;
};

const _EvaluateMultiplier = function (
  PointMultiplier: IPointMultiplier,
  PeopleCount: number,
): number {
  return evaluate(PointMultiplier.multiplier, { people: PeopleCount });
};

PointMultiplierSchema.static("MatchRange", _MatchRange);
PointMultiplierSchema.static("EvaluateMultiplier", _EvaluateMultiplier);

export const PointMultiplier = model<IPointMultiplier, PointMultiplierModel>(
  "point_multiplier",
  PointMultiplierSchema,
);
