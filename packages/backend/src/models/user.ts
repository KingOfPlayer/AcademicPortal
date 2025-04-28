import { Schema, SchemaDefinition, Types, model } from "mongoose";

//TODO:
// Password Hashing
// bornYear rename bornDate and convert type number to date
// Auto calculate age from bornDate
// Password Restriction

export enum UserRoles {
  Admin = "admin",
  Administrator = "administrator",
  Jury = "jury",
  Applicant = "applicant",
}

export interface IUser {
  _id?: Types.ObjectId;
  roles?: UserRoles[];

  id_number?: number;
  name?: string;
  surname?: string;
  bornYear?: number;

  age?: number;
  email?: string;
  password?: string;
}

const validateEmail = (email: string): boolean => {
  return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,6}$/.test(email); // eslint-disable-line
};

const UserSchemaOptions: SchemaDefinition = {
  roles: { type: [String], enum: Object.values(UserRoles), required: true },

  id_number: {
    type: Number,
    required: true,
    index: { unique: true },
    min: 10000000000,
    max: 99999999999,
  },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  bornYear: { type: Number, required: true },

  age: { type: Number },
  email: { type: String, required: true, validate: validateEmail },
  password: { type: String, required: true },
};

const UserSchema = new Schema<IUser>(UserSchemaOptions);

export const User = model<IUser>("users", UserSchema);
