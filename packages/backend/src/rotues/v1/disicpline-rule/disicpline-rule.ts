import { FastifyInstance } from "fastify";
import { FastifyAuthPlugin } from "../../../plugins/auth-plugin";
import {
  AddDisciplineRule,
  GetAllDisciplineRules,
  GetDisciplineRule,
  UpdateDisciplineRule,
} from "../../../services/disicpline-rule-service";
import { UserRoles } from "../../../models/user";
import { DisciplineRuleDTO } from "../../../models/dtos/academic-staff-discipline-rules-dto";

export default async function (fastify: FastifyInstance & FastifyAuthPlugin) {
  //Return user info
  fastify.get(
    "/:DisciplineName",
    { preHandler: [fastify.authentication()] },
    async (request, reply) => {
      const { DisciplineName } = request.query as { DisciplineName: string };
      let disciplineRules;
      if (DisciplineName == null)
        disciplineRules = await GetAllDisciplineRules();
      else disciplineRules = await GetDisciplineRule(DisciplineName);
      return reply.status(200).send(disciplineRules);
    },
  );

  fastify.post<{ Body: DisciplineRuleDTO }>(
    "/",
    { preHandler: [fastify.authentication([UserRoles.Admin])] },
    async (request, reply) => {
      await AddDisciplineRule(request.body);
      return reply.status(200).send({ message: "Discipline rule added" });
    }
  );

  fastify.put<{ Body: DisciplineRuleDTO }>(
    "/",
    { preHandler: [fastify.authentication([UserRoles.Admin])] },
    async (request, reply) => {
      const { DisciplineName } = request.query as { DisciplineName: string };
      if (DisciplineName == null) return reply.status(400);
      await UpdateDisciplineRule(DisciplineName, request.body);
      return reply.status(200).send({
        message: "Discipline rule updated",
      });
    },
  );
}
