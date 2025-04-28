import { Schema, Model, model, SchemaDefinition } from "mongoose";
import {
  PointMultiplier,
  IPointMultiplier,
  PointMultiplierSchema,
} from "./point-multiplier";

export interface IPointTable {
  pointMultipliers: IPointMultiplier[];
}

const PointTableSchemaOptions: SchemaDefinition = {
  pointMultipliers: { type: [PointMultiplierSchema], required: true },
};

interface PointTableModel extends Model<IPointTable> {
  GetPointMultiplier(PointMultipliers:IPointMultiplier[], PeopleCount: number): number;
}

const PointTableSchema = new Schema<
  IPointTable,
  PointTableModel
>(PointTableSchemaOptions);

PointTableSchema.static("GetPointMultiplier", function (PointMultipliers:IPointMultiplier[], PeopleCount: number) {
  const pointMultiplier = PointMultipliers.find((v: IPointMultiplier) => {
    return PointMultiplier.MatchRange(v, PeopleCount);
  });

  if (pointMultiplier == null) {
    throw new Error("Suitable Multiplier");
  }

  return PointMultiplier.EvaluateMultiplier(pointMultiplier, PeopleCount);
});

export const PointTable = model<IPointTable, PointTableModel>(
  "point_table",
  PointTableSchema,
);
