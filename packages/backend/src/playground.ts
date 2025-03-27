import "./services/database-service"
import { ActivityCategory } from "./models/activity-category"
import { ActivityCategoryDTO } from "./models/dtos/activity-category-dto"
import { Activity } from "./models/activity"
import { AddActivityCategory, GetActivityCategory } from "./services/activity-service";

let testActivityCategory:ActivityCategoryDTO;
testActivityCategory = {
    Code:"A",
    sectionName:"Makaleler",
    activities : [
        new Activity(1,"SCI-E, SSCI veya AHCI kapsamındaki dergilerde yayımlanmış makale (Q1 olarak taranan dergide)",60),
        new Activity(2,"SCI-E, SSCI veya AHCI kapsamındaki dergilerde yayımlanmış makale (Q2 olarak taranan dergide)",60),
        new Activity(3,"SCI-E, SSCI veya AHCI kapsamındaki dergilerde yayımlanmış makale (Q3 olarak taranan dergide)",60),
    ],
    isActive : true
};

(async()=>{
    await AddActivityCategory(testActivityCategory);
    console.log(await GetActivityCategory("A"));
})()
