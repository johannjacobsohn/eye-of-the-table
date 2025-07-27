import { FastifyInstance } from 'fastify';

export default async function helloRoutes(fastify: FastifyInstance) {
  fastify.get('/hello', async (request, reply) => {
    const { name } = request.query as { name?: string };
    const message = name ? `Hello ${name}` : 'Hello World';
    reply.send({ message });
  });
}
