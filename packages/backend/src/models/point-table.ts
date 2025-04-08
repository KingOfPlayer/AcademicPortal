
import { Schema, Model, model } from 'mongoose';
import { PointMultiplier, PointMultiplierSchema } from './point-multiplier';
import { evaluate } from 'mathjs';

export interface IPointTable {
    pointMultipliers: PointMultiplier[];
}

const PointTableSchemaOptions = {
    pointMultipliers: { type: [PointMultiplierSchema], required: true },
};

interface IPointTableMethods {
    GetPointMultipler(PeopleCount: number): number;
}

type PointTableModel = Model<IPointTable, {}, IPointTableMethods>;

const PointTableSchema = new Schema<IPointTable, PointTableModel, IPointTableMethods>(PointTableSchemaOptions);

PointTableSchema.method("GetPointMultipler", function GetPointMultipler(PeopleCount: number) {
    const pointMultiplier = this.pointMultipliers.find((v: PointMultiplier, i: number) => {
        return v.MatchRange(PeopleCount);
    });
    
    if(pointMultiplier == null){
        throw new Error("Suitable Multiplier")
    }

    return pointMultiplier.EvaluateMultiplier(PeopleCount);;
});

export const PointTable = model<IPointTable, PointTableModel>('point_table', PointTableSchema);