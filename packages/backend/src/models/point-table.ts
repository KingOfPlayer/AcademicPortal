import { Schema, Model, model, SchemaDefinition } from "mongoose";
import { PointMultiplier, PointMultiplierSchema } from "./point-multiplier";

export interface IPointTable {
  pointMultipliers: PointMultiplier[];
}

const PointTableSchemaOptions: SchemaDefinition = {
  pointMultipliers: { type: [PointMultiplierSchema], required: true },
};

interface IPointTableMethods {
  GetPointMultiplier(PeopleCount: number): number;
}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type PointTableModel = Model<IPointTable, {}, IPointTableMethods>;

const PointTableSchema = new Schema<
  IPointTable,
  PointTableModel,
  IPointTableMethods
>(PointTableSchemaOptions);

PointTableSchema.method("GetPointMultiplier", function (PeopleCount: number) {
  const pointMultiplier = this.pointMultipliers.find((v: PointMultiplier) => {
    return v.MatchRange(PeopleCount);
  });

  if (pointMultiplier == null) {
    throw new Error("Suitable Multiplier");
  }

  return pointMultiplier.EvaluateMultiplier(PeopleCount);
});

export const PointTable = model<IPointTable, PointTableModel>(
  "point_table",
  PointTableSchema,
);
