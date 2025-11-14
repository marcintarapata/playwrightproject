import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from '../../base/BasePage';

/**
 * Priority type for todos
 */
export type TodoPriority = 'low' | 'medium' | 'high';

/**
 * Filter type for todos
 */
export type TodoFilter = 'all' | 'active' | 'completed';

/**
 * Todos Page Object
 *
 * Represents the todos management page with full CRUD functionality.
 * Provides methods for creating, reading, updating, and deleting todos.
 *
 * URL: /todos
 *
 * @example
 * ```typescript
 * const todosPage = new TodosPage(page);
 * await todosPage.navigate();
 * await todosPage.createTodo('Buy milk', 'Get milk from store', 'high');
 * ```
 */
export class TodosPage extends BasePage {
  /**
   * Page Selectors
   * Centralized selector definitions using data-testid attributes
   */
  private readonly selectors = {
    // Page elements
    pageTitle: 'h1', // "My Todos" heading
    backToDashboard: 'a[href="/dashboard"]', // "← Back to Dashboard" link

    // Form elements
    titleInput: '[data-testid="todo-title-input"]',
    descriptionInput: '[data-testid="todo-description-input"]',
    prioritySelect: '[data-testid="todo-priority-select"]',
    addButton: '[data-testid="create-todo-button"]',

    // Filter buttons
    filterAll: '[data-testid="filter-all"]',
    filterActive: '[data-testid="filter-active"]',
    filterCompleted: '[data-testid="filter-completed"]',

    // Todo items
    todoItems: '[data-testid^="todo-item-"]',
    todoTitle: (id: number) => `[data-testid="todo-title-${id}"]`,
    todoDescription: (id: number) => `[data-testid="todo-description-${id}"]`,
    todoPriority: (id: number) => `[data-testid="todo-priority-${id}"]`,
    todoCheckbox: (id: number) => `[data-testid="todo-checkbox-${id}"]`,
    todoEditButton: (id: number) => `[data-testid="todo-edit-${id}"]`,
    todoDeleteButton: (id: number) => `[data-testid="todo-delete-${id}"]`,

    // Edit mode
    editTitleInput: (id: number) => `[data-testid="edit-title-${id}"]`,
    editDescriptionInput: (id: number) => `[data-testid="edit-description-${id}"]`,
    editPrioritySelect: (id: number) => `[data-testid="edit-priority-${id}"]`,
    saveEditButton: (id: number) => `[data-testid="save-edit-${id}"]`,
    cancelEditButton: (id: number) => `[data-testid="cancel-edit-${id}"]`,

    // Empty state
    emptyState: '[data-testid="empty-state"]',

    // Loading state
    loadingSpinner: '[data-testid="loading"]',
  };

  /**
   * Constructor
   *
   * @param page - Playwright Page object
   */
  constructor(page: Page) {
    super(page, '/todos');
  }

