import { model, Schema, SchemaDefinition, SchemaTypes, Types } from "mongoose";
import { AppealContentSchema, IAppealContent } from "./appeal-content";
import { IStaffAnnouncement } from "./staff-announcement";
import { IUser } from "./user";

export interface IAppeal {
  _id?: Types.ObjectId;
  announcement: Types.ObjectId | IStaffAnnouncement;
  user: Types.ObjectId | IUser;
  appealContents: IAppealContent[];
}

export const AppealSchemaOptions: SchemaDefinition<IAppeal> = {
  announcement: {
    type: SchemaTypes.ObjectId,
    required: true,
    ref: "staff_announcement",
  },
  user: { type: SchemaTypes.ObjectId, required: true, ref: "users" },
  appealContents: { type: [AppealContentSchema], required: true },
};

export const AppealSchema = new Schema<IAppeal>(AppealSchemaOptions, {
  autoCreate: false,
});

AppealSchema.pre("save", async function () {
  const appeal = await Appeal.findOne({
    announcement: this.announcement._id,
    user: this.user._id,
  });
  if (appeal && appeal._id.toString() !== this._id?.toString()) {
    throw new Error("Appeal already exists for this announcement and user");
  }
});

export const Appeal = model<IAppeal>("appeals", AppealSchema);
