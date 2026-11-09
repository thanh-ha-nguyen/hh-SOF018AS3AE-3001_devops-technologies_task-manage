import { Pool } from 'pg';
import dotenv from 'dotenv';
import { applySchema } from '../db/runSchema.js';
import { log } from '../observability/logger.js';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL || '******localhost:5432/taskmanagement';

export const pool = new Pool({
  connectionString: databaseUrl,
  max: 5,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 30000
});

export const connectDB = async (): Promise<void> => {
  try {
    await pool.query('SELECT 1');
    log('info', 'database_connection_established');

    // Apply schema.sql (CREATE TABLE IF NOT EXISTS) in development, mirroring
    // the old Sequelize sync-on-boot behavior.
    if (process.env.NODE_ENV === 'development' || process.env.DB_SYNC === 'true') {
      await applySchema(pool);
      log('info', 'database_schema_applied');
    }
  } catch (error) {
    log('error', 'database_connection_failed', {
      error: error instanceof Error ? error.message : String(error)
    });
    // Don't exit in test environment
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  }
};
