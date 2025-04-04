import { FastifyInstance } from "fastify";
import { FastifyAuthPlugin } from "../../../plugins/auth-plugin";
import { UserDTO } from "../../../models/dtos/user-dto";

export default async function (fastify: FastifyInstance & FastifyAuthPlugin) {
    //Return user info
    fastify.get("/info", { preHandler: [fastify.authentication()] }, async (request, reply) => {

        return reply.status(200).send((request as any).user as UserDTO);
    });
}