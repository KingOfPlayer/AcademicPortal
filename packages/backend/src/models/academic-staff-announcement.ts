import { model, Schema, SchemaDefinition } from "mongoose";
import {
  AcademicStaffAnnouncementActivityRulesOptions,
  IAcademicStaffAnnouncementActivityRules,
} from "./academic-staff-announcement-activity-rules";
import {
  AcademicStaffAnnouncementPointRulesSchemaOptions,
  IAcademicStaffAnnouncementPointRules,
} from "./academic-staff-announcement-point-rules";

export interface IAcademicStaffAnnouncement {
  applyEndDate: Date;
  resultPublishDate: Date;
  title: string;
  description: string;
  activityRules: IAcademicStaffAnnouncementActivityRules[];
  pointRules: IAcademicStaffAnnouncementPointRules[];
}

export const AcademicStaffAnnouncementOptions: SchemaDefinition<IAcademicStaffAnnouncement> =
  {
    applyEndDate: { type: Date, required: true },
    resultPublishDate: { type: Date, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    activityRules: {
      type: [AcademicStaffAnnouncementActivityRulesOptions],
      required: true,
    },
    pointRules: {
      type: [AcademicStaffAnnouncementPointRulesSchemaOptions],
      required: true,
    },
  };

const AcademicStaffAnnouncementSchema = new Schema<IAcademicStaffAnnouncement>(
  AcademicStaffAnnouncementOptions,
);

export const AcademicStaffAnnouncement = model<IAcademicStaffAnnouncement>(
  "academic_staff_announcement",
  AcademicStaffAnnouncementSchema,
);
