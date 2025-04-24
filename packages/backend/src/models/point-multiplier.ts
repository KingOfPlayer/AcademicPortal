import { evaluate } from "mathjs";
import { Model, model, Schema, SchemaDefinition } from "mongoose";

type PeopleCountRange = string & { __brand: typeof _validateRange };

const _validateRange = (range: string): string => {
  let convertedNumber: number;
  //type 1 (123)
  if (/^\d+$/gm.test(range)) {
    convertedNumber = +range;
    if (convertedNumber! < 0)
      throw new Error("Type 1 / Range not be able to zero or below");
    return range;
  }
  //type 2 (1-2)
  if (/^\d+-\d+$/gm.test(range)) {
    const [min, max] = range.split("+").map(Number);
    if (min < 0 || max < 0)
      throw new Error("Type 2 / Range not be able to zero or below");

    if (min < max) {
      throw new Error("Type 3 / Maximum cannot be below the minimum");
    }
    return range;
  }
  //type 3 (+3)
  if (/^\d+$/gm.test(range)) {
    convertedNumber = +range;
    if (convertedNumber! < 0)
      throw new Error("Type 3 / Range not be able to zero or below");
    return range;
  }
  throw new Error("Range is not valid");
};

export interface IPointMultiplier {
  peopleCountCondition: PeopleCountRange;
  multiplier: string;
}

interface IPointTableMethods {
  MatchRange(PeopleCount: number): boolean;
  EvaluateMultiplier(PeopleCount: number): number;
}

type PointMultiplierModel = Model<IPointMultiplier, "", IPointTableMethods>;

const PointMultiplierSchemaOptions: SchemaDefinition = {
  peopleCountCondition: { type: String, required: true },
  multiplier: { type: String, required: true },
};

export const PointMultiplierSchema = new Schema<
  IPointMultiplier,
  "",
  IPointTableMethods
>(PointMultiplierSchemaOptions, { autoCreate: false, autoIndex: false });

const _MatchRange = function (
  this: IPointMultiplier,
  PeopleCount: number,
): boolean {
  //Type 2
  if (this.peopleCountCondition.includes("-")) {
    const [min, max] = this.peopleCountCondition.split("-").map(Number);
    return min <= PeopleCount && max >= PeopleCount;
  }

  //Type 3
  const convertedNumber = +this.peopleCountCondition;
  if (this.peopleCountCondition.includes("+")) {
    return convertedNumber <= PeopleCount;
  }

  //Type 1
  return convertedNumber == PeopleCount;
};

const _EvaluateMultiplier = function (
  this: IPointMultiplier,
  PeopleCount: number,
): number {
  return evaluate(this.multiplier, { people: PeopleCount });
};

PointMultiplierSchema.method("MatchRange", _MatchRange);
PointMultiplierSchema.method("EvaluateMultiplier", _EvaluateMultiplier);

export const PointMultiplier = model<IPointMultiplier, PointMultiplierModel>(
  "point_multiplier",
  PointMultiplierSchema,
);
