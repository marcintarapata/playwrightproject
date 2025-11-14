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
import { LandingPage } from '../../src/pages/modules/landing/LandingPage';
import { LoginPage } from '../../src/pages/modules/auth/LoginPage';
import { DashboardPage } from '../../src/pages/modules/dashboard/DashboardPage';
import { TodosPage } from '../../src/pages/modules/todos/TodosPage';
import { standardUser } from '../../src/config/users';

test.describe('Critical Path Smoke Tests', () => {
  /**
   * Smoke Test: Landing Page Loads
   *
   * Verifies that the landing page loads successfully.
   * This is the most basic health check.
   */
  test('should load landing page', async ({ page }) => {
    const landingPage = new LandingPage(page);
    await landingPage.navigate();
    await landingPage.verifyPageLoaded();

    // Verify page loaded correctly
    await expect(page).toHaveURL('/');
    await landingPage.expectHeroVisible();
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
   * Smoke Test: Dashboard Access After Login
   *
   * Verifies that authenticated users can access the dashboard.
   */
  test('should access dashboard after login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const { email, password } = standardUser;

    await loginPage.navigate();
    await loginPage.login(email, password);

    // Verify dashboard loads
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.waitForDashboardLoaded();
    await expect(page).toHaveURL('/dashboard');

    // Verify stats are visible
    const statsVisible = await dashboardPage.areStatsVisible();
    expect(statsVisible).toBe(true);
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
  test('should not have console errors on homepage', async ({ page }) => {
    const consoleErrors: string[] = [];

    // Listen for console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Navigate to homepage
    const landingPage = new LandingPage(page);
    await landingPage.navigate();
    await page.waitForLoadState('networkidle');

    // Assert no console errors
    expect(consoleErrors).toHaveLength(0);
  });

  /**
   * Smoke Test: Create Todo
   *
   * Verifies that users can create todos successfully.
   * This tests critical CRUD functionality.
   */
  test('should create a new todo', async ({ page }) => {
    // Login
    const loginPage = new LoginPage(page);
    const { email, password } = standardUser;
    await loginPage.navigate();
    await loginPage.login(email, password);

    // Navigate to todos
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.clickViewTodos();

    // Create todo
    const todosPage = new TodosPage(page);
    await todosPage.verifyPageLoaded();

    const initialCount = await todosPage.getTodoCount();
    await todosPage.createTodo('Smoke Test Todo', 'Critical path test', 'high');

    const newCount = await todosPage.getTodoCount();
    expect(newCount).toBe(initialCount + 1);
  });

  /**
   * Smoke Test: Complete Todo Workflow
   *
   * Verifies end-to-end todo workflow from creation to completion.
   */
  test('should complete full todo workflow', async ({ page }) => {
    // Login
    const loginPage = new LoginPage(page);
    const { email, password } = standardUser;
    await loginPage.navigate();
    await loginPage.login(email, password);

    // Get initial dashboard stats
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.waitForDashboardLoaded();
    const initialActive = await dashboardPage.getActiveTodos();

    // Create new todo
    await dashboardPage.clickViewTodos();
    const todosPage = new TodosPage(page);
    await todosPage.createTodo('Workflow Test');

    // Toggle completion
    const firstTodo = page.locator('[data-testid^="todo-item-"]').first();
    const todoId = await firstTodo.getAttribute('data-testid');
    const id = parseInt(todoId?.replace('todo-item-', '') || '0');

    await todosPage.toggleTodo(id);
    await expect(page.locator(`[data-testid="todo-checkbox-${id}"]`)).toBeChecked();

    // Verify on dashboard
    await dashboardPage.navigate();
    await dashboardPage.waitForDashboardLoaded();

    const finalActive = await dashboardPage.getActiveTodos();
    expect(finalActive).toBe(initialActive); // Should be same since we created and completed one
  });
});
