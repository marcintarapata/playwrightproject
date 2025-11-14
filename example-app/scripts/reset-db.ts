/**
 * Database Reset Script
 *
 * Drops all tables and recreates the database schema.
 * WARNING: This deletes ALL data!
 *
 * Usage: npm run db:reset
 */

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

const dbPath = path.join(process.cwd(), 'data', 'dev.db');
const migrationsPath = path.join(process.cwd(), 'drizzle', 'migrations');

console.log('🗑️  Resetting database...');

// Remove existing database file
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('✅ Removed existing database');
}

// Create new database
const sqlite = new Database(dbPath);
sqlite.pragma('foreign_keys = ON');

console.log('🔄 Running migrations...');

const db = drizzle(sqlite);

try {
  migrate(db, { migrationsFolder: migrationsPath });
  console.log('✅ Database reset completed successfully!');
  console.log('📁 Database location:', dbPath);
} catch (error) {
  console.error('❌ Reset failed:', error);
  process.exit(1);
} finally {
  sqlite.close();
}
