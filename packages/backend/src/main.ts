import Fastify from 'fastify'
import "./services/database-service"
import { User } from "./models/user"

const fastify = Fastify({
    logger: false
})

// Declare a route
fastify.get('/', async function handler(request, reply) {
    let _User = await User.findOne({});
    return _User
});

// Run the server!
(async () => {
    try {
        await fastify.listen({ port: 3000 })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})();
