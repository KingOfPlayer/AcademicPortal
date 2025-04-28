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

interface IPointTableMethods {
  GetPointMultiplier(PeopleCount: number): number;
}

type PointTableModel = Model<IPointTable, {}, IPointTableMethods>;

const PointTableSchema = new Schema<
  IPointTable,
  PointTableModel,
  IPointTableMethods
>(PointTableSchemaOptions);

PointTableSchema.method("GetPointMultiplier", function (PeopleCount: number) {
  const pointMultiplier = this.pointMultipliers.find((v: IPointMultiplier) => {
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
