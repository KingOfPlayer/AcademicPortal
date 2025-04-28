import mongoose, { Schema, SchemaDefinition, Types } from "mongoose";

interface IAppealContentActivityType {
  categoryCode: string;
  categoryID: number;
}

export interface IAppealContent {
  _id?: Types.ObjectId;
  content: string;
  contentPath: string;
  createdAt: Date;
  updatedAt: Date;

  activityType: IAppealContentActivityType[];
}

export const IAppealContentSchemaOptions: SchemaDefinition<IAppealContent> = {
  content: { type: String, required: true },
  contentPath: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  activityType: {
    type: [{ categoryCode: String, categoryID: Number }],
    required: true,
  },
};

export const AppealContentSchema = new Schema<IAppealContent>(
  IAppealContentSchemaOptions,
  { autoCreate: false },
);
export const AppealContent = mongoose.model<IAppealContent>(
  "appeal_contents",
  AppealContentSchema,
);
