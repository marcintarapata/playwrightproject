/**
 * Authentication Fixtures
 *
 * Provides authenticated browser contexts and helper methods for tests.
 * Handles user authentication state management across tests.
 *
 * @module fixtures/authFixtures
 */

import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/modules/auth/LoginPage';

/**
 * Test user credentials
 */
export const TEST_USERS = {
  testUser: {
    email: 'test@example.com',
    password: 'Test123!@#',
    name: 'Test User',
  },
  adminUser: {
    email: 'admin@example.com',
    password: 'Admin123!@#',
    name: 'Admin User',
  },
  johnUser: {
    email: 'john@example.com',
    password: 'John123!@#',
    name: 'John Doe',
  },
};

/**
 * Authentication Fixtures Type
 */
export type AuthFixtures = {
  /**
   * Authenticated page with test user logged in
   */
  authenticatedPage: Page;

  /**
   * Helper function to login as a specific user
   */
  loginAs: (email: string, password: string) => Promise<void>;

  /**
   * Helper function to logout
   */
  logout: () => Promise<void>;
};

/**
 * Extended Test with Authentication Fixtures
 *
 * @example
 * ```typescript
 * import { test, expect } from '../fixtures/authFixtures';
 *
 * test('authenticated test', async ({ authenticatedPage }) => {
 *   await authenticatedPage.goto('/dashboard');
 *   // User is already logged in
 * });
 * ```
 */
export const test = base.extend<AuthFixtures>({
  /**
   * Authenticated Page Fixture
   *
   * Provides a page with an authenticated session.
   * User is automatically logged in before the test starts.
   *
   * @example
   * ```typescript
   * test('dashboard test', async ({ authenticatedPage }) => {
   *   await authenticatedPage.goto('/dashboard');
   *   // Test logic with authenticated user
   * });
   * ```
   */
  authenticatedPage: async ({ page }, use) => {
    // Login with default test user
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.testUser.email, TEST_USERS.testUser.password);

    // Wait for redirect to dashboard
    await page.waitForURL(/\/dashboard/, { timeout: 10000 });

    // Provide the authenticated page to the test
    await use(page);

    // Cleanup: logout after test
    // (Optional - tests are isolated by default in Playwright)
  },

  /**
   * Login As Fixture
   *
   * Provides a helper function to login as any user.
   *
   * @example
   * ```typescript
   * test('multi-user test', async ({ page, loginAs }) => {
   *   await loginAs(TEST_USERS.adminUser.email, TEST_USERS.adminUser.password);
   *   // Test logic with admin user
   * });
   * ```
   */
  loginAs: async ({ page }, use) => {
    const loginAsUser = async (email: string, password: string): Promise<void> => {
      const loginPage = new LoginPage(page);
      await loginPage.navigate();
      await loginPage.login(email, password);
      await page.waitForURL(/\/dashboard/, { timeout: 10000 });
    };

    await use(loginAsUser);
  },

  /**
   * Logout Fixture
   *
   * Provides a helper function to logout the current user.
   *
   * @example
   * ```typescript
   * test('logout test', async ({ authenticatedPage, logout }) => {
   *   await logout();
   *   await expect(authenticatedPage).toHaveURL('/');
   * });
   * ```
   */
  logout: async ({ page }, use) => {
    const logoutUser = async (): Promise<void> => {
      const logoutButton = page.locator('[data-testid="logout-button"]');
      const isVisible = await logoutButton.isVisible().catch(() => false);

      if (isVisible) {
        await logoutButton.click();
        await page.waitForURL(/^\/$|\/login/, { timeout: 5000 });
      }
    };

    await use(logoutUser);
  },
});

/**
 * Export expect for convenience
 */
export { expect } from '@playwright/test';

/**
 * Helper function to setup authentication state
 * Can be used in global setup for faster test execution
 *
 * @param page - Playwright page object
 * @param email - User email
 * @param password - User password
 * @returns Promise that resolves when authentication is complete
 *
 * @example
 * ```typescript
 * // In global-setup.ts
 * await setupAuth(page, TEST_USERS.testUser.email, TEST_USERS.testUser.password);
 * await page.context().storageState({ path: 'auth-state.json' });
 * ```
 */
export async function setupAuth(page: Page, email: string, password: string): Promise<void> {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login(email, password);
  await page.waitForURL(/\/dashboard/, { timeout: 10000 });
}
