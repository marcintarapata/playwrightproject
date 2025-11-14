/**
 * Test User Configuration
 *
 * This file defines test user credentials and roles for authentication testing.
 * In production, credentials should be stored securely (e.g., in environment variables
 * or a secrets manager).
 *
 * @module config/users
 */

/**
 * User Role Enumeration
 */
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

/**
 * Test User Interface
 */
export interface TestUser {
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
  /** User's full name */
  fullName: string;
  /** User's role(s) */
  roles: UserRole[];
  /** Additional user metadata */
  metadata?: {
    department?: string;
    permissions?: string[];
    accountStatus?: 'active' | 'inactive' | 'locked';
  };
}

/**
 * Test Users
 * These are predefined test users for different scenarios.
 *
 * IMPORTANT: In production environments, replace these with environment variables:
 * - process.env.ADMIN_EMAIL
 * - process.env.ADMIN_PASSWORD
 * etc.
 */

/**
 * Standard User
 * Used for most test scenarios
 * These credentials match the seeded database users in the example-app
 */
export const standardUser: TestUser = {
  email: process.env.TEST_USER_EMAIL || 'test@example.com',
  password: process.env.TEST_USER_PASSWORD || 'Test123!@#',
  fullName: 'Test User',
  roles: [UserRole.USER],
  metadata: {
    department: 'Testing',
    accountStatus: 'active',
  },
};

/**
 * Admin User
 * Used for administrative function testing
 * These credentials match the seeded database users in the example-app
 */
export const adminUser: TestUser = {
  email: process.env.ADMIN_USER_EMAIL || 'admin@example.com',
  password: process.env.ADMIN_USER_PASSWORD || 'Admin123!@#',
  fullName: 'Admin User',
  roles: [UserRole.ADMIN, UserRole.USER],
  metadata: {
    department: 'Administration',
    permissions: ['create', 'read', 'update', 'delete', 'manage_users'],
    accountStatus: 'active',
  },
};

/**
 * Editor User
 * Used for content editing scenarios
 */
export const editorUser: TestUser = {
  email: process.env.EDITOR_USER_EMAIL || 'editor@example.com',
  password: process.env.EDITOR_USER_PASSWORD || 'EditorPassword123!',
  fullName: 'Editor User',
  roles: [UserRole.EDITOR, UserRole.USER],
  metadata: {
    department: 'Content',
    permissions: ['create', 'read', 'update'],
    accountStatus: 'active',
  },
};

/**
 * Viewer User
 * Used for read-only access scenarios
 */
export const viewerUser: TestUser = {
  email: process.env.VIEWER_USER_EMAIL || 'viewer@example.com',
  password: process.env.VIEWER_USER_PASSWORD || 'ViewerPassword123!',
  fullName: 'Viewer User',
  roles: [UserRole.VIEWER],
  metadata: {
    department: 'External',
    permissions: ['read'],
    accountStatus: 'active',
  },
};

/**
 * Inactive User
 * Used for testing access restrictions
 */
export const inactiveUser: TestUser = {
  email: 'inactive@example.com',
  password: 'InactivePassword123!',
  fullName: 'Inactive User',
  roles: [UserRole.USER],
  metadata: {
    accountStatus: 'inactive',
  },
};

/**
 * Get user by role
 *
 * @param role - User role to retrieve
 * @returns Test user with the specified role
 * @example
 * ```typescript
 * const admin = getUserByRole(UserRole.ADMIN);
 * await loginPage.login(admin.email, admin.password);
 * ```
 */
export function getUserByRole(role: UserRole): TestUser {
  const users: Record<UserRole, TestUser> = {
    [UserRole.ADMIN]: adminUser,
    [UserRole.USER]: standardUser,
    [UserRole.EDITOR]: editorUser,
    [UserRole.VIEWER]: viewerUser,
    [UserRole.GUEST]: standardUser, // Default to standard user for guest
  };

  return users[role] || standardUser;
}

/**
 * All test users
 * Useful for parameterized testing across different user types
 */
export const allUsers: TestUser[] = [standardUser, adminUser, editorUser, viewerUser];
