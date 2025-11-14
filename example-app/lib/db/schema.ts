/**
 * Database Schema
 *
 * Defines the database tables using Drizzle ORM.
 * - users: Application users with authentication
 * - todos: User todo items with CRUD operations
 */

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

/**
 * Users Table
 *
 * Stores user account information for authentication
 */
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

/**
 * Todos Table
 *
 * Stores todo items for users with priority and completion status
 */
export const todos = sqliteTable('todos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  priority: text('priority', { enum: ['low', 'medium', 'high'] })
    .notNull()
    .default('medium'),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

/**
 * Type exports for use in the application
 */
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;
