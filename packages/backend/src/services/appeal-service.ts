import { Appeal } from "../models/appeal";
import { IAppealContent } from "../models/appeal-content";
import { AppealDTO } from "../models/dtos/appeal-dto";

export const AddAppeal = async (AppealDto: AppealDTO) => {
    const appeal = new Appeal(AppealDto);
    await appeal.save();
}

export const GetAppeal = async (id: string) => {
    const appeal = await Appeal.findById(id).populate("announcement");
    return appeal;
}

export const GetAppeals = async () => {
    const appeals = await Appeal.find({}).populate("announcement").sort({ createdAt: -1 });
    return appeals;
}

export const UpdateAppeal = async (id: string, appealDto: AppealDTO) => {
    const appeal = await Appeal.findByIdAndUpdate(id, appealDto, { new: true });
    return appeal;
}

export const DeleteAppeal = async (id: string) => {
    const appeal = await Appeal.findByIdAndDelete(id);
    return appeal;
}

export const GetAppealsByUserId = async (userId: string) => {
    const appeals = await Appeal.find({ user: userId }).populate("announcement").sort({ createdAt: -1 });
    return appeals;
}

export const GetAppealsByAnnouncementId = async (announcementId: string) => {
    const appeals = await Appeal.find({ announcement: announcementId }).populate("user").sort({ createdAt: -1 });
    return appeals;
}

export const GetAppealByAnnouncementIdAndUserId = async (announcementId: string, userId: string) => {
    const appeals = await Appeal.findOne({ announcement: announcementId, user: userId }).populate("announcement").sort({ createdAt: -1 });
    return appeals;
} 

export const InsertAppealContent = async (id: string, AppealContent: IAppealContent) => {
    const appeal = await Appeal.findById(id);
    if (!appeal) throw new Error("Appeal not found");
    appeal.appealContents.push(AppealContent);
    await appeal.save();
    return appeal;
}

export const DeleteAppealContent = async (id: string, contentId: string) => {
    const appeal = await Appeal.findById(id);
    if (!appeal) throw new Error("Appeal not found");
    const contentIndex = appeal.appealContents.findIndex((content) => content._id?.toString() === contentId);
    if (contentIndex === -1) throw new Error("Appeal content not found");
    appeal.appealContents.splice(contentIndex, 1);
    await appeal.save();
    return appeal;
}
