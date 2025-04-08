import { PointMultiplier } from "./models/point-multiplier";
import { PointTable } from "./models/point-table";
import "./services/database-service"
import { evaluate } from "mathjs"

let result = evaluate('(5 + 10) > 12');
console.log(result);

// PointMultiplier Test
const newPointTable = new PointTable();
newPointTable.pointMultipliers = [
    new PointMultiplier("1","1"),
    new PointMultiplier("2","0.8"),
    new PointMultiplier("3","0.6"),
    new PointMultiplier("4","0.5"),
    new PointMultiplier("5-9","1/people"),
    new PointMultiplier("10","1"),
]
console.log(newPointTable.GetPointMultipler(5));

// Activity Test
/*
import { ActivityCategory } from "./models/activity-category"
import { ActivityCategoryDTO } from "./models/dtos/activity-category-dto"
import { Activity } from "./models/activity"
import { AddActivityCategory, GetActivity, GetActivityCategory, UpdateActivityCategory } from "./services/activity-service";

let testActivityCategory: ActivityCategoryDTO;
testActivityCategory = {
    Code: "A",
    sectionName: "Makaleler",
    activities: [
        new Activity(1, "SCI-E, SSCI veya AHCI kapsamındaki dergilerde yayımlanmış makale (Q1 olarak taranan dergide)", 60),
        new Activity(2, "SCI-E, SSCI veya AHCI kapsamındaki dergilerde yayımlanmış makale (Q2 olarak taranan dergide)", 60),
        new Activity(3, "SCI-E, SSCI veya AHCI kapsamındaki dergilerde yayımlanmış makale (Q3 olarak taranan dergide)", 60),
    ],
    isActive: true
};

(async () => {
    await AddActivityCategory(testActivityCategory);
    console.log(await GetActivityCategory("A"));
    console.log(await GetActivity("A", 1))
    testActivityCategory.activities?.push(new Activity(4, "Test", 60));
    await UpdateActivityCategory(testActivityCategory);
    console.log(await GetActivityCategory("A"));
    console.log(await GetActivity("A", 4))
})()
*/


