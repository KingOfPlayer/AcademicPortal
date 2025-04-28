import { FastifyInstance } from "fastify";
import { FastifyAuthPlugin } from "../../../plugins/auth-plugin";
import { DeleteStaffAnnouncement, GetStaffAnnouncementById, GetStaffAnnouncements, UpdateDisciplineRulesAtStaffAnnouncement, UpdateStaffAnnouncement } from "../../../services/staff-announcement";
import { StaffAnnouncementDTO } from "../../../models/dtos/staff-announcement-dto";
import { IStaffAnnouncement, StaffAnnouncement } from "../../../models/staff-announcement";
import { UserRoles } from "../../../models/user";

export default async function (fastify: FastifyInstance & FastifyAuthPlugin) {
    fastify.get("/", { preHandler: [fastify.authentication()] }, async (request, reply) => {
        const staffAnnouncements = await GetStaffAnnouncements();
        return reply.status(200).send(staffAnnouncements);
    });

    fastify.get("/:id", { preHandler: [fastify.authentication()] }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const staffAnnouncement = await GetStaffAnnouncementById(id);
        if (!staffAnnouncement) {
            return reply.status(404).send({ message: "Staff announcement not found" });
        }
        return reply.status(200).send(staffAnnouncement);
    });

    fastify.post<{ Body: IStaffAnnouncement }>("/", { preHandler: [fastify.authentication([UserRoles.Admin])] }, async (request, reply) => {
        const staffAnnouncement = request.body as StaffAnnouncementDTO;
        const newStaffAnnouncement = await new StaffAnnouncement(staffAnnouncement).save();
        return reply.status(201).send(newStaffAnnouncement);
    });

    fastify.put<{ Body: IStaffAnnouncement }>("/:id", { preHandler: [fastify.authentication([UserRoles.Admin,UserRoles.Administrator])] }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const staffAnnouncement = await GetStaffAnnouncementById(id);
        if (!staffAnnouncement) {
            return reply.status(404).send({ message: "Staff announcement not found" });
        }
        const updatedStaffAnnouncement = await UpdateStaffAnnouncement(id, request.body);
        return reply.status(200).send(updatedStaffAnnouncement);
    });

    fastify.delete("/:id", { preHandler: [fastify.authentication([UserRoles.Admin])] }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const staffAnnouncement = await GetStaffAnnouncementById(id);
        if (!staffAnnouncement) {
            return reply.status(404).send({ message: "Staff announcement not found" });
        }
        await DeleteStaffAnnouncement(id);
        return reply.status(200).send({ message: "Staff announcement deleted successfully" });
    });

    fastify.put("/update/discipline-rules/:id", { preHandler: [fastify.authentication([UserRoles.Admin,UserRoles.Administrator])] }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const staffAnnouncement = await GetStaffAnnouncementById(id);
        if (!staffAnnouncement) {
            return reply.status(404).send({ message: "Staff announcement not found" });
        }
        const updatedStaffAnnouncement = await UpdateDisciplineRulesAtStaffAnnouncement(id);
        return reply.status(200).send(updatedStaffAnnouncement);
    });
}
