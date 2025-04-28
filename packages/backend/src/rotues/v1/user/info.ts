import { FastifyInstance } from "fastify";
import { FastifyAuthPlugin } from "../../../plugins/auth-plugin";
import { UserRoles } from "../../../models/user";

export default async function (
  fastify: FastifyInstance & FastifyAuthPlugin,
): Promise<void> {
  //Return user info
  fastify.get(
    "/info",
    { preHandler: [fastify.authentication()] },
    async (request, reply) => {
      return reply.status(200).send(request.User);
    },
  );

  fastify.post(
    "/update",
    { preHandler: [fastify.authentication([UserRoles.Admin])] },
    async (request, reply) => {
      return reply.status(200).send(request.User);
    },
  );
}
