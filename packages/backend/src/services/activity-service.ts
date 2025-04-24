import { ActivityCategory } from "../models/activity-category";
import { ActivityCategoryDTO } from "../models/dtos/activity-category-dto";
import { ActivityDTO } from "../models/dtos/activity-dto";

export async function GetActivityCategory(
  Code: string,
): Promise<ActivityCategoryDTO> {
  const activityCategory = await ActivityCategory.findOne({ Code: Code });
  const activityCategoryDTO = activityCategory as ActivityCategoryDTO;
  return activityCategoryDTO;
}

export async function GetAllActivityCategory(): Promise<ActivityCategoryDTO[]> {
  const activityCategories = await ActivityCategory.find();
  return activityCategories;
}

export async function GetActivity(
  Code: string,
  ID: number,
): Promise<ActivityDTO> {
  const activityCategory = await ActivityCategory.findOne({ Code: Code });
  const activity = activityCategory?.activities.find((activity) => {
    return activity.ID == ID;
  }) as ActivityDTO;
  return activity;
}

export async function AddActivityCategory(
  activityCategory: ActivityCategoryDTO,
) {
  const newActivityCategory = new ActivityCategory(activityCategory);
  try {
    await newActivityCategory.save();
  } catch {
    console.log(`Already Added Category | Code:${newActivityCategory.Code}`);
  }
}

export async function DeleteActivityCategory(Code: string) {
  await ActivityCategory.deleteOne({ Code: Code });
}

export async function UpdateActivityCategory(
  activityCategory: ActivityCategoryDTO,
) {
  await ActivityCategory.updateOne(
    { Code: activityCategory.Code },
    activityCategory,
  );
}
