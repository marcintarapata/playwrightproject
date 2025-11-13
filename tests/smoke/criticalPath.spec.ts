/**
 * Smoke Test Suite
 *
 * Critical path smoke tests that verify core functionality is working.
 * These tests should be fast (<5 minutes total) and cover the most
 * important user flows.
 *
 * Run these tests:
 * - On every pull request
 * - Before deployments
 * - After deployments to verify production
 *
 * @group smoke
 * @group critical
 */

import { test, expect } from '../../src/fixtures/baseFixtures';
import { LoginPage } from '../../src/pages/modules/auth/LoginPage';
import { standardUser } from '../../src/config/users';

test.describe('Critical Path Smoke Tests', () => {
  /**
   * Smoke Test: Application Loads
   *
   * Verifies that the application homepage loads successfully.
   * This is the most basic health check.
   */
  test('should load application homepage', async ({ page, envConfig }) => {
    // Navigate to base URL
    await page.goto(envConfig.baseURL);

    // Verify page loaded
    await expect(page).not.toHaveURL(/error|404|500/);

    // Take screenshot for visual verification
    await page.screenshot({ path: 'screenshots/smoke-homepage.png' });
  });

  /**
   * Smoke Test: Login Flow
   *
   * Verifies that users can successfully log in to the application.
   * This is a critical user flow that must always work.
   */
  test('should complete login flow', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const { email, password } = standardUser;

    // Act
    await loginPage.navigate();
    await loginPage.verifyPageLoaded();
    await loginPage.login(email, password);

    // Assert
    await loginPage.expectLoginSuccess();
    await expect(page).toHaveURL(/dashboard|home/);
  });

  /**
   * Smoke Test: API Health Check
   *
   * Verifies that the backend API is responding.
   */
  test('should verify API is responding', async ({ page, envConfig }) => {
    // Make a request to a health check endpoint
    const response = await page.request.get(`${envConfig.apiURL}/health`);

    // Verify response
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
  });

  /**
   * Smoke Test: Static Assets Load
   *
   * Verifies that critical static assets (CSS, JS) are loading.
   */
  test('should load critical static assets', async ({ page, envConfig }) => {
    const failedRequests: string[] = [];

    // Listen for failed requests
    page.on('requestfailed', (request) => {
      failedRequests.push(request.url());
    });

    // Navigate to homepage
    await page.goto(envConfig.baseURL);
    await page.waitForLoadState('networkidle');

    // Assert no critical assets failed to load
    expect(failedRequests).toHaveLength(0);
  });

  /**
   * Smoke Test: No Console Errors
   *
   * Verifies that there are no critical JavaScript errors on page load.
   */
  test('should not have console errors on homepage', async ({ page, envConfig }) => {
    const consoleErrors: string[] = [];

    // Listen for console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Navigate to homepage
    await page.goto(envConfig.baseURL);
    await page.waitForLoadState('networkidle');

    // Assert no console errors
    expect(consoleErrors).toHaveLength(0);
  });
});
