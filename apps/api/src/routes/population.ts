import { FastifyInstance, FastifySchema } from 'fastify';
import { createClient } from 'redis';

interface PopulationChartQueryData {
  annotations: {
    dataset_link: string;
    hidden_measures: string;
    topic: string;
    table: string;
    dataset_name: string;
    source_description: string;
    source_name: string;
    subtopic: string;
  };
  page: {
    limit: number;
    offset: number;
    total: number;
  };
  columns: string[];
  data: Array<{ [key: string]: any }>;
}

const populationSchema: FastifySchema = {
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'integer', minimum: 1, default: 1 },
      limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
      sort: { type: 'string', enum: ['Year', 'Nation'], default: 'Year' },
      order: { type: 'string', enum: ['asc', 'desc'], default: 'asc' },
    },
    required: [],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              Nation: { type: 'string' },
              Year: { type: 'integer' },
              'Total Population': { type: 'integer' },
            },
            required: ['Nation', 'Year', 'Total Population'],
          },
        },
        total: { type: 'integer' },
        page: { type: 'integer' },
        limit: { type: 'integer' },
      },
    },
    500: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
};

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
});
redisClient.on('error', (err) => console.error('Redis Client Error', err));

export default async function populationRoutes(fastify: FastifyInstance) {
  await redisClient.connect();

  fastify.get('/population', { schema: populationSchema }, async (request, reply) => {
    const { page = 1, limit = 10, sort = 'Year', order = 'asc' } = request.query as {
      page?: number;
      limit?: number;
      sort?: string;
      order?: 'asc' | 'desc';
    };

    const cacheKey = `population:${page}:${limit}:${sort}:${order}`;

    try {
      // Check Redis cache
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return reply.send(JSON.parse(cachedData));
      }

      const API_URL =
        'https://honolulu-api.datausa.io/tesseract/data.jsonrecords?cube=pums_5&drilldowns=Nation,Year&measures=Total+Population';

      const res = await fetch(API_URL);
      if (!res.ok) {
        throw new Error('Error fetching population data');
      }

      const data = (await res.json()) as PopulationChartQueryData;
      const filteredData = data.data.filter((item) => item['Nation'] === 'United States');

      const sortedData = filteredData.sort((a, b) => {
        const compareValue = order === 'asc' ? 1 : -1;
        if (a[sort] < b[sort]) return -1 * compareValue;
        if (a[sort] > b[sort]) return 1 * compareValue;
        return 0;
      });

      const paginatedData = sortedData.slice((page - 1) * limit, page * limit);

      const responseData = {
        data: paginatedData,
        total: filteredData.length,
        page,
        limit,
      };

      // Store result in Redis cache
      await redisClient.set(cacheKey, JSON.stringify(responseData), {
        EX: 3600, // Cache for 1 hour
      });

      reply.send(responseData);
    } catch (error) {
      reply.status(500).send({ error: (error as Error).message });
    }
  });
}
