import { FastifyInstance } from "fastify";
import { IUser } from "../../../models/user";
import { GetUser } from "../../../services/user-service";
import { UserDTO } from "../../../models/dtos/userDto";
import { FastifyAuthPlugin } from "../../../plugins/auth-plugin";
import { GenerateRefleshJWT } from "../../../services/auth-service";

export default async function (fastify: FastifyInstance & FastifyAuthPlugin){
    //Login 
    fastify.post<{Body:IUser}>("/login",async (request, reply)=>{
        try{
            // Receive id_number/password from body
            const _user = request.body as UserDTO;
            // Search user by id_number
            const user = await GetUser(_user.id_number);
            if(user != null){
                // Password Checking
                if(user.password == _user.password){ // Password is raw for now
                    // Return reflesh token
                    const refleshToken = await GenerateRefleshJWT(user);
                    return reply.status(200).send(refleshToken);
                }
                return reply.status(401).send();
            }else{
                return reply.status(401).send();
            }
        }catch(err){
            return reply.status(500).send(err);
        }
    });
}