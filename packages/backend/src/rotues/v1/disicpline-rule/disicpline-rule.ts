import { FastifyInstance } from "fastify";
import { FastifyAuthPlugin } from "../../../plugins/auth-plugin";
import { GetAllDisciplineRules, GetDisciplineRule, UpdateDisciplineRule } from "../../../services/disicpline-rule-service";
import { UserRoles } from "../../../models/user";
import { AcademicStaffDisciplineRulesDTO } from "../../../models/dtos/academic-staff-discipline-rules-dto";

export default async function (fastify: FastifyInstance & FastifyAuthPlugin) {
    //Return user info
    fastify.get(
        "/",
        { preHandler: [fastify.authentication()] },
        async (request, reply) => {
            const { DisciplineName } = request.query as { DisciplineName: string;};
            let disciplineRules;
            if(DisciplineName == null)
              disciplineRules = await GetAllDisciplineRules();
            else
              disciplineRules = await GetDisciplineRule(DisciplineName);
            return reply.status(200).send(disciplineRules);
        },
    );

    fastify.put<{Body:AcademicStaffDisciplineRulesDTO}>(
      "/",
      { preHandler: [fastify.authentication([UserRoles.Admin])] },
      async (request, reply) => {
        const { DisciplineName } = request.query as { DisciplineName: string;};
        if(DisciplineName == null) return reply.status(400);
          await UpdateDisciplineRule(DisciplineName,request.body);
          return reply.status(200);
      },
    );
}
