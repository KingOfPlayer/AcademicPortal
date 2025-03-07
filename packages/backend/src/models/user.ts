import { Schema, Model, model } from 'mongoose';

interface IUser {
    id_number: number;
    name: string;
    surname: string;
    age: number;
}

interface IUserMethods {
}

interface UserModel extends Model<IUser, {}, IUserMethods> {
}

export const UserSchema = new Schema<IUser, UserModel, IUserMethods>({
    id_number: { type: Number, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    age: { type: Number, required: true }
});

export const User = model<IUser, UserModel>('users', UserSchema);