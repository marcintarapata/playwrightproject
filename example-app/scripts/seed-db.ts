/**
 * Database Seed Script
 *
 * Populates the database with test data for development and testing.
 * Creates predefined users and todos for consistent testing.
 *
 * Usage: npm run db:seed
 */

import { db } from '../lib/db';
import { users, todos } from '../lib/db/schema';
import bcrypt from 'bcryptjs';

console.log('🌱 Seeding database...');

async function seed() {
  try {
    // Hash passwords for test users
    const testPasswordHash = await bcrypt.hash('Test123!@#', 10);
    const adminPasswordHash = await bcrypt.hash('Admin123!@#', 10);
    const johnPasswordHash = await bcrypt.hash('John123!@#', 10);

    // Insert test users
    console.log('👥 Creating users...');

    const testUser = db
      .insert(users)
      .values({
        name: 'Test User',
        email: 'test@example.com',
        passwordHash: testPasswordHash,
      })
      .returning()
      .get();

    const adminUser = db
      .insert(users)
      .values({
        name: 'Admin User',
        email: 'admin@example.com',
        passwordHash: adminPasswordHash,
      })
      .returning()
      .get();

    const johnUser = db
      .insert(users)
      .values({
        name: 'John Doe',
        email: 'john@example.com',
        passwordHash: johnPasswordHash,
      })
      .returning()
      .get();

    console.log('✅ Created 3 users');

    // Insert todos for Test User
    console.log('📝 Creating todos for Test User...');

    const testUserTodos = [
      // Completed todos
      {
        userId: testUser.id,
        title: 'Setup development environment',
        description: 'Install Node.js, npm, and required tools',
        priority: 'high' as const,
        completed: true,
      },
      {
        userId: testUser.id,
        title: 'Read project documentation',
        description: 'Go through README and API docs',
        priority: 'medium' as const,
        completed: true,
      },
      {
        userId: testUser.id,
        title: 'Configure database',
        description: 'Set up SQLite and run migrations',
        priority: 'high' as const,
        completed: true,
      },
      {
        userId: testUser.id,
        title: 'Write unit tests',
        description: 'Add test coverage for API endpoints',
        priority: 'medium' as const,
        completed: true,
      },
      {
        userId: testUser.id,
        title: 'Code review PR #42',
        description: 'Review and approve authentication changes',
        priority: 'low' as const,
        completed: true,
      },

      // Active todos
      {
        userId: testUser.id,
        title: 'Implement user authentication',
        description: 'Add login and registration functionality',
        priority: 'high' as const,
        completed: false,
      },
      {
        userId: testUser.id,
        title: 'Design landing page',
        description: 'Create mockups for the homepage',
        priority: 'medium' as const,
        completed: false,
      },
      {
        userId: testUser.id,
        title: 'Optimize database queries',
        description: 'Add indexes and improve query performance',
        priority: 'medium' as const,
        completed: false,
      },
      {
        userId: testUser.id,
        title: 'Update dependencies',
        description: 'Upgrade to latest versions of packages',
        priority: 'low' as const,
        completed: false,
      },
      {
        userId: testUser.id,
        title: 'Write API documentation',
        description: 'Document all REST endpoints with examples',
        priority: 'high' as const,
        completed: false,
      },
    ];

    db.insert(todos).values(testUserTodos).run();
    console.log('✅ Created 10 todos for Test User');

    // Insert todos for Admin User
    console.log('📝 Creating todos for Admin User...');

    const adminUserTodos = [
      {
        userId: adminUser.id,
        title: 'Review user permissions',
        description: 'Audit and update role-based access control',
        priority: 'high' as const,
        completed: false,
      },
      {
        userId: adminUser.id,
        title: 'Monitor system performance',
        description: 'Check server metrics and logs',
        priority: 'medium' as const,
        completed: false,
      },
      {
        userId: adminUser.id,
        title: 'Backup database',
        description: 'Create weekly database backup',
        priority: 'high' as const,
        completed: false,
      },
    ];

    db.insert(todos).values(adminUserTodos).run();
    console.log('✅ Created 3 todos for Admin User');

    // Insert todos for John
    console.log('📝 Creating todos for John Doe...');

    const johnUserTodos = [
      {
        userId: johnUser.id,
        title: 'Learn Playwright',
        description: 'Complete Playwright tutorial and examples',
        priority: 'medium' as const,
        completed: false,
      },
      {
        userId: johnUser.id,
        title: 'Buy groceries',
        description: 'Milk, eggs, bread, coffee',
        priority: 'low' as const,
        completed: false,
      },
    ];

    db.insert(todos).values(johnUserTodos).run();
    console.log('✅ Created 2 todos for John Doe');

    console.log('');
    console.log('🎉 Database seeded successfully!');
    console.log('');
    console.log('📋 Test Users:');
    console.log('  1. test@example.com / Test123!@# (10 todos)');
    console.log('  2. admin@example.com / Admin123!@# (3 todos)');
    console.log('  3. john@example.com / John123!@# (2 todos)');
    console.log('');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
