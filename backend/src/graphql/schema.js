import { getHealth } from '../services/health.service.js';

export const typeDefs = `#graphql
  type Health {
    status: String!
    database: String!
    timestamp: String!
    uptime: Float!
  }

  type Query {
    health: Health!
  }
`;

export const resolvers = {
  Query: {
    health: () => getHealth(),
  },
};
