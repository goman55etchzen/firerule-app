import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// POSTGRES_URL または DATABASE_URL から接続文字列を取得
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('Database connection string (POSTGRES_URL / DATABASE_URL) is missing.');
}

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });