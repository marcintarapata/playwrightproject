/**
 * Dashboard Test Suite
 *
 * Tests for the authenticated dashboard functionality including:
 * - Dashboard load and rendering
 * - Todo statistics display
 * - Navigation to other pages
 * - User authentication state
 *
 * @group e2e
 * @group dashboard
 * @group authenticated
 */

import { test, expect } from '../../../src/fixtures/authFixtures';
import { DashboardPage } from '../../../src/pages/modules/dashboard/DashboardPage';

test.describe('Dashboard', () => {
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    dashboardPage = new DashboardPage(authenticatedPage);
    await dashboardPage.navigate();
    await dashboardPage.verifyPageLoaded();
  });

  test.describe('Page Load and Rendering', () => {
    test('should load dashboard successfully', async ({ authenticatedPage }) => {
      await expect(authenticatedPage).toHaveURL('/dashboard');
    });

    test('should display page title', async ({ authenticatedPage }) => {
      const pageTitle = authenticatedPage.locator('[data-testid="page-title"]');
      await expect(pageTitle).toBeVisible();
      await expect(pageTitle).toContainText(/dashboard/i);
    });

    test('should display welcome message', async () => {
      const message = await dashboardPage.getWelcomeMessage();
      expect(message).toBeTruthy();
      expect(message.toLowerCase()).toContain('welcome');
    });

    test('should finish loading without errors', async () => {
      await dashboardPage.waitForDashboardLoaded();
      const statsVisible = await dashboardPage.areStatsVisible();
      expect(statsVisible).toBe(true);
    });
  });

  test.describe('Todo Statistics', () => {
    test('should display all stat cards', async () => {
      await dashboardPage.expectStatsVisible();
    });

    test('should display total todos count', async () => {
      const total = await dashboardPage.getTotalTodos();
      expect(total).toBeGreaterThanOrEqual(0);
      expect(typeof total).toBe('number');
    });

    test('should display active todos count', async () => {
      const active = await dashboardPage.getActiveTodos();
      expect(active).toBeGreaterThanOrEqual(0);
      expect(typeof active).toBe('number');
    });

    test('should display completed todos count', async () => {
      const completed = await dashboardPage.getCompletedTodos();
      expect(completed).toBeGreaterThanOrEqual(0);
      expect(typeof completed).toBe('number');
    });

    test('should have correct sum of active and completed todos', async () => {
      const total = await dashboardPage.getTotalTodos();
      const active = await dashboardPage.getActiveTodos();
      const completed = await dashboardPage.getCompletedTodos();

      expect(total).toBe(active + completed);
    });

    test('should display todos for test user', async () => {
      // Test user should have 10 todos from seed data
      const total = await dashboardPage.getTotalTodos();
      expect(total).toBe(10);
    });

    test('stat values should be numeric', async ({ authenticatedPage }) => {
      const totalValue = authenticatedPage.locator('[data-testid="stat-total"] [data-testid="stat-value"]');
      const activeValue = authenticatedPage.locator('[data-testid="stat-active"] [data-testid="stat-value"]');
      const completedValue = authenticatedPage.locator('[data-testid="stat-completed"] [data-testid="stat-value"]');

      const totalText = await totalValue.textContent();
      const activeText = await activeValue.textContent();
      const completedText = await completedValue.textContent();

      expect(Number.isInteger(parseInt(totalText || '0'))).toBe(true);
      expect(Number.isInteger(parseInt(activeText || '0'))).toBe(true);
      expect(Number.isInteger(parseInt(completedText || '0'))).toBe(true);
    });
  });

  test.describe('Navigation', () => {
    test('should navigate to todos page', async ({ authenticatedPage }) => {
      await dashboardPage.clickViewTodos();
      await expect(authenticatedPage).toHaveURL('/todos');
    });

    test('should have working todos link', async ({ authenticatedPage }) => {
      await dashboardPage.navigateToTodos();
      await expect(authenticatedPage).toHaveURL('/todos');
    });

    test('should logout successfully', async ({ authenticatedPage }) => {
      await dashboardPage.logout();
      await expect(authenticatedPage).toHaveURL('/');
    });
  });

  test.describe('User Authentication State', () => {
    test('should display correct user name', async () => {
      const message = await dashboardPage.getWelcomeMessage();
      expect(message).toContain('Test User');
    });

    test('should have logout button visible', async ({ authenticatedPage }) => {
      const logoutButton = authenticatedPage.locator('[data-testid="logout-button"]');
      await expect(logoutButton).toBeVisible();
    });

    test('should redirect to login when not authenticated', async ({ page }) => {
      // Create new page without authentication
      const unauthDashboard = new DashboardPage(page);
      await unauthDashboard.navigate();

      // Should redirect to login
      await expect(page).toHaveURL(/\/login/);
    });
  });

  test.describe('Data Updates', () => {
    test('stats should update after completing a todo', async ({ authenticatedPage }) => {
      // Get initial counts
      const initialActive = await dashboardPage.getActiveTodos();
      const initialCompleted = await dashboardPage.getCompletedTodos();

      // Navigate to todos and complete one
      await dashboardPage.clickViewTodos();
      await authenticatedPage.waitForURL('/todos');

      // Complete first active todo
      const firstTodoCheckbox = authenticatedPage.locator('[data-testid^="todo-checkbox-"]:not(:checked)').first();
      const isVisible = await firstTodoCheckbox.isVisible().catch(() => false);

      if (isVisible) {
        await firstTodoCheckbox.click();
        await authenticatedPage.waitForTimeout(500);

        // Go back to dashboard
        await dashboardPage.navigate();
        await dashboardPage.waitForDashboardLoaded();

        // Verify counts updated
        const newActive = await dashboardPage.getActiveTodos();
        const newCompleted = await dashboardPage.getCompletedTodos();

        expect(newActive).toBe(initialActive - 1);
        expect(newCompleted).toBe(initialCompleted + 1);
      }
    });
  });

  test.describe('Responsiveness', () => {
    test('should be mobile responsive', async ({ authenticatedPage }) => {
      await authenticatedPage.setViewportSize({ width: 375, height: 667 });
      await dashboardPage.navigate();
      await dashboardPage.verifyPageLoaded();

      // Stats should still be visible
      await dashboardPage.expectStatsVisible();
    });

    test('should display stats in grid on desktop', async ({ authenticatedPage }) => {
      await authenticatedPage.setViewportSize({ width: 1280, height: 720 });
      await dashboardPage.navigate();
      await dashboardPage.verifyPageLoaded();

      // All stats should be visible
      await dashboardPage.expectStatsVisible();
    });
  });
});
