import { FastifyInstance, FastifySchema } from 'fastify';
import { getAuth } from '@clerk/fastify';

const helloSchema: FastifySchema = {
  querystring: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      lang: { type: 'string', enum: ['en', 'de'] },
    },
    required: [],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
    401: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
};

export default async function helloRoutes(fastify: FastifyInstance) {
  fastify.get('/hello', { schema: helloSchema }, async (request, reply) => {
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
