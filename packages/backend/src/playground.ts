import "./services/database-service";

//DisciplineRules service Test

// import { AcademicStaffActivityRules } from "./models/academic-staff-activity-rules";
// import { AcademicStaffDisciplineRules } from "./models/academic-staff-discipline-rules";
// import { StaffPosition } from "./models/academic-staff-disicpline-utils";
// import { AcademicStaffPointRules } from "./models/academic-staff-point-rules";
// import { AcademicStaffDisciplineRulesDTO } from "./models/dtos/academic-staff-discipline-rules-dto";
// import { AddDisciplineRule, GetAllDisciplineRule, GetDisciplineRule, UpdateDisciplineRule } from "./services/disicpline-rule-service";

// (async () => {
//     let staffDisciplineDTO = new AcademicStaffDisciplineRules({
//                 disiciplineName: "Sağlık Bilimleri 2",
//                 activityRules: [
//                     new AcademicStaffActivityRules({
//                         expression: "A1-A2",
//                         positionType: StaffPosition.AssociateProfessor,
//                         minimumCount: 200,
//                     }),
//                 ],
//                 pointRules: [
//                     new AcademicStaffPointRules({
//                         expression: "A1-A4", positionType: StaffPosition.Lecturer, minPoint: 0, maxPoint: 0
//                     }),
//                 ]
//             }) as AcademicStaffDisciplineRulesDTO;
//     try{
//         await AddDisciplineRule(staffDisciplineDTO);
//     }catch{
//         console.log("already insertted");
//     }

//     console.log(await GetAllDisciplineRule());
// })()

//AcademicStaffDisciplineRules Model Test
// import { AcademicStaffActivityRules } from "./models/academic-staff-activity-rules";
// import { AcademicStaffDisciplineRules } from "./models/academic-staff-discipline-rules";
// import { AcademicStaffPointRules } from "./models/academic-staff-point-rules";
// import { StaffPosition } from "./models/academic-staff-disicpline-utils";

// (async () => {
//     const staffDiscipline = new AcademicStaffDisciplineRules({
//         description: "Sağlık Bilimleri",
//         activityRules: [
//             new AcademicStaffActivityRules({
//                 expression: "A1-A2",
//                 positionType: StaffPosition.AssociateProfessor,
//                 minimumCount: 200,
//             }),
//         ],
//         pointRules: [
//             new AcademicStaffPointRules({
//                 expression: "A1-A4", positionType: StaffPosition.Lecturer, minPoint: 0, maxPoint: 0
//             }),
//         ]
//     });

//     await staffDiscipline.save();

//     console.log(await AcademicStaffActivityRules.findOne());
// })();

// import { UserDTO } from "./models/dtos/user-dto";
// import { UserRoles } from "./models/user";
// import {
//   AddUser,
//   GetUser,
//   UpdateUser,
//   UpdateUserRole,
// } from "./services/user-service";
// User Service Test
// (async () => {
//   const userDto = {} as UserDTO;
//   userDto.id_number = 12345678912;
//   userDto.name = "Test_Name";
//   userDto.surname = "Test_surname";
//   userDto.bornYear = 45; //temp
//   userDto.age = 60; //temp
//   userDto.email = "test@test.com"; //temp
//   userDto.password = "123456789"; //temp
//   userDto.roles = [UserRoles.Applicant];
//   await AddUser(userDto);

//   let finded_user = await GetUser(12345678912);
//   console.log(finded_user);

//   finded_user.name = "Changed_test";
//   await UpdateUser(finded_user);

//   finded_user = await GetUser(12345678912);
//   console.log(finded_user);

//   await UpdateUserRole(12345678912, [UserRoles.Admin]);
//   finded_user = await GetUser(12345678912);
//   console.log(finded_user);
// })();

// PointMultiplier Test
// import { PointTableDTO } from "./models/dtos/point-table-dto";
// import { PointMultiplier } from "./models/point-multiplier";
// import "./services/database-service";
// import {
//   GetPointMultiplier,
//   GetPointTable,
//   UpdatePointTable,
// } from "./services/point-service";
// (async () => {
//   const newPointTable: PointTableDTO = {};
//   newPointTable.pointMultipliers = [
//     new PointMultiplier("1", "1"),
//     new PointMultiplier("2", "0.8"),
//     new PointMultiplier("3", "0.6"),
//     new PointMultiplier("4", "0.5"),
//     new PointMultiplier("5-9", "1/people"),
//     new PointMultiplier("10", "1"),
//   ];
//   await UpdatePointTable(newPointTable);
//   const pointTable = await GetPointTable();
//   console.log(pointTable);
//   console.log(await GetPointMultiplier(5));
// })();

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
