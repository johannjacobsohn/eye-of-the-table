import { FastifyInstance } from 'fastify';

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

export default async function populationRoutes(fastify: FastifyInstance) {
  fastify.get('/population', async (request, reply) => {
    const { page = 1, limit = 10, sort = 'Year' } = request.query as {
      page?: number;
      limit?: number;
      sort?: string;
    };

    const API_URL =
      'https://honolulu-api.datausa.io/tesseract/data.jsonrecords?cube=pums_5&drilldowns=Nation,Year&measures=Total+Population';

    try {
      const res = await fetch(API_URL);
      if (!res.ok) {
        throw new Error('Error fetching population data');
      }

      const data = (await res.json()) as PopulationChartQueryData;
      const filteredData = data.data.filter((item) => item['Nation'] === 'United States');

      const sortedData = filteredData.sort((a, b) => {
        if (a[sort] < b[sort]) return -1;
        if (a[sort] > b[sort]) return 1;
        return 0;
      });

      const paginatedData = sortedData.slice((page - 1) * limit, page * limit);

      reply.send({
        data: paginatedData,
        total: filteredData.length,
        page,
        limit,
      });
    } catch (error) {
      reply.status(500).send({ error: (error as Error).message });
    }
  });
}
