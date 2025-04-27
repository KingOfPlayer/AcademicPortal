import { FastifyInstance } from "fastify";
import { FastifyAuthPlugin } from "../../../plugins/auth-plugin";
import { GetStaffAnnouncements } from "../../../services/staff-announcement";

export default async function (fastify: FastifyInstance & FastifyAuthPlugin) {
  fastify.get("/", {}, async (request, reply) => {
    const staffAnnouncements = await GetStaffAnnouncements();
    return reply.status(200).send(staffAnnouncements);
  });
}
