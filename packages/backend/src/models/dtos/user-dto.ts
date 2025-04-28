import { Types } from "mongoose";
import { IUser } from "../user";

export type UserDTO = Partial<IUser> & { _id?: Types.ObjectId };