  /**
   * Wait for page to finish loading
   *
   * @returns Promise that resolves when loading is complete
   *
   * @example
   * ```typescript
   * await todosPage.waitForTodosLoaded();
   * ```
   */
  async waitForTodosLoaded(): Promise<void> {
    // Wait for loading spinner to disappear if present
    const loadingSpinner = this.page.locator(this.selectors.loadingSpinner);
    const isLoadingVisible = await loadingSpinner.isVisible().catch(() => false);

    if (isLoadingVisible) {
      await loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 });
    }

    // Wait for todos API call to complete
    await this.page
      .waitForResponse(
        (response) => response.url().includes('/api/todos') && response.status() === 200,
        { timeout: 10000 }
      )
      .catch(() => {
        // If the response already happened, continue
      });

    // Wait for either todos list or empty state to be visible
    await Promise.race([
      this.page
        .locator('[data-testid="todos-list"]')
        .waitFor({ state: 'visible', timeout: 5000 })
        .catch(() => {}),
      this.page
        .locator(this.selectors.emptyState)
        .waitFor({ state: 'visible', timeout: 5000 })
        .catch(() => {}),
    ]);
  }

  /**
   * Create a new todo
   *
   * @param title - Todo title
   * @param description - Todo description (optional)
   * @param priority - Todo priority (default: 'medium')
   * @returns Promise that resolves when todo is created
   *
   * @example
   * ```typescript
   * await todosPage.createTodo('Buy groceries', 'Milk, eggs, bread', 'high');
   * ```
   */
  async createTodo(
    title: string,
    description: string = '',
    priority: TodoPriority = 'medium'
  ): Promise<void> {
    await this.fillInput(this.selectors.titleInput, title);

    if (description) {
      await this.fillInput(this.selectors.descriptionInput, description);
    }

    await this.selectOption(this.selectors.prioritySelect, priority);

    // Wait for both POST (create) and GET (refresh list) requests to complete
    const postPromise = this.page.waitForResponse(
      (response) =>
        response.url().includes('/api/todos') &&
        response.request().method() === 'POST' &&
        response.status() === 200,
      { timeout: 10000 }
    );

    await this.clickElement(this.selectors.addButton);

    // Wait for POST to complete
    await postPromise.catch(() => {
      // If response already happened, continue
    });

    // Wait for GET request that refreshes the list after creation
    await this.page
      .waitForResponse(
        (response) =>
          response.url().includes('/api/todos') &&
          response.request().method() === 'GET' &&
          response.status() === 200,
        { timeout: 10000 }
      )
      .catch(() => {
        // If response already happened, continue
      });
  }

  /**
   * Get all visible todo items
   *
   * @returns Array of todo locators
   *
   * @example
   * ```typescript
   * const todos = await todosPage.getAllTodos();
   * expect(todos.length).toBeGreaterThan(0);
   * ```
   */
  async getAllTodos(): Promise<Locator[]> {
    const todoElements = this.page.locator(this.selectors.todoItems);
    const count = await todoElements.count();
    const todos: Locator[] = [];

    for (let i = 0; i < count; i++) {
      todos.push(todoElements.nth(i));
    }

    return todos;
  }

  /**
   * Get count of visible todos
   *
   * @returns Number of todos
   *
   * @example
   * ```typescript
   * const count = await todosPage.getTodoCount();
   * ```
   */
  async getTodoCount(): Promise<number> {
    const todos = this.page.locator(this.selectors.todoItems);
    return todos.count();
  }

  /**
   * Toggle todo completion status
   *
   * @param todoId - ID of the todo to toggle
   * @returns Promise that resolves when todo is toggled
   *
   * @example
   * ```typescript
   * await todosPage.toggleTodo(1);
   * ```
   */
  async toggleTodo(todoId: number): Promise<void> {
    // Wait for both PATCH (toggle) and GET (refresh list) requests to complete
    const patchPromise = this.page.waitForResponse(
      (response) =>
        response.url().includes(`/api/todos/${todoId}`) &&
        response.request().method() === 'PATCH' &&
        response.status() === 200,
      { timeout: 10000 }
    );

    await this.clickElement(this.selectors.todoCheckbox(todoId));

    // Wait for PATCH to complete
    await patchPromise.catch(() => {
      // If response already happened, continue
    });

    // Wait for GET request that refreshes the list after toggle
    await this.page
      .waitForResponse(
        (response) =>
          response.url().includes('/api/todos') &&
          response.request().method() === 'GET' &&
          response.status() === 200,
        { timeout: 10000 }
      )
      .catch(() => {
        // If response already happened, continue
      });
  }

  /**
   * Delete a todo
   *
   * @param todoId - ID of the todo to delete
   * @returns Promise that resolves when todo is deleted
   *
   * @example
   * ```typescript
   * await todosPage.deleteTodo(1);
   * ```
   */
  async deleteTodo(todoId: number): Promise<void> {
    await this.clickElement(this.selectors.todoDeleteButton(todoId));
    await this.wait(300);
  }

  /**
   * Start editing a todo
   *
   * @param todoId - ID of the todo to edit
   * @returns Promise that resolves when edit mode is activated
   *
   * @example
   * ```typescript
   * await todosPage.startEditTodo(1);
   * ```
   */
  async startEditTodo(todoId: number): Promise<void> {
    await this.clickElement(this.selectors.todoEditButton(todoId));
    await this.waitForSelector(this.selectors.editTitleInput(todoId));
  }

  /**
   * Update a todo
   *
   * @param todoId - ID of the todo to update
   * @param updates - Fields to update
   * @returns Promise that resolves when todo is updated
   *
   * @example
   * ```typescript
   * await todosPage.updateTodo(1, { title: 'Updated title', priority: 'high' });
   * ```
   */
  async updateTodo(
    todoId: number,
    updates: {
      title?: string;
      description?: string;
      priority?: TodoPriority;
    }
  ): Promise<void> {
    await this.startEditTodo(todoId);

    if (updates.title !== undefined) {
      await this.fillInput(this.selectors.editTitleInput(todoId), updates.title);
    }

    if (updates.description !== undefined) {
      await this.fillInput(this.selectors.editDescriptionInput(todoId), updates.description);
    }

    if (updates.priority !== undefined) {
      await this.selectOption(this.selectors.editPrioritySelect(todoId), updates.priority);
    }

    await this.clickElement(this.selectors.saveEditButton(todoId));
    await this.wait(300);
  }

  /**
   * Cancel editing a todo
   *
   * @param todoId - ID of the todo being edited
   * @returns Promise that resolves when edit is cancelled
   *
   * @example
   * ```typescript
   * await todosPage.cancelEditTodo(1);
   * ```
   */
  async cancelEditTodo(todoId: number): Promise<void> {
    await this.clickElement(this.selectors.cancelEditButton(todoId));
    await this.wait(300);
  }

  /**
   * Apply filter to todos
   *
   * @param filter - Filter type ('all', 'active', 'completed')
   * @returns Promise that resolves when filter is applied
   *
   * @example
   * ```typescript
   * await todosPage.applyFilter('active');
   * ```
   */
  async applyFilter(filter: TodoFilter): Promise<void> {
    const selectorMap = {
      all: this.selectors.filterAll,
      active: this.selectors.filterActive,
      completed: this.selectors.filterCompleted,
    };

    await this.clickElement(selectorMap[filter]);
    await this.wait(300);
  }

  /**
   * Get todo title by ID
   *
   * @param todoId - ID of the todo
   * @returns Todo title text
   *
   * @example
   * ```typescript
   * const title = await todosPage.getTodoTitle(1);
   * ```
   */
  async getTodoTitle(todoId: number): Promise<string> {
    return this.getTextContent(this.selectors.todoTitle(todoId));
  }

  /**
   * Get todo description by ID
   *
   * @param todoId - ID of the todo
   * @returns Todo description text
   *
   * @example
   * ```typescript
   * const description = await todosPage.getTodoDescription(1);
   * ```
   */
  async getTodoDescription(todoId: number): Promise<string> {
    return this.getTextContent(this.selectors.todoDescription(todoId));
  }

  /**
   * Check if todo is completed
   *
   * @param todoId - ID of the todo
   * @returns True if todo is completed
   *
   * @example
   * ```typescript
   * const isCompleted = await todosPage.isTodoCompleted(1);
   * ```
   */
  async isTodoCompleted(todoId: number): Promise<boolean> {
    const checkbox = this.page.locator(this.selectors.todoCheckbox(todoId));
    return checkbox.isChecked();
  }

  /**
   * Check if empty state is visible
   *
   * @returns True if empty state is shown
   *
   * @example
   * ```typescript
   * const isEmpty = await todosPage.isEmptyStateVisible();
   * ```
   */
  async isEmptyStateVisible(): Promise<boolean> {
    return this.isElementVisible(this.selectors.emptyState);
  }

  /**
   * Navigate back to dashboard
   *
   * @returns Promise that resolves when navigation is complete
   *
   * @example
   * ```typescript
   * await todosPage.backToDashboard();
   * ```
   */
  async backToDashboard(): Promise<void> {
    await this.clickElement(this.selectors.backToDashboard);
    await this.waitForUrl('/dashboard');
  }

  /**
   * Verify page loaded correctly
   *
   * @returns Promise that resolves when page is verified
   *
   * @example
   * ```typescript
   * await todosPage.navigate();
   * await todosPage.verifyPageLoaded();
   * ```
   */
  async verifyPageLoaded(): Promise<void> {
    await super.verifyPageLoaded();
    await this.waitForTodosLoaded();
    await this.waitForSelector(this.selectors.pageTitle);
    await this.waitForSelector(this.selectors.titleInput);
  }

  /**
   * Assertions
   * Methods for validating todos page state
   */

  /**
   * Expect specific number of todos
   *
   * @param count - Expected number of todos
   * @returns Promise that resolves when assertion passes
   *
   * @example
   * ```typescript
   * await todosPage.expectTodoCount(5);
   * ```
   */
  async expectTodoCount(count: number): Promise<void> {
    const todos = this.page.locator(this.selectors.todoItems);
    await expect(todos).toHaveCount(count);
  }

  /**
   * Expect empty state to be visible
   *
   * @returns Promise that resolves when assertion passes
   *
   * @example
   * ```typescript
   * await todosPage.expectEmptyState();
   * ```
   */
  async expectEmptyState(): Promise<void> {
    await expect(this.page.locator(this.selectors.emptyState)).toBeVisible();
  }

  /**
   * Expect todo to have specific title
   *
   * @param todoId - ID of the todo
   * @param expectedTitle - Expected title text
   * @returns Promise that resolves when assertion passes
   *
   * @example
   * ```typescript
   * await todosPage.expectTodoTitle(1, 'Buy milk');
   * ```
   */
  async expectTodoTitle(todoId: number, expectedTitle: string): Promise<void> {
    const title = this.page.locator(this.selectors.todoTitle(todoId));
    await expect(title).toHaveText(expectedTitle);
  }

  /**
   * Expect todo to be completed
   *
   * @param todoId - ID of the todo
   * @returns Promise that resolves when assertion passes
   *
   * @example
   * ```typescript
   * await todosPage.expectTodoCompleted(1);
   * ```
   */
  async expectTodoCompleted(todoId: number): Promise<void> {
    const checkbox = this.page.locator(this.selectors.todoCheckbox(todoId));
    await expect(checkbox).toBeChecked();
  }

  /**
   * Expect todo to be active (not completed)
   *
   * @param todoId - ID of the todo
   * @returns Promise that resolves when assertion passes
   *
   * @example
   * ```typescript
   * await todosPage.expectTodoActive(1);
   * ```
   */
  async expectTodoActive(todoId: number): Promise<void> {
    const checkbox = this.page.locator(this.selectors.todoCheckbox(todoId));
    await expect(checkbox).not.toBeChecked();
  }
}
