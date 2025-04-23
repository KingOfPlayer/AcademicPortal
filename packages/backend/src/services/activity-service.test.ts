import { describe, it, expect } from "vitest";
import { ActivityCategory } from "../models/activity-category";
import { Activity } from "../models/activity";
import { ActivityCategoryDTO } from "../models/dtos/activity-category-dto";
import { AddActivityCategory, DeleteActivityCategory, GetActivity, GetActivityCategory, GetAllActivityCategory, UpdateActivityCategory } from "./activity-service";

describe("ActivityCategory Service Test", () => {
  it("AddActivityCategory", async () => {
    const Category = new ActivityCategory({
          Code: "A",
          sectionName: "Makaleler",
          activities: [
            new Activity({ID:1, description:"SCI-E, SSCI veya AHCI kapsamındaki dergilerde yayımlanmış makale (Q1 olarak taranan dergide)", point:60}),
            new Activity({ID:2, description:"SCI-E, SSCI veya AHCI kapsamındaki dergilerde yayımlanmış makale (Q2 olarak taranan dergide)", point:60}),
            new Activity({ID:3, description:"SCI-E, SSCI veya AHCI kapsamındaki dergilerde yayımlanmış makale (Q3 olarak taranan dergide)", point:60}),
          ],
          isActive: true
        }) as ActivityCategoryDTO;

    await AddActivityCategory(Category);
  });

  it("GetActivityCategory", async () => {
    const Category = await GetActivityCategory("A");
    expect(Category!.sectionName).toBe("Makaleler");
  });

  it("GetActivity", async () => {
    const Category = await GetActivity("A",1);
    expect(Category.point).toBe(60);
  });

  it("GetAllActivityCategory", async () => {
    const Categories = await GetAllActivityCategory();
    expect(Categories.length).toBe(1);
  });

  it("UpdateActivityCategory", async () => {
    let Category = await GetActivityCategory("A");
    Category.sectionName = "Makaleler 2";
    await UpdateActivityCategory(Category);
    Category = await GetActivityCategory("A");
    expect(Category.sectionName).toBe("Makaleler 2");
  });

  it("DeleteActivityCategory", async () => {
    await DeleteActivityCategory("A");
    const Categories = await GetAllActivityCategory();
    expect(Categories.length).toBe(0);
  });
});
