import { FastifyInstance } from "fastify";
import { FastifyAuthPlugin } from "../../../plugins/auth-plugin";
import { GetPointTable } from "../../../services/point-service";

export default async function (fastify: FastifyInstance & FastifyAuthPlugin) {
  //Return user info
  fastify.get("/multipliers", {}, async (request, reply) => {
    const pointMultipliers = await GetPointTable().then((pointTable) => {
      return pointTable?.pointMultipliers;
    });
    return reply.status(200).send(pointMultipliers);
  });
}
