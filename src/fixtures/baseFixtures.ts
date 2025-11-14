import { test as base } from '@playwright/test';
import { getCurrentEnvironment } from '../config/environments';

/**
 * Base Fixtures
 *
 * This file extends Playwright's base test with custom fixtures.
 * Fixtures provide a way to set up and tear down test dependencies,
 * manage test data, and share common utilities across tests.
 *
 * Key Benefits:
 * - Dependency injection for test components
 * - Automatic setup and teardown
 * - Reusable test context
 * - Type-safe test utilities
 *
 * @module fixtures/baseFixtures
 */

/**
 * Custom Test Fixtures Interface
 * Define all custom fixtures here for type safety
 */
export type BaseFixtures = {
  /**
   * Current environment configuration
   * Automatically provides environment settings to tests
   */
  envConfig: ReturnType<typeof getCurrentEnvironment>;

  /**
   * Test context with additional metadata
   * Useful for logging and debugging
   */
  testInfo: {
    testName: string;
    projectName: string;
    timestamp: string;
  };
};

/**
 * Extended Test Object
 * This is the main test object that should be imported in test files
 *
 * @example
 * ```typescript
 * import { test, expect } from '../fixtures/baseFixtures';
 *
 * test('example test', async ({ page, envConfig }) => {
 *   await page.goto(envConfig.baseURL);
 *   // ... test logic
 * });
 * ```
 */
export const test = base.extend<BaseFixtures>({
  /**
   * Environment Configuration Fixture
   *
   * Automatically provides environment configuration to all tests.
   * No setup or teardown needed - it's just a data provider.
   *
   * @example
   * ```typescript
   * test('uses environment config', async ({ envConfig }) => {
   *   console.log(`Testing against: ${envConfig.baseURL}`);
   * });
   * ```
   */
  envConfig: async ({}, use) => {
    const config = getCurrentEnvironment();
    await use(config);
  },

  /**
   * Test Info Fixture
   *
   * Provides metadata about the current test.
   * Useful for logging, screenshots, and debugging.
   *
   * @example
   * ```typescript
   * test('uses test info', async ({ testInfo, page }) => {
   *   console.log(`Running test: ${testInfo.testName}`);
   *   await page.screenshot({ path: `screenshots/${testInfo.testName}.png` });
   * });
   * ```
   */
  testInfo: async ({ }, use, testInfo) => {
    const info = {
      testName: testInfo.title,
      projectName: testInfo.project.name,
      timestamp: new Date().toISOString(),
    };

    // Log test start
    console.info(`[${info.timestamp}] Starting test: ${info.testName} (${info.projectName})`);

    await use(info);

    // Log test completion
    console.info(`[${new Date().toISOString()}] Completed test: ${info.testName}`);
  },

  /**
   * Page Fixture Override
   *
   * Extends the default page fixture with custom behavior.
   * Here we can add custom page initialization, error handlers, etc.
   */
  page: async ({ page, envConfig }, use) => {
    // Set default navigation timeout from environment config
    page.setDefaultNavigationTimeout(envConfig.timeout);
    page.setDefaultTimeout(envConfig.timeout);

    // Clear cookies before each test to ensure clean state
    await page.context().clearCookies();

    // Add custom error handler for uncaught page errors
    page.on('pageerror', (error) => {
      console.error(`Uncaught page error: ${error.message}`);
    });

    // Add console message handler for debugging
    page.on('console', (msg) => {
      // Log only errors and warnings from the browser console
      if (msg.type() === 'error' || msg.type() === 'warning') {
        console.warn(`Browser ${msg.type()}: ${msg.text()}`);
      }
    });

    await use(page);

    // Cleanup: clear cookies after test
    await page.context().clearCookies();
    
    // Clear storage if page has a valid origin
    try {
      const url = page.url();
      if (url && url !== 'about:blank') {
        await page.evaluate(() => {
          localStorage.clear();
          sessionStorage.clear();
        });
      }
    } catch (e) {
      // Ignore errors if page is already closed or invalid
    }
  },
});

/**
 * Export expect for convenience
 * This allows importing both test and expect from the same file
 */
export { expect } from '@playwright/test';
