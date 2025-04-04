import { FastifyInstance } from "fastify";
import { IToken } from "../../../models/token";
import { GenerateAccessJWT, ValidateRefleshJWT } from "../../../services/auth-service";

export default async function (fastify: FastifyInstance) {
    // Access Token
    fastify.post<{ Body: IToken }>("/token", async (request, reply) => {
        // Check token from body
        if (request.body.token == undefined)
            return reply.status(400).send();
        // Checking validate reflesh token JWT and return user 
        const user = await ValidateRefleshJWT(request.body.token);
        if (user != undefined) {
            // Generate access token and reply
            const accessToken = await GenerateAccessJWT(user) as IToken;
            return reply.status(200).send(accessToken);
        }
        return reply.status(400).send();
    });
}