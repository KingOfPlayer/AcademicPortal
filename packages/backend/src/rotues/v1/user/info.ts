import { FastifyInstance } from "fastify";
import { FastifyAuthPlugin } from "../../../plugins/auth-plugin";

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
}
