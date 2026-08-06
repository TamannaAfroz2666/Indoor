# Indoor backend

Express and Apollo Server API foundation backed by PostgreSQL through Prisma.

## Setup

1. Copy `.env` to `.env` and replace the example values.
2. Run `npm install`.
3. Run `npm run prisma:generate`.
4. Run `npm run dev`.

REST health check: `GET /api/health`

GraphQL endpoint: `POST /graphql` with query `{ health { status database timestamp uptime } }`

The health checks require the configured PostgreSQL database to be reachable.
