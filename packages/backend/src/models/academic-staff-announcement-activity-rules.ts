import { SchemaDefinition } from "mongoose"

export interface IAcademicStaffAnnouncementActivityRules {
    description: string
    expression: string
    minimumCount: number
} 

export const AcademicStaffAnnouncementActivityRules:SchemaDefinition<IAcademicStaffAnnouncementActivityRules> = {
    description: {type:String,required:true},
    expression: {type:String,required:true},
    minimumCount: {type:Number,required:true},
}