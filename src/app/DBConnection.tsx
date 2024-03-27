import { Pool, QueryResult, QueryResultRow } from 'pg';

class DBConnection {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      user: process.env.PSQL_USER,
      host: process.env.PSQL_HOST,
      database: process.env.PSQL_DATABASE,
      password: process.env.PSQL_PASSWORD,
      port: parseInt(process.env.PSQL_PORT || '5432', 10), // Default port for PostgreSQL is 5432
      ssl: process.env.PSQL_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    });

    process.on('SIGINT', async () => {
      await this.pool.end();
      console.log('Pool has ended');
    });
  }

  async query<T extends QueryResultRow>(sql: string, params?: any[]): Promise<QueryResult<T>> {
    const client = await this.pool.connect();
    try {
      return await client.query<T>(sql, params);
    } finally {
      client.release();
    }
  }
}

export default new DBConnection();