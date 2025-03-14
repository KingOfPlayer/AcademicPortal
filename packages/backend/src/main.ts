import Fastify, { FastifyInstance } from 'fastify'
import AutoLoad from '@fastify/autoload'
import {join} from 'path'
import dotenv from "dotenv";
dotenv.config();
import "./services/database-service"
import AuthenticationPlugin from "./plugins/auth-plugin"

let api_port:number  = parseInt(process.env.PORT!) ?? 3000;

const server:FastifyInstance = Fastify({
    logger: { level: 'info' }
})

server.register(AuthenticationPlugin);

// Declare a route
server.register(AutoLoad,{
    dir: join(__dirname,'rotues'),
    options: { prefix: "/api"},
    forceESM: true
});

server.ready(()=>{
    server.log.info(server.printRoutes())
});

// Run the server!
(async () => {
    try {
        await server.listen({ port: api_port})
    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }
})();
