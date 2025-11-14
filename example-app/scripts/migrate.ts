/**
 * Database Migration Script
 *
 * Runs all pending database migrations.
 * Used during setup and deployment.
 */

import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'dev.db');
const migrationsPath = path.join(process.cwd(), 'drizzle', 'migrations');

console.log('🔄 Running database migrations...');

const sqlite = new Database(dbPath);
const db = drizzle(sqlite);

try {
  migrate(db, { migrationsFolder: migrationsPath });
  console.log('✅ Migrations completed successfully!');
} catch (error) {
  console.error('❌ Migration failed:', error);
  process.exit(1);
} finally {
  sqlite.close();
}
