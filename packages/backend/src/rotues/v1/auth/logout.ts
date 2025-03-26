import { FastifyInstance } from "fastify";
import { RemoveRefleshJWT, ValidateRefleshJWT } from "../../../services/auth-service";
export default async function (fastify: FastifyInstance){
    //Logout 
    fastify.post("/logout",async (request, response)=>{
        // Checking token from header
        if(request.headers["authorization"] != undefined){
            const refleshToken = request.headers["authorization"].split(" ")[1];
            // Validate reflesh token with user
            const user = await ValidateRefleshJWT(refleshToken); 
            if(user != undefined){
                // Remove reflesh token
                RemoveRefleshJWT(refleshToken);
                return response.status(200).send();
            }
        }
        return response.status(401).send();
    });
}