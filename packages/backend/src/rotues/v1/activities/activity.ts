import { FastifyInstance } from "fastify";
import { FastifyAuthPlugin } from "../../../plugins/auth-plugin";
import { ActivityCategoryDTO } from "../../../models/dtos/activity-category-dto";
import { GetActivity, GetAllActivityCategory } from "../../../services/activity-service";

export default async function (fastify: FastifyInstance & FastifyAuthPlugin){
    fastify.get<{Body:ActivityCategoryDTO,reply:ActivityCategoryDTO}>("/",{preHandler:[fastify.authentication()]},async (request, reply)=>{
        const activityCategories = await GetAllActivityCategory()
        return reply.status(200).send(activityCategories);
    });

    fastify.get<{Body:ActivityCategoryDTO,reply:ActivityCategoryDTO}>("/:code/:id",{preHandler:[fastify.authentication()]},async (request, reply)=>{
        const { code, id } = request.params as { code: string, id:number };
        const activity = await GetActivity(code,id)
        return reply.status(200).send(activity);
    });
}