import fp from 'fastify-plugin';
import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import { ValidateAccessJWT } from '../services/auth-service';
import { IUser } from '../models/user';

interface AuthenticationPluginOptions {

}

export interface FastifyAuthPlugin {
     authentication:(roles?:[string])=>(request:any, reply:any)=>Promise<void>;
} 

const AuthenticationPlugin: FastifyPluginAsync<AuthenticationPluginOptions> = async (fastify, options) =>{
    fastify.decorate("authentication",(options:[string])=>{return async (request:FastifyRequest, reply:FastifyReply) =>{
        // Checking token from header
        if(request.headers["authorization"] == undefined || request.headers["authorization"].split(" ")[1] == undefined)
            return reply.status(401).send();
        // Checking validate JWT and return user 
        const user = await ValidateAccessJWT(request.headers["authorization"].split(" ")[1]);

        if(
            user == undefined || 
            (options != undefined && 
            !user.roles!.every((v:string)=>{
                if(options.includes(v))
                    return true;
            })) || (options == undefined && user.roles!.length <= 0)
            )
            return reply.status(401).send();

        // Insert user to request 
        (request as any).user = user;
    }});
}

export default fp(AuthenticationPlugin, {
    name: 'authentication',
  });