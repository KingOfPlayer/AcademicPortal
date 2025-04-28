import { FastifyInstance } from "fastify";
import { IUser, UserRoles } from "../../../models/user";
import { ValidateUserOnEgov } from "../../../services/egov-service";
import { UserDTO } from "../../../models/dtos/user-dto";
import { AddUser } from "../../../services/user-service";

export default async function (fastify: FastifyInstance) {
  //Singup
  fastify.post<{ Body: IUser; reply: IUser }>(
    "/singup",
    async (request, reply) => {
      try {
        // Receive user information from body
        const User = request.body as UserDTO;
        // Validate basic user information
        const validation = await ValidateUserOnEgov(User);
        if (validation) {
          User.roles = [UserRoles.Applicant]; // Default applicant for now
          await AddUser(User); // Save user
        } else {
          return reply.status(401).send();
        }
      } catch {
        return reply.status(401).send();
      }
    },
  );
}
