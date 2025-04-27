import { Types } from "mongoose";
import { StaffAnnouncementDTO } from "../models/dtos/staff-announcement-dto";
import { UserDTO } from "../models/dtos/user-dto";
import { StaffAnnouncement } from "../models/staff-announcement";
import { IUser, User } from "../models/user";
import disicplineRule from "../rotues/v1/disicpline-rule/disicpline-rule";
import { DisciplineRule } from "../models/discipline-rule";
import { D } from "vitest/dist/chunks/reporters.d.CfRkRKN2.js";

export const AddStaffAnnouncement = async (staffAnnouncement: StaffAnnouncementDTO) => {
    const announcement = new StaffAnnouncement(staffAnnouncement);
    await announcement.save();
}

export const GetStaffAnnouncements = async ():Promise<StaffAnnouncementDTO[]> => {
    return await StaffAnnouncement.find({}).sort({ createdAt: -1 });
}

export const GetStaffAnnouncementById = async (id: string):Promise<StaffAnnouncementDTO | null> => {
    const _id = new Types.ObjectId(id);
    return await StaffAnnouncement.findById(_id);
}

export const UpdateStaffAnnouncement = async (id: string, staffAnnouncement: StaffAnnouncementDTO):Promise<StaffAnnouncementDTO | null>  => {
    return await StaffAnnouncement.findByIdAndUpdate(id, staffAnnouncement, { new: true });
}

export const DeleteStaffAnnouncement = async (id: string):Promise<StaffAnnouncementDTO | null>  => {
    return await StaffAnnouncement.findByIdAndDelete(id);
}

export const GetJuriesFromStaffAnnouncement = async (id: string):Promise<UserDTO[]> => {
    const staffAnnouncement = await StaffAnnouncement.findById(id).populate<{juries:IUser[]}>("juries");
    if (!staffAnnouncement) {
        throw new Error("Staff announcement not found");
    }
    return staffAnnouncement.juries;
}

export const GetStaffAnnouncementsByJuryIdNumber = async (id_number: number):Promise<StaffAnnouncementDTO[]> => {
    
    const jury = await User.findOne({ id_number: id_number });
    if (!jury) {
        throw new Error("Jury not found");
    }
    const juryId = jury._id;
    
    const staffAnnouncements = await StaffAnnouncement.find({ juries: juryId }).sort({ createdAt: -1 });
    return staffAnnouncements;
}

export const UpdateDisciplineRulesAtStaffAnnouncement = async (id: string):Promise<StaffAnnouncementDTO | null> => {
    const disciplineRules = await DisciplineRule.find({});
    if (!disciplineRules) {
        throw new Error("Discipline rules not found");
    }
    return await StaffAnnouncement.findByIdAndUpdate(id, { disciplineRules:disciplineRules }, { new: true });
}



