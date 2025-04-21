import { SchemaDefinition } from "mongoose"
import { IAcademicStaffAnnouncementActivityRules } from "./academic-staff-announcement-activity-rules"
import { AcademicStaffAnnouncementPointRulesSchema, IAcademicStaffAnnouncementPointRules } from "./academic-staff-announcement-point-rules"

export interface IAcademicStaffAnnouncement {
    applyEndDate: Date
    resultPublishDate: Date
    title: string
    description: string
    activityRules: IAcademicStaffAnnouncementActivityRules[]
    pointRules: IAcademicStaffAnnouncementPointRules[]
}

export const AcademicStaffAnnouncementSchema: SchemaDefinition<IAcademicStaffAnnouncement> = {
    applyEndDate: {type:Date,required:true},
    resultPublishDate: {type:Date,required:true},
    title: {type:String,required:true},
    description: {type:String,required:true},
    activityRules: {type:[AcademicStaffAnnouncementPointRulesSchema],required:true},
    pointRules: {type:[AcademicStaffAnnouncementPointRulesSchema],required:true}
}