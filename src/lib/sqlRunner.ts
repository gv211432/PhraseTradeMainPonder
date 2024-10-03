import { Client } from 'pg';
import { digestError } from '../services/logger';

// SQLRunner class to handle database connections and queries
class SqlRunner {
  private client: Client;

  constructor(config: { host: string; port: number; user: string; password: string; database: string; }) {
    this.client = new Client(config);
  }

  // Connect to the PostgreSQL database
  async connect(): Promise<void> {
    try {
      await this.client.connect();
      console.log("Connection to PostgreSQL ok");
    } catch (err) {
      await digestError("Connection error:", err);
    }
  }

  // Run a SQL query with optional parameters
  async runQuery(query: string, params?: any[]): Promise<any[]> {
    try {
      const res = await this.client.query(query, params);
      return res.rows; // Return the rows from the result
    } catch (err) {
      await digestError("Connection error:", err);
      throw err; // Re-throw the error after logging it
    }
  }

  // Close the database connection
  async close(): Promise<void> {
    await this.client.end();
    console.log("Connection to PostgreSQL closed");
  }
}


export const getUserDbConnection = async () => {
  try {
    const sqlRunner = new SqlRunner({
      database: process.env.USER_DB ?? "",
      user: process.env.USER_DB_USER ?? "",
      password: process.env.USER_DB_PASSWORD ?? "",
      host: process.env.USER_DB_HOST ?? "",
      port: Number(process.env.USER_DB_PORT ?? "5432")
    });
    await sqlRunner.connect();
    return sqlRunner;
  } catch (error) {
    await digestError("Unable to connect", error);
    return null;
  }
};
