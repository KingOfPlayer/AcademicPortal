import { SchemaDefinition } from "mongoose"

export interface IAcademicStaffAnnouncementPointRules {
    description: string
    expression: string
    minPoint: number
    maxPoint: number
}

export const AcademicStaffAnnouncementPointRulesSchema: SchemaDefinition<IAcademicStaffAnnouncementPointRules> = {
    description: { type: String, required: true },
    expression: { type: String, required: true },
    minPoint: { type: Number, required: true },
    maxPoint: { type: Number, required: true }
}