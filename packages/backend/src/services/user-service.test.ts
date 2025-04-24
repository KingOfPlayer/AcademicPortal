import { describe, it, expect, afterAll } from "vitest";
import { AddUser, GetUser, UpdateUser, UpdateUserRole } from "./user-service";
import { User, UserRoles } from "../models/user";
import { UserDTO } from "../models/dtos/user-dto";

describe("User Service Test", () => {
  afterAll(async () => {
    User.deleteMany();
  });

  it("User Create", async () => {
    const userDto = {} as UserDTO;
    userDto.id_number = 12345678912;
    userDto.name = "Test_Name";
    userDto.surname = "Test_surname";
    userDto.bornYear = 45; //temp
    userDto.age = 60; //temp
    userDto.email = "test@test.com"; //temp
    userDto.password = "123456789"; //temp
    userDto.roles = [UserRoles.Applicant];
    await AddUser(userDto);
  });

  it("User Get", async () => {
    expect((await GetUser(99999999999)) == null).toBe(true);

    const finded_user = await GetUser(12345678912);
    expect(finded_user.name == "Test_Name").toBe(true);
  });

  it("User Update", async () => {
    let finded_user = await GetUser(12345678912);
    finded_user.name = "Changed_test";
    await UpdateUser(finded_user);

    finded_user = await GetUser(12345678912);
    expect(finded_user.name == "Changed_test").toBe(true);
  });

  it("User Update Role", async () => {
    await UpdateUserRole(12345678912, [UserRoles.Admin]);

    const finded_user = await GetUser(12345678912);
    expect(finded_user.roles?.includes(UserRoles.Applicant)).toBe(false);
    expect(finded_user.roles?.includes(UserRoles.Admin)).toBe(true);
  });
});
