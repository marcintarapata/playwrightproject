/**
 * Database Seed Script (Better Auth Compatible)
 *
 * Populates the database with test data using Better Auth's signup API.
 * This ensures password hashes are created in the correct format.
 *
 * Usage: npm run db:seed
 */

import { auth } from '../lib/auth';
import { db } from '../lib/db';
import { todos } from '../lib/db/schema';

console.log('🌱 Seeding database...');

async function seed() {
  try {
    console.log('👥 Creating users via Better Auth...');

    // Create Test User using Better Auth
    const testUser = await auth.api.signUpEmail({
      body: {
        email: 'test@example.com',
        password: 'Test123!@#',
        name: 'Test User',
      },
    });

    // Create Admin User
    const adminUser = await auth.api.signUpEmail({
      body: {
        email: 'admin@example.com',
        password: 'Admin123!@#',
        name: 'Admin User',
      },
    });

    // Create John Doe User
    const johnUser = await auth.api.signUpEmail({
      body: {
        email: 'john@example.com',
        password: 'John123!@#',
        name: 'John Doe',
      },
    });

    console.log('✅ Created 3 users with Better Auth');

    // Get user IDs from the created users
    const testUserId = testUser.user?.id;
    const adminUserId = adminUser.user?.id;
    const johnUserId = johnUser.user?.id;

    if (!testUserId || !adminUserId || !johnUserId) {
      throw new Error('Failed to create users');
    }

    // Insert todos for Test User
    console.log('📝 Creating todos for Test User...');

    const testUserTodos = [
      // Completed todos
      {
        userId: testUserId,
        title: 'Setup development environment',
        description: 'Install Node.js, npm, and required tools',
        priority: 'high' as const,
        completed: true,
      },
      {
        userId: testUserId,
        title: 'Read project documentation',
        description: 'Go through README and API docs',
        priority: 'medium' as const,
        completed: true,
      },
      {
        userId: testUserId,
        title: 'Configure database',
        description: 'Set up SQLite and run migrations',
        priority: 'high' as const,
        completed: true,
      },
      {
        userId: testUserId,
        title: 'Write unit tests',
        description: 'Add test coverage for API endpoints',
        priority: 'medium' as const,
        completed: true,
      },
      {
        userId: testUserId,
        title: 'Code review PR #42',
        description: 'Review and approve authentication changes',
        priority: 'low' as const,
        completed: true,
      },

      // Active todos
      {
        userId: testUserId,
        title: 'Implement user authentication',
        description: 'Add login and registration functionality',
        priority: 'high' as const,
        completed: false,
      },
      {
        userId: testUserId,
        title: 'Design landing page',
        description: 'Create mockups for the homepage',
        priority: 'medium' as const,
        completed: false,
      },
      {
        userId: testUserId,
        title: 'Optimize database queries',
        description: 'Add indexes and improve query performance',
        priority: 'medium' as const,
        completed: false,
      },
      {
        userId: testUserId,
        title: 'Update dependencies',
        description: 'Upgrade to latest versions of packages',
        priority: 'low' as const,
        completed: false,
      },
      {
        userId: testUserId,
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
        userId: adminUserId,
        title: 'Review user permissions',
        description: 'Audit and update role-based access control',
        priority: 'high' as const,
        completed: false,
      },
      {
        userId: adminUserId,
        title: 'Monitor system performance',
        description: 'Check server metrics and logs',
        priority: 'medium' as const,
        completed: false,
      },
      {
        userId: adminUserId,
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
        userId: johnUserId,
        title: 'Learn Playwright',
        description: 'Complete Playwright tutorial and examples',
        priority: 'medium' as const,
        completed: false,
      },
      {
        userId: johnUserId,
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
