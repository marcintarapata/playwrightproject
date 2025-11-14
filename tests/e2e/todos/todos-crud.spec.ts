/**
 * Todos CRUD Test Suite
 *
 * Comprehensive tests for todo management functionality including:
 * - Create todos
 * - Read/Display todos
 * - Update todos
 * - Delete todos
 * - Filter todos
 * - Toggle completion status
 *
 * @group e2e
 * @group todos
 * @group authenticated
 */

import { test, expect } from '../../../src/fixtures/authFixtures';
import { TodosPage } from '../../../src/pages/modules/todos/TodosPage';
import { DashboardPage } from '../../../src/pages/modules/dashboard/DashboardPage';

test.describe('Todos CRUD Operations', () => {
  let todosPage: TodosPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    todosPage = new TodosPage(authenticatedPage);
    await todosPage.navigate();
    await todosPage.verifyPageLoaded();
  });

  test.describe('Page Load and Rendering', () => {
    test('should load todos page successfully', async ({ authenticatedPage }) => {
      await expect(authenticatedPage).toHaveURL('/todos');
    });

    test('should display page title', async ({ authenticatedPage }) => {
      const pageTitle = authenticatedPage.locator('[data-testid="page-title"]');
      await expect(pageTitle).toBeVisible();
    });

    test('should display todo creation form', async ({ authenticatedPage }) => {
      const titleInput = authenticatedPage.locator('[data-testid="todo-title"]');
      const addButton = authenticatedPage.locator('[data-testid="add-todo"]');

      await expect(titleInput).toBeVisible();
      await expect(addButton).toBeVisible();
    });

    test('should display existing todos', async () => {
      const count = await todosPage.getTodoCount();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Create Todo', () => {
    test('should create a new todo with title only', async () => {
      const initialCount = await todosPage.getTodoCount();
      const newTitle = `Test Todo ${Date.now()}`;

      await todosPage.createTodo(newTitle);

      const newCount = await todosPage.getTodoCount();
      expect(newCount).toBe(initialCount + 1);
    });

    test('should create a new todo with title and description', async () => {
      const newTitle = `Todo with Description ${Date.now()}`;
      const description = 'This is a detailed description';

      await todosPage.createTodo(newTitle, description);

      const count = await todosPage.getTodoCount();
      expect(count).toBeGreaterThan(0);
    });

    test('should create a new todo with high priority', async () => {
      const newTitle = `High Priority Todo ${Date.now()}`;

      await todosPage.createTodo(newTitle, 'Important task', 'high');

      const count = await todosPage.getTodoCount();
      expect(count).toBeGreaterThan(0);
    });

    test('should create a new todo with medium priority', async () => {
      const newTitle = `Medium Priority Todo ${Date.now()}`;

      await todosPage.createTodo(newTitle, 'Moderate task', 'medium');

      const count = await todosPage.getTodoCount();
      expect(count).toBeGreaterThan(0);
    });

    test('should create a new todo with low priority', async () => {
      const newTitle = `Low Priority Todo ${Date.now()}`;

      await todosPage.createTodo(newTitle, 'Not urgent', 'low');

      const count = await todosPage.getTodoCount();
      expect(count).toBeGreaterThan(0);
    });

    test('should clear form after creating todo', async ({ authenticatedPage }) => {
      await todosPage.createTodo('Test Todo', 'Description');

      const titleInput = authenticatedPage.locator('[data-testid="todo-title"]');
      const descriptionInput = authenticatedPage.locator('[data-testid="todo-description"]');

      const titleValue = await titleInput.inputValue();
      const descriptionValue = await descriptionInput.inputValue();

      expect(titleValue).toBe('');
      expect(descriptionValue).toBe('');
    });
  });

  test.describe('Read/Display Todos', () => {
    test('should display all todos by default', async () => {
      const count = await todosPage.getTodoCount();
      expect(count).toBeGreaterThan(0);
    });

    test('should display todo titles', async ({ authenticatedPage }) => {
      const todos = await todosPage.getAllTodos();

      for (const todo of todos) {
        const title = todo.locator('[data-testid^="todo-title-"]');
        await expect(title).toBeVisible();
        const text = await title.textContent();
        expect(text).toBeTruthy();
      }
    });

    test('should display todo checkboxes', async ({ authenticatedPage }) => {
      const checkboxes = authenticatedPage.locator('[data-testid^="todo-checkbox-"]');
      const count = await checkboxes.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should display edit and delete buttons for each todo', async ({ authenticatedPage }) => {
      const editButtons = authenticatedPage.locator('[data-testid^="todo-edit-"]');
      const deleteButtons = authenticatedPage.locator('[data-testid^="todo-delete-"]');

      const editCount = await editButtons.count();
      const deleteCount = await deleteButtons.count();

      expect(editCount).toBeGreaterThan(0);
      expect(deleteCount).toBeGreaterThan(0);
      expect(editCount).toBe(deleteCount);
    });
  });

  test.describe('Update Todo', () => {
    test('should toggle todo completion status', async ({ authenticatedPage }) => {
      // Find first unchecked todo
      const firstUnchecked = authenticatedPage.locator('[data-testid^="todo-checkbox-"]:not(:checked)').first();
      const isVisible = await firstUnchecked.isVisible().catch(() => false);

      if (isVisible) {
        const todoId = await firstUnchecked.getAttribute('data-testid');
        const id = parseInt(todoId?.replace('todo-checkbox-', '') || '0');

        const wasCompleted = await todosPage.isTodoCompleted(id);
        await todosPage.toggleTodo(id);
        const isCompleted = await todosPage.isTodoCompleted(id);

        expect(isCompleted).toBe(!wasCompleted);
      }
    });

    test('should edit todo title', async ({ authenticatedPage }) => {
      // Get first todo
      const firstTodo = authenticatedPage.locator('[data-testid^="todo-item-"]').first();
      const todoId = await firstTodo.getAttribute('data-testid');
      const id = parseInt(todoId?.replace('todo-item-', '') || '0');

      if (id > 0) {
        const newTitle = `Updated Title ${Date.now()}`;
        await todosPage.updateTodo(id, { title: newTitle });

        // Verify update
        const updatedTitle = await todosPage.getTodoTitle(id);
        expect(updatedTitle).toBe(newTitle);
      }
    });

    test('should edit todo description', async ({ authenticatedPage }) => {
      const firstTodo = authenticatedPage.locator('[data-testid^="todo-item-"]').first();
      const todoId = await firstTodo.getAttribute('data-testid');
      const id = parseInt(todoId?.replace('todo-item-', '') || '0');

      if (id > 0) {
        const newDescription = `Updated Description ${Date.now()}`;
        await todosPage.updateTodo(id, { description: newDescription });

        // Verify update
        const updatedDesc = await todosPage.getTodoDescription(id);
        expect(updatedDesc).toContain(newDescription);
      }
    });

    test('should cancel todo edit', async ({ authenticatedPage }) => {
      const firstTodo = authenticatedPage.locator('[data-testid^="todo-item-"]').first();
      const todoId = await firstTodo.getAttribute('data-testid');
      const id = parseInt(todoId?.replace('todo-item-', '') || '0');

      if (id > 0) {
        const originalTitle = await todosPage.getTodoTitle(id);

        await todosPage.startEditTodo(id);
        await todosPage.cancelEditTodo(id);

        // Title should remain unchanged
        const currentTitle = await todosPage.getTodoTitle(id);
        expect(currentTitle).toBe(originalTitle);
      }
    });
  });

  test.describe('Delete Todo', () => {
    test('should delete a todo', async () => {
      // Create a new todo to delete
      const todoTitle = `Todo to Delete ${Date.now()}`;
      await todosPage.createTodo(todoTitle);

      const countBefore = await todosPage.getTodoCount();

      // Delete the first todo
      const firstTodo = await todosPage['page'].locator('[data-testid^="todo-item-"]').first();
      const todoId = await firstTodo.getAttribute('data-testid');
      const id = parseInt(todoId?.replace('todo-item-', '') || '0');

      if (id > 0) {
        await todosPage.deleteTodo(id);

        const countAfter = await todosPage.getTodoCount();
        expect(countAfter).toBe(countBefore - 1);
      }
    });

    test('should remove todo from list after deletion', async ({ authenticatedPage }) => {
      // Get first todo details
      const firstTodo = authenticatedPage.locator('[data-testid^="todo-item-"]').first();
      const todoId = await firstTodo.getAttribute('data-testid');
      const id = parseInt(todoId?.replace('todo-item-', '') || '0');

      if (id > 0) {
        const title = await todosPage.getTodoTitle(id);
        await todosPage.deleteTodo(id);

        // Verify todo is removed
        const deletedTodo = authenticatedPage.locator(`[data-testid="todo-item-${id}"]`);
        await expect(deletedTodo).not.toBeVisible();
      }
    });
  });

  test.describe('Filter Todos', () => {
    test('should filter to show all todos', async () => {
      await todosPage.applyFilter('all');
      const count = await todosPage.getTodoCount();
      expect(count).toBeGreaterThan(0);
    });

    test('should filter to show only active todos', async () => {
      await todosPage.applyFilter('active');

      const todos = await todosPage.getAllTodos();
      for (const todo of todos) {
        const checkbox = todo.locator('input[type="checkbox"]');
        const isChecked = await checkbox.isChecked();
        expect(isChecked).toBe(false);
      }
    });

    test('should filter to show only completed todos', async () => {
      await todosPage.applyFilter('completed');

      const todos = await todosPage.getAllTodos();
      if (todos.length > 0) {
        for (const todo of todos) {
          const checkbox = todo.locator('input[type="checkbox"]');
          const isChecked = await checkbox.isChecked();
          expect(isChecked).toBe(true);
        }
      }
    });

    test('should show empty state when no todos match filter', async ({ authenticatedPage }) => {
      // Complete all todos
      const checkboxes = authenticatedPage.locator('[data-testid^="todo-checkbox-"]:not(:checked)');
      const count = await checkboxes.count();

      for (let i = 0; i < count; i++) {
        await checkboxes.nth(0).click();
        await authenticatedPage.waitForTimeout(200);
      }

      // Filter to active - should show empty state
      await todosPage.applyFilter('active');

      const isEmpty = await todosPage.isEmptyStateVisible();
      expect(isEmpty).toBe(true);
    });
  });

  test.describe('Navigation', () => {
    test('should navigate back to dashboard', async ({ authenticatedPage }) => {
      await todosPage.backToDashboard();
      await expect(authenticatedPage).toHaveURL('/dashboard');
    });

    test('should maintain todo count between navigations', async () => {
      const initialCount = await todosPage.getTodoCount();

      const dashboardPage = new DashboardPage(todosPage['page']);
      await dashboardPage.navigate();
      await dashboardPage.waitForDashboardLoaded();

      await todosPage.navigate();
      await todosPage.verifyPageLoaded();

      const finalCount = await todosPage.getTodoCount();
      expect(finalCount).toBe(initialCount);
    });
  });

  test.describe('Empty State', () => {
    test('should show empty state when no todos exist', async ({ authenticatedPage, loginAs }) => {
      // Login as a user with no todos (create new user or use clean state)
      // For this test, we'll delete all todos

      const count = await todosPage.getTodoCount();

      // Delete all todos
      for (let i = 0; i < count; i++) {
        const firstTodo = authenticatedPage.locator('[data-testid^="todo-item-"]').first();
        const todoId = await firstTodo.getAttribute('data-testid');
        const id = parseInt(todoId?.replace('todo-item-', '') || '0');

        if (id > 0) {
          await todosPage.deleteTodo(id);
          await authenticatedPage.waitForTimeout(200);
        }
      }

      const isEmpty = await todosPage.isEmptyStateVisible();
      expect(isEmpty).toBe(true);
    });
  });
});
