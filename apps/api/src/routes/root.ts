import { FastifyPluginAsync, FastifySchema } from 'fastify'

const rootSchema: FastifySchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        root: { type: 'boolean' },
      },
    },
  },
}

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', { schema: rootSchema }, async function (request, reply) {
    return { root: true }
  })
}

export default root
