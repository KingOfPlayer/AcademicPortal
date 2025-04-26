import { User, UserRoles } from "../models/user";
import { UserDTO } from "../models/dtos/user-dto";

export async function AddUser(userDto: UserDTO) {
  const user = new User(userDto);
  await user.save();
}

export async function GetUser(ID_number?: number): Promise<UserDTO> {
  const user = await User.findOne({ id_number: ID_number });
  const userDto: UserDTO = user as UserDTO;
  return userDto;
}

export async function GetUserRoles(
  ID_number?: number,
): Promise<string[] | undefined> {
  return (await GetUserWithSelectFields(ID_number, ["roles"])).roles;
}

export async function GetUserWithSelectFields(
  ID_number?: number,
  selectedFields:
    | string
    | string[]
    | Record<string, string | number | boolean | object> = {},
) {
  const user = await User.findOne({ id_number: ID_number }).select(
    selectedFields,
  );
  const userDto: UserDTO = user as UserDTO;
  return userDto;
}

export async function UpdateUser(userDto: UserDTO) {
  const user = new User(userDto);
  await User.findOneAndUpdate({ id_number: userDto.id_number }, user);
}

export async function UpdateUserRole(
  id_number: number,
  newUserRoles: UserRoles[],
) {
  await User.findOneAndUpdate(
    { id_number: id_number },
    { $set: { roles: newUserRoles } },
  );
}
