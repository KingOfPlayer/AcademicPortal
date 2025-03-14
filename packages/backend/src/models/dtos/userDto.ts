import { IUser } from "../user"

export class UserDTO implements IUser{
    roles?: [string];
    id_number?: number;
    name?: string;
    surname?: string;
    bornYear?: number;
    age?: number;
    email?: string;
    password?: string;
}