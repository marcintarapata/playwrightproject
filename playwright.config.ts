import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

/**
 * Playwright Test Configuration
 *
 * This configuration file sets up the testing environment for enterprise-grade
 * end-to-end testing with Playwright.
 *
 * @see https://playwright.dev/docs/test-configuration
 */

// Load environment variables from .env file
dotenv.config();

// Determine if running in CI environment
const isCI = !!process.env.CI;

export default defineConfig({
  /**
   * Test Directory
   * Location of all test files
   */
  testDir: './tests',

  /**
   * Test Match Pattern
   * Matches all .spec.ts files in the tests directory
   */
  testMatch: '**/*.spec.ts',

  /**
   * Global Timeout
   * Maximum time one test can run (30 seconds)
   */
  timeout: 30 * 1000,

  /**
   * Expect Timeout
   * Timeout for each assertion (10 seconds)
   */
  expect: {
    timeout: 10 * 1000,
  },

  /**
   * Test Execution Settings
   */

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: isCI,

  // Retry failed tests on CI for resilience
  retries: isCI ? 2 : 0,

  // Limit parallel workers on CI to avoid resource exhaustion
  workers: isCI ? 2 : 4,

  /**
   * Reporting
   * Configure multiple reporters for different purposes
   */
  reporter: [
    // Console reporter for live feedback
    ['list'],

    // HTML reporter for detailed test results
    ['html', {
      outputFolder: 'playwright-report',
      open: 'never' // Don't auto-open report (use npm run report)
    }],

    // JSON reporter for CI/CD integration
    ['json', {
      outputFile: 'test-results/results.json'
    }],

    // JUnit reporter for CI systems
    ['junit', {
      outputFile: 'test-results/junit.xml'
    }],
  ],

  /**
   * Shared Settings for all projects
   */
  use: {
    /**
     * Base URL
     * Set via environment variable (e.g., BASE_URL=https://example.com)
     * Falls back to localhost for local development
     */
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    /**
     * Browser Context Options
     */

    // Collect trace on first retry for debugging
    trace: 'on-first-retry',

    // Capture screenshot only on test failure
    screenshot: 'only-on-failure',

    // Record video only on test failure
    video: 'retain-on-failure',

    /**
     * Viewport Size
     * Default viewport for desktop testing
     */
    viewport: { width: 1280, height: 720 },

    /**
     * Action Timeout
     * Timeout for each Playwright action (click, fill, etc.)
     */
    actionTimeout: 15 * 1000,

    /**
     * Navigation Timeout
     * Timeout for page navigation
     */
    navigationTimeout: 30 * 1000,

    /**
     * Ignore HTTPS Errors
     * Set to true for testing environments with self-signed certificates
     */
    ignoreHTTPSErrors: true,

    /**
     * Locale and Timezone
     */
    locale: 'en-US',
    timezoneId: 'America/New_York',

    /**
     * Permissions
     * Grant specific permissions by default if needed
     */
    // permissions: ['geolocation'],

    /**
     * Device Scale Factor
     * For testing on different screen densities
     */
    deviceScaleFactor: 1,

    /**
     * Has Touch
     * Enable touch events if needed
     */
    hasTouch: false,

    /**
     * Is Mobile
     */
    isMobile: false,

    /**
     * Extra HTTP Headers
     * Add custom headers to all requests if needed
     */
    // extraHTTPHeaders: {
    //   'X-Custom-Header': 'value',
    // },
  },

  /**
   * Test Projects
   * Configure different browser/device combinations
   */
  projects: [
    /**
     * Desktop Chrome
     * Primary browser for testing
     */
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Chromium-specific options for headless environments
        launchOptions: {
          args: [
            '--disable-blink-features=AutomationControlled',
            '--disable-dev-shm-usage', // Overcome limited resource problems
            '--disable-gpu', // Disable GPU hardware acceleration
            '--no-sandbox', // Required for containerized environments
            '--disable-setuid-sandbox',
            '--single-process', // Run in single process (uses less memory)
          ],
        },
      },
    },

    /**
     * Additional browsers (commented out for now)
     * Uncomment when ready to expand browser coverage
     */

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /**
     * Mobile Testing Projects
     * Uncomment when mobile testing is required
     */

    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },

    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 13'] },
    // },
  ],

  /**
   * Web Server
   * Starts the example-app development server before running tests
   */
  webServer: {
    command: 'cd example-app && npm run dev',
    url: 'http://localhost:3000',
    timeout: 120 * 1000,
    reuseExistingServer: !isCI,
    stdout: 'pipe',
    stderr: 'pipe',
  },

  /**
   * Output Folder
   * Where to store test artifacts
   */
  outputDir: 'test-results/',

  /**
   * Global Setup
   * Run before all tests (e.g., for authentication setup)
   * Create a global-setup.ts file and uncomment below
   */
  // globalSetup: require.resolve('./src/config/global-setup'),

  /**
   * Global Teardown
   * Run after all tests complete
   */
  // globalTeardown: require.resolve('./src/config/global-teardown'),
});
