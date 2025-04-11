import { Schema, SchemaDefinition, model } from "mongoose";
import { IActivity, ActivitySchema } from "./activity";

export interface IActivityCategory {
  Code: string;
  sectionName: string;
  isActive: boolean;
  activities: IActivity[];
}

const ActivityCategorySchemaOptions: SchemaDefinition = {
  Code: { type: String, required: true },
  sectionName: { type: String, required: true },
  isActive: { type: Boolean, required: true },
  activities: { type: [ActivitySchema] },
};

const ActivityCategorySchema = new Schema<IActivityCategory>(
  ActivityCategorySchemaOptions,
);

export const ActivityCategory = model<IActivityCategory>(
  "activity_categories",
  ActivityCategorySchema,
);
