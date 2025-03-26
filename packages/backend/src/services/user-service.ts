import { IUser, User, UserRoles } from '../models/user';
import { UserDTO } from '../models/dtos/userDto';

export async function AddUser(userDto: UserDTO){
    const user = new User(userDto);
    await user.save();
}

export async function GetUser(ID_number?:Number):Promise<IUser>{
    const user = await User.findOne({id_number:ID_number});
    const userDto:UserDTO = user as UserDTO;
    return userDto;
}

export async function GetUserRoles(ID_number?:Number):Promise<[string] | undefined>{
    return (await GetUserWithSelectFields(ID_number,["roles"])).roles;
}

export async function GetUserWithSelectFields(ID_number?:Number,selectedFields: string | string[] | Record<string, string | number | boolean | object> = {}){
    const user = await User.findOne({id_number:ID_number}).select(selectedFields);
    const userDto:UserDTO = user as UserDTO;
    return userDto;
}

export async function UpdateUser(userDto: UserDTO){
    const user = new User(userDto);
    await User.findByIdAndUpdate(user.id_number,user);
}