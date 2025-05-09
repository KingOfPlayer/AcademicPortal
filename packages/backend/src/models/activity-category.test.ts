import { describe, it, expect, afterAll } from "vitest";
import { Activity } from "./activity";
import { ActivityCategory } from "./activity-category";

describe("Activity Category", () => {
  afterAll(async () => {
    await ActivityCategory.deleteMany({});
  });

  it("Create", async () => {
    const Category = new ActivityCategory({
      Code: "A",
      sectionName: "Makaleler",
      activities: [
        new Activity({
          ID: 1,
          description:
            "SCI-E, SSCI veya AHCI kapsamındaki dergilerde yayımlanmış makale (Q1 olarak taranan dergide)",
          point: 60,
        }),
        new Activity({
          ID: 2,
          description:
            "SCI-E, SSCI veya AHCI kapsamındaki dergilerde yayımlanmış makale (Q2 olarak taranan dergide)",
          point: 60,
        }),
        new Activity({
          ID: 3,
          description:
            "SCI-E, SSCI veya AHCI kapsamındaki dergilerde yayımlanmış makale (Q3 olarak taranan dergide)",
          point: 60,
        }),
      ],
      isActive: true,
    });
    await Category.save();
  });

  it("Find", async () => {
    const Category = await ActivityCategory.findOne({ Code: "A" });
    expect(Category?.sectionName).toBe("Makaleler");
  });

  it("Update", async () => {
    const Category = await ActivityCategory.findOne({ Code: "A" });
    Category?.activities.push(
      new Activity({ ID: 4, description: "asd", point: 60 }),
    );
    await Category?.save();
  });
});
