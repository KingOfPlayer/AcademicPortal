import { Schema, Model, model } from 'mongoose';
import { IActivity, ActivitySchema } from './activity';

export interface IActivityCategory {
    Code: string,
    sectionName: string,
    isActive: boolean,
    activities: IActivity[],
}

const ActivityCategorySchemaOptions = {
    Code: { type: String, required: true },
    sectionName: { type: String, required: true },
    isActive: { type: Boolean, required: true },
    activities: { type: [ActivitySchema] },
};

interface IActivityCategoryMethods {

}

interface ActivityCategoryModel extends Model<IActivityCategory, {}, IActivityCategoryMethods> {

}

const ActivityCategorySchema = new Schema<IActivityCategory, ActivityCategoryModel, IActivityCategoryMethods>(ActivityCategorySchemaOptions);

export const ActivityCategory = model<IActivityCategory, ActivityCategoryModel>('activity_categories', ActivityCategorySchema);