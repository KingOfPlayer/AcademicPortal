import fp from "fastify-plugin";
import { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { ValidateAccessJWT } from "../services/auth-service";
import { UserDTO } from "../models/dtos/user-dto";

declare module "fastify" {
  interface FastifyRequest {
    User: UserDTO;
  }
}

export interface FastifyAuthPlugin {
  authentication: (
    roles?: [string],
  ) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
}

const AuthenticationPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate("authentication", (options: [string]) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      // Checking token from header
      if (
        request.headers["authorization"] == undefined ||
        request.headers["authorization"].split(" ")[1] == undefined
      )
        return reply.status(401).send();
      // Checking validate JWT and return user
      const user = await ValidateAccessJWT(
        request.headers["authorization"].split(" ")[1],
      );

      if (
        user == undefined ||
        (options != undefined &&
          !user.roles!.every((v: string) => {
            if (options.includes(v)) return true;
          })) ||
        (options == undefined && user.roles!.length <= 0)
      )
        return reply.status(401).send();

      // Insert user to request
      request.User = user;
    };
  });
};

export default fp(AuthenticationPlugin, {
  name: "authentication",
});
