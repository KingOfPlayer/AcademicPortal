import { Schema, model } from "mongoose";

export enum UserRoles {
  Admin = "admin",
  Administrator = "administrator",
  Jury = "jury",
  Applicant = "applicant",
}

export interface IUser {
  roles?: string[];

  id_number?: number;
  name?: string;
  surname?: string;
  bornYear?: number;

  age?: number;
  email?: string;
  password?: string;
}

const UserSchemaOptions = {
  roles: { type: [String], enum: Object.values(UserRoles), required: true },

  id_number: { type: Number, required: true, index: { unique: true } },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  bornYear: { type: Number, required: true },

  age: { type: Number },
  email: { type: String },
  password: { type: String },
};

const UserSchema = new Schema<IUser>(UserSchemaOptions);

export const User = model<IUser>("users", UserSchema);
