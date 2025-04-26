import { model, Schema, SchemaDefinition, SchemaType, SchemaTypes, Types } from "mongoose";
import { DisciplineRuleSchema, IDisciplineRule } from "./discipline-rule";
import { DisciplineActivityRuleSchema } from "./discipline-activity-rule";
import { Appeal } from "./appeal";
import { IUser } from "./user";

export interface IStaffAnnouncement {
    title: string;
    content: string;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
    disciplineRules?: IDisciplineRule[];

    juries: Types.ObjectId[];
}

const StaffAnnouncementSchemaOptions: SchemaDefinition<IStaffAnnouncement> = {
    title: { type: String, required: true },
    content: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    disciplineRules: { type: [DisciplineRuleSchema], required: true},
    juries: [{ type: SchemaTypes.ObjectId, required: true, ref: "users" }],
};

export const StaffAnnouncementSchema = new Schema<IStaffAnnouncement>(
    StaffAnnouncementSchemaOptions
);

StaffAnnouncementSchema.pre("deleteOne", async function (next) {
    await Appeal.deleteMany({ announcement: this.getFilter()._id });
});

export const StaffAnnouncement = model<IStaffAnnouncement>(
    "staff_announcement",
    StaffAnnouncementSchema
);
