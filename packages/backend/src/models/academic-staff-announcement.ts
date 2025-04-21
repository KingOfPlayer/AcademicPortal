import { IAcademicStaffAnnouncementActivityRules } from "./academic-staff-announcement-activity-rules"
import { IAcademicStaffAnnouncementPointRules } from "./academic-staff-announcement-point-rules"

export interface IAcademicStaffAnnouncement {
    applyEndDate:Date
    resultPublishDate:Date
    title:string
    description:string
    activityRules:IAcademicStaffAnnouncementActivityRules[]
    pointRules:IAcademicStaffAnnouncementPointRules[]
} 