import { FastifyInstance } from "fastify";
import { FastifyAuthPlugin } from "../../../plugins/auth-plugin";
import { UserRoles } from "../../../models/user";
import { UserDTO } from "../../../models/dtos/user-dto";
import { UpdateUserRole } from "../../../services/user-service";

const subEndpoint = "/update/";

export default async function (
  fastify: FastifyInstance & FastifyAuthPlugin,
): Promise<void> {
  //Change Role
  fastify.post<{ Body: UserDTO }>(
    subEndpoint + "role",
    {
      preHandler: [
        fastify.authentication([UserRoles.Admin, UserRoles.Administrator]),
      ],
    },
    async (request, reply) => {
      try {
        await UpdateUserRole(
          request.body.id_number!,
          request.body.roles! as UserRoles[],
        );
      } catch {
        return reply.status(500).send();
      }
      return reply.status(200).send();
    },
  );
}
