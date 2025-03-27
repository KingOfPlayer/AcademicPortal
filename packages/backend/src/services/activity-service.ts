import { Activity } from "../models/activity";
import { IActivityCategory, ActivityCategory } from "../models/activity-category";
import { ActivityCategoryDTO } from "../models/dtos/activity-category-dto";

export async function GetActivityCategory(Code:String):Promise<ActivityCategoryDTO> {
    const activityCategory = await ActivityCategory.findOne({Code:Code});
    const activityCategoryDTO = activityCategory as ActivityCategoryDTO;
    return activityCategoryDTO;
}

export async function GetActivity(Code:String,ID:number):Promise<Activity>{
    const activityCategory = await ActivityCategory.findOne({Code:Code});
    const activity = activityCategory?.activities.find((activity)=>{return activity.ID == ID}) as Activity;
    return activity;
}

export async function AddActivityCategory(activityCategory:ActivityCategoryDTO) {
    const newActivityCategory = new ActivityCategory(activityCategory);
    try{
        await newActivityCategory.save();
    }catch(err){
        console.log(`Already Added Category | Code:${newActivityCategory.Code}`);
    }
}

async function AddActivity(Code:String,ID:Number){

}

async function DeleteActivityCategory(Code:String){
    await ActivityCategory.deleteOne({Code:Code});
}

async function DeleteActivity(Code:String,ID:Number){
    await ActivityCategory.deleteOne({Code:Code});
}

async function UpdateActivityCategory(Code:String){
    
}

async function UpdateActivity(Code:String,ID:Number){

}