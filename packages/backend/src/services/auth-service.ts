import { Token } from "../models/token";
import { IUser } from "../models/user";
import { GetUser, GetUserWithSelectFields } from "./user-service";
import jsonwebtoken from "jsonwebtoken";

import dotenv from "dotenv";
import { UserDTO } from "../models/dtos/user-dto";
import { StringValue } from "ms";
dotenv.config();

export async function GenerateRefleshJWT(user: IUser) {
  const userData = await GetUserWithSelectFields(user.id_number, ["id_number"]);
  const userToken = jsonwebtoken.sign(
    {
      id_number: userData.id_number,
    },
    String(process.env.JWT_SECRET),
    { expiresIn: process.env.JWT_REFLESH_TIMEOUT as StringValue },
  );
  const token = new Token({ token: userToken });
  token.save();
  return userToken;
}

export async function ValidateRefleshJWT(
  jwtToken: string,
): Promise<UserDTO | undefined> {
  if ((await Token.findOne({ token: jwtToken })) != undefined) {
    const decodedToken = jsonwebtoken.verify(
      jwtToken,
      String(process.env.JWT_SECRET),
    ) as UserDTO;
    const user = await GetUser(decodedToken.id_number);
    return user;
  }
}

export async function DeleteRefleshJWT(jwtToken: string) {
  await Token.deleteOne({ token: jwtToken });
}

export async function GenerateAccessJWT(user: UserDTO) {
  const userData = await GetUserWithSelectFields(user.id_number, [
    "id_number",
    "name",
    "surname",
  ]);
  const userToken = jsonwebtoken.sign(
    {
      id_number: userData.id_number,
      name: userData.name,
      surname: userData.surname,
    },
    String(process.env.JWT_SECRET),
    { expiresIn: process.env.JWT_ACCESS_TIMEOUT as StringValue },
  );
  return userToken;
}

export async function ValidateAccessJWT(
  jwtToken: string,
): Promise<UserDTO | undefined> {
  let user: UserDTO | undefined;
  try {
    const decodedToken = jsonwebtoken.verify(
      jwtToken,
      String(process.env.JWT_SECRET),
    ) as UserDTO;
    user = (await GetUser(decodedToken.id_number)) as UserDTO;
  } catch {
    return;
  }
  return user;
}
