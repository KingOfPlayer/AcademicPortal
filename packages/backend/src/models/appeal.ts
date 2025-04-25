import { model, Schema, SchemaDefinition, SchemaTypes, Types } from "mongoose";
import { AppealContentSchema, IAppealContent, IAppealContentSchemaOptions } from "./appeal-content";

interface IAppeal {
    announcement: Types.ObjectId;
    user: Types.ObjectId;
    appealContents: IAppealContent[];
}

export const AppealSchemaOptions: SchemaDefinition<IAppeal> = {
    announcement: { type: SchemaTypes.ObjectId, required: true , ref: 'staff_announcement'},
    user: { type: SchemaTypes.ObjectId, required: true, ref: 'users'},
    appealContents: { type: [AppealContentSchema], required: true },
};

export const AppealSchema = new Schema<IAppeal>(AppealSchemaOptions, { autoCreate: false });
export const Appeal = model<IAppeal>("appeals", AppealSchema);
