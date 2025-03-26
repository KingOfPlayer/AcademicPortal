import { Schema, Model, model } from 'mongoose';

export enum UserRoles {
    Admin = 'admin',
    Administrator = 'administrator',
    Jury = 'jury',
    Applicant = 'applicant'
  }

export interface IUser{
    roles?: [string];

    id_number?: number;
    name?: string;
    surname?: string;
    bornYear?: number;

    age?: number;
    email?: string;
    password?: string;
}

const UserSchemaOptions = {
    roles:{ type: [String], enum: Object.values(UserRoles), required: true },

    id_number: { type: Number, required: true , index:{unique:true}},
    name: { type: String, required: true },
    surname: { type: String, required: true },
    bornYear: { type: Number, required: true },

    age: { type: Number },
    email: { type: String },
    password: { type: String }
};

interface IUserMethods {

}

interface UserModel extends Model<IUser, {}, IUserMethods> {

}

const UserSchema = new Schema<IUser, UserModel, IUserMethods>(UserSchemaOptions);

export const User = model<IUser, UserModel>('users', UserSchema);