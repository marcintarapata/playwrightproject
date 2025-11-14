/**
 * Database Connection
 *
 * Singleton database connection using Drizzle ORM and SQLite.
 * This ensures only one database connection is created and reused.
 */

import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import path from 'path';

// Database file path
const dbPath = path.join(process.cwd(), 'data', 'dev.db');

// Create SQLite database connection
const sqlite = new Database(dbPath);

// Enable foreign keys (important for cascade deletes)
sqlite.pragma('foreign_keys = ON');

// Create Drizzle instance with schema
export const db = drizzle(sqlite, { schema });

// Export schema for use in queries
export { schema };
