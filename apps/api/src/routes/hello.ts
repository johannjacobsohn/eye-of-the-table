import { FastifyInstance } from 'fastify';
import { getAuth } from '@clerk/fastify'

export default async function helloRoutes(fastify: FastifyInstance) {
  fastify.get('/hello', async (request, reply) => {
    // Use `getAuth()` to get the user's ID
    const { userId } = getAuth(request)

    // If user isn't authenticated, return a 401 error
    if (!userId) {
      return reply.code(401).send({ error: 'User not authenticated' })
    }

    const { name, lang } = request.query as { lang?: string; name?: string };

    const greeting = lang === 'de' ? 'Hallo' : 'Hello';
    const defaultName = lang === 'de' ? 'Welt': 'World';

    reply.send({ message: `${greeting} ${name || defaultName}!` });
  });
}
