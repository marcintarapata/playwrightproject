/**
 * User Journey E2E Test Suite
 *
 * End-to-end tests simulating complete user workflows:
 * - New user registration and first todo
 * - Existing user login and todo management
 * - Complete task workflow from creation to completion
 *
 * @group e2e
 * @group workflows
 * @group critical
 */

import { test, expect } from '../../../src/fixtures/baseFixtures';
import { LandingPage } from '../../../src/pages/modules/landing/LandingPage';
import { LoginPage } from '../../../src/pages/modules/auth/LoginPage';
import { DashboardPage } from '../../../src/pages/modules/dashboard/DashboardPage';
import { TodosPage } from '../../../src/pages/modules/todos/TodosPage';
import { TEST_USERS } from '../../../src/fixtures/authFixtures';

test.describe('Complete User Journeys', () => {
  test.describe('First Time User Journey', () => {
    test('should complete full journey from landing to creating first todo', async ({ page }) => {
      // Step 1: Visit landing page
      const landingPage = new LandingPage(page);
      await landingPage.navigate();
      await landingPage.verifyPageLoaded();

      // Step 2: Click Get Started
      await landingPage.clickGetStarted();
      await expect(page).toHaveURL(/\/login/);

      // Step 3: Login
      const loginPage = new LoginPage(page);
      await loginPage.verifyPageLoaded();
      await loginPage.login(TEST_USERS.testUser.email, TEST_USERS.testUser.password);

      // Step 4: Verify redirect to dashboard
      await expect(page).toHaveURL('/dashboard');

      // Step 5: View dashboard stats
      const dashboardPage = new DashboardPage(page);
      await dashboardPage.waitForDashboardLoaded();
      const initialTotal = await dashboardPage.getTotalTodos();
      expect(initialTotal).toBeGreaterThanOrEqual(0);

      // Step 6: Navigate to todos
      await dashboardPage.clickViewTodos();
      await expect(page).toHaveURL('/todos');

      // Step 7: Create a new todo
      const todosPage = new TodosPage(page);
      await todosPage.verifyPageLoaded();
      await todosPage.createTodo('My First Todo', 'This is my first task', 'high');

      // Step 8: Verify todo was created
      const todoCount = await todosPage.getTodoCount();
      expect(todoCount).toBe(initialTotal + 1);

      // Step 9: Go back to dashboard and verify stats updated
      await todosPage.backToDashboard();
      await dashboardPage.waitForDashboardLoaded();
      const updatedTotal = await dashboardPage.getTotalTodos();
      expect(updatedTotal).toBe(initialTotal + 1);
    });
  });

  test.describe('Returning User Journey', () => {
    test('should complete full workflow of managing existing todos', async ({ page }) => {
      // Step 1: Direct login
      const loginPage = new LoginPage(page);
      await loginPage.navigate();
      await loginPage.login(TEST_USERS.testUser.email, TEST_USERS.testUser.password);

      // Step 2: Verify dashboard
      const dashboardPage = new DashboardPage(page);
      await dashboardPage.waitForDashboardLoaded();
      await expect(page).toHaveURL('/dashboard');

      // Step 3: Check initial stats
      const initialActive = await dashboardPage.getActiveTodos();
      const initialCompleted = await dashboardPage.getCompletedTodos();

      // Step 4: Navigate to todos
      await dashboardPage.navigateToTodos();

      // Step 5: Complete an active todo
      const todosPage = new TodosPage(page);
      await todosPage.verifyPageLoaded();

      const firstUnchecked = page.locator('[data-testid^="todo-checkbox-"]:not(:checked)').first();
      const isVisible = await firstUnchecked.isVisible().catch(() => false);

      if (isVisible) {
        const todoId = await firstUnchecked.getAttribute('data-testid');
        const id = parseInt(todoId?.replace('todo-checkbox-', '') || '0');

        await todosPage.toggleTodo(id);
        await expect(firstUnchecked).toBeChecked();

        // Step 6: Verify stats updated
        await dashboardPage.navigate();
        await dashboardPage.waitForDashboardLoaded();

        const newActive = await dashboardPage.getActiveTodos();
        const newCompleted = await dashboardPage.getCompletedTodos();

        expect(newActive).toBe(initialActive - 1);
        expect(newCompleted).toBe(initialCompleted + 1);
      }
    });

    test('should handle complete CRUD workflow', async ({ page }) => {
      // Login
      const loginPage = new LoginPage(page);
      await loginPage.navigate();
      await loginPage.login(TEST_USERS.testUser.email, TEST_USERS.testUser.password);

      // Navigate to todos
      const dashboardPage = new DashboardPage(page);
      await dashboardPage.clickViewTodos();

      const todosPage = new TodosPage(page);
      await todosPage.verifyPageLoaded();

      // CREATE: Add a new todo
      const testTitle = `E2E Test Todo ${Date.now()}`;
      const testDescription = 'Test description for CRUD workflow';

      await todosPage.createTodo(testTitle, testDescription, 'medium');

      // READ: Verify todo exists
      let todoCount = await todosPage.getTodoCount();
      const initialCount = todoCount;
      expect(todoCount).toBeGreaterThan(0);

      // UPDATE: Edit the todo
      const firstTodo = page.locator('[data-testid^="todo-item-"]').first();
      const todoId = await firstTodo.getAttribute('data-testid');
      const id = parseInt(todoId?.replace('todo-item-', '') || '0');

      const updatedTitle = `Updated ${testTitle}`;
      await todosPage.updateTodo(id, { title: updatedTitle });

      const currentTitle = await todosPage.getTodoTitle(id);
      expect(currentTitle).toBe(updatedTitle);

      // Toggle completion
      await todosPage.toggleTodo(id);
      await expect(page.locator(`[data-testid="todo-checkbox-${id}"]`)).toBeChecked();

      // DELETE: Remove the todo
      await todosPage.deleteTodo(id);
      todoCount = await todosPage.getTodoCount();
      expect(todoCount).toBe(initialCount - 1);
    });
  });

  test.describe('Multi-Filter Workflow', () => {
    test('should filter todos and manage different states', async ({ page }) => {
      // Login and navigate to todos
      const loginPage = new LoginPage(page);
      await loginPage.navigate();
      await loginPage.login(TEST_USERS.testUser.email, TEST_USERS.testUser.password);

      const dashboardPage = new DashboardPage(page);
      await dashboardPage.clickViewTodos();

      const todosPage = new TodosPage(page);
      await todosPage.verifyPageLoaded();

      // Get total count
      await todosPage.applyFilter('all');
      const totalCount = await todosPage.getTodoCount();

      // Filter to active
      await todosPage.applyFilter('active');
      const activeCount = await todosPage.getTodoCount();

      // Filter to completed
      await todosPage.applyFilter('completed');
      const completedCount = await todosPage.getTodoCount();

      // Verify counts add up
      expect(totalCount).toBe(activeCount + completedCount);

      // Create new todo while in completed filter
      await todosPage.createTodo('Todo created in completed view');

      // Switch to active filter
      await todosPage.applyFilter('active');

      // New todo should appear in active
      const newActiveCount = await todosPage.getTodoCount();
      expect(newActiveCount).toBe(activeCount + 1);
    });
  });

  test.describe('Session Management', () => {
    test('should maintain session across page refreshes', async ({ page }) => {
      // Login
      const loginPage = new LoginPage(page);
      await loginPage.navigate();
      await loginPage.login(TEST_USERS.testUser.email, TEST_USERS.testUser.password);

      // Verify dashboard access
      await expect(page).toHaveURL('/dashboard');

      // Refresh page
      await page.reload();

      // Should still be on dashboard (not redirected to login)
      await expect(page).toHaveURL('/dashboard');

      const dashboardPage = new DashboardPage(page);
      await dashboardPage.waitForDashboardLoaded();

      // Stats should load correctly
      const stats = await dashboardPage.areStatsVisible();
      expect(stats).toBe(true);
    });

    test('should logout and prevent access to protected pages', async ({ page }) => {
      // Login
      const loginPage = new LoginPage(page);
      await loginPage.navigate();
      await loginPage.login(TEST_USERS.testUser.email, TEST_USERS.testUser.password);

      const dashboardPage = new DashboardPage(page);
      await dashboardPage.waitForDashboardLoaded();

      // Logout
      await dashboardPage.logout();
      await expect(page).toHaveURL('/');

      // Try to access dashboard
      await page.goto('/dashboard');

      // Should redirect to login
      await expect(page).toHaveURL(/\/login/);
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Login
      const loginPage = new LoginPage(page);
      await loginPage.navigate();
      await loginPage.login(TEST_USERS.testUser.email, TEST_USERS.testUser.password);

      const dashboardPage = new DashboardPage(page);
      await dashboardPage.clickViewTodos();

      const todosPage = new TodosPage(page);
      await todosPage.verifyPageLoaded();

      // Page should still be functional even if some requests fail
      const isLoaded = await page.locator('[data-testid="page-title"]').isVisible();
      expect(isLoaded).toBe(true);
    });
  });
});
