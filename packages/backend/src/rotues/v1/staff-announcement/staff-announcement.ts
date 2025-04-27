import { FastifyInstance } from "fastify";
import { FastifyAuthPlugin } from "../../../plugins/auth-plugin";
import { DeleteStaffAnnouncement, GetStaffAnnouncementById, GetStaffAnnouncements, UpdateDisciplineRulesAtStaffAnnouncement, UpdateStaffAnnouncement } from "../../../services/staff-announcement";
import { StaffAnnouncementDTO } from "../../../models/dtos/staff-announcement-dto";
import { IStaffAnnouncement, StaffAnnouncement } from "../../../models/staff-announcement";

export default async function (fastify: FastifyInstance & FastifyAuthPlugin) {
    fastify.get("/", {}, async (request, reply) => {
        const staffAnnouncements = await GetStaffAnnouncements();
        return reply.status(200).send(staffAnnouncements);
    });

    fastify.get("/:id", {}, async (request, reply) => {
        const { id } = request.params as { id: string };
        const staffAnnouncement = await GetStaffAnnouncementById(id);
        if (!staffAnnouncement) {
            return reply.status(404).send({ message: "Staff announcement not found" });
        }
        return reply.status(200).send(staffAnnouncement);
    });

    fastify.post<{ Body: IStaffAnnouncement }>("/", {}, async (request, reply) => {
        const staffAnnouncement = request.body as StaffAnnouncementDTO;
        const newStaffAnnouncement = await new StaffAnnouncement(staffAnnouncement).save();
        return reply.status(201).send(newStaffAnnouncement);
    });

    fastify.put<{ Body: IStaffAnnouncement }>("/:id", {}, async (request, reply) => {
        const { id } = request.params as { id: string };
        const staffAnnouncement = await GetStaffAnnouncementById(id);
        if (!staffAnnouncement) {
            return reply.status(404).send({ message: "Staff announcement not found" });
        }
        const updatedStaffAnnouncement = await UpdateStaffAnnouncement(id, request.body);
        return reply.status(200).send(updatedStaffAnnouncement);
    });

    fastify.delete("/:id", {}, async (request, reply) => {
        const { id } = request.params as { id: string };
        const staffAnnouncement = await GetStaffAnnouncementById(id);
        if (!staffAnnouncement) {
            return reply.status(404).send({ message: "Staff announcement not found" });
        }
        await DeleteStaffAnnouncement(id);
        return reply.status(200).send({ message: "Staff announcement deleted successfully" });
    });

    fastify.put("/update/discipline-rules/:id", {}, async (request, reply) => {
        const { id } = request.params as { id: string };
        const staffAnnouncement = await GetStaffAnnouncementById(id);
        if (!staffAnnouncement) {
            return reply.status(404).send({ message: "Staff announcement not found" });
        }
        const updatedStaffAnnouncement = await UpdateDisciplineRulesAtStaffAnnouncement(id);
        return reply.status(200).send(updatedStaffAnnouncement);
    });
}
