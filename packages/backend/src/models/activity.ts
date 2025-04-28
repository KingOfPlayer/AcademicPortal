import { model, Schema, SchemaDefinition, Types } from "mongoose";

export interface IActivity {
  _id?: Types.ObjectId;
  ID: number;
  description: string;
  point: number;
}

const ActivitySchemaOptions: SchemaDefinition = {
  ID: { type: Number, required: true, index: { unique: true } },
  description: { type: String, required: true },
  point: { type: Number, required: true },
};

export const ActivitySchema = new Schema<IActivity>(ActivitySchemaOptions);

export const Activity = model<IActivity>("Activity", ActivitySchema);
