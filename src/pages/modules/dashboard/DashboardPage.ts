import { Page, expect } from '@playwright/test';
import { BasePage } from '../../base/BasePage';

/**
 * Dashboard Page Object
 *
 * Represents the authenticated user's dashboard.
 * Displays todo statistics and provides navigation to other features.
 *
 * URL: /dashboard
 *
 * @example
 * ```typescript
 * const dashboardPage = new DashboardPage(page);
 * await dashboardPage.navigate();
 * const total = await dashboardPage.getTotalTodos();
 * ```
 */
export class DashboardPage extends BasePage {
  /**
   * Page Selectors
   * Centralized selector definitions using data-testid attributes
   */
  private readonly selectors = {
    // Page elements
    pageTitle: '[data-testid="page-title"]',
    welcomeMessage: '[data-testid="welcome-message"]',

    // Stats cards
    totalTodosCard: '[data-testid="stat-total"]',
    activeTodosCard: '[data-testid="stat-active"]',
    completedTodosCard: '[data-testid="stat-completed"]',

    // Stat values are accessed via methods that use the card selectors above

    // Navigation
    viewTodosButton: '[data-testid="view-todos-button"]',
    logoutButton: '[data-testid="logout-button"]',
    todosLink: 'a[href="/todos"]',

    // Loading state
    loadingSpinner: '[data-testid="loading"]',
  };

  /**
   * Constructor
   *
   * @param page - Playwright Page object
   */
  constructor(page: Page) {
    super(page, '/dashboard');
  }

  /**
   * Wait for page to finish loading
   *
   * @returns Promise that resolves when loading is complete
   *
   * @example
   * ```typescript
   * await dashboardPage.waitForDashboardLoaded();
   * ```
   */
  async waitForDashboardLoaded(): Promise<void> {
    // Wait for loading spinner to disappear if present
    const loadingSpinner = this.page.locator(this.selectors.loadingSpinner);
    const isLoadingVisible = await loadingSpinner.isVisible().catch(() => false);

    if (isLoadingVisible) {
      await loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 });
    }

    // Wait for stats API call to complete
    await this.page
      .waitForResponse(
        (response) => response.url().includes('/api/todos/stats') && response.status() === 200,
        { timeout: 10000 }
      )
      .catch(() => {
        // If the response already happened, continue
      });

    // Wait for stats cards to be visible with retry logic
    // The element might not be immediately visible after API response
    await this.page.waitForSelector(this.selectors.totalTodosCard, { 
      state: 'visible', 
      timeout: 15000 
    }).catch(async () => {
      // If still not visible, wait a bit more for React to render
      await this.page.waitForTimeout(500);
      await this.page.waitForSelector(this.selectors.totalTodosCard, { 
        state: 'visible', 
        timeout: 10000 
      });
    });
  }

  /**
   * Get total todos count
   *
   * @returns Total number of todos
   *
   * @example
   * ```typescript
   * const total = await dashboardPage.getTotalTodos();
   * expect(total).toBeGreaterThan(0);
   * ```
   */
  async getTotalTodos(): Promise<number> {
    const card = this.page.locator(this.selectors.totalTodosCard);
    const valueDiv = card.locator('div').first();
    const text = await valueDiv.textContent();
    return parseInt(text || '0', 10);
  }

  /**
   * Get active todos count
   *
   * @returns Number of active todos
   *
   * @example
   * ```typescript
   * const active = await dashboardPage.getActiveTodos();
   * ```
   */
  async getActiveTodos(): Promise<number> {
    const card = this.page.locator(this.selectors.activeTodosCard);
    const valueDiv = card.locator('div').first();
    const text = await valueDiv.textContent();
    return parseInt(text || '0', 10);
  }

  /**
   * Get completed todos count
   *
   * @returns Number of completed todos
   *
   * @example
   * ```typescript
   * const completed = await dashboardPage.getCompletedTodos();
   * ```
   */
  async getCompletedTodos(): Promise<number> {
    const card = this.page.locator(this.selectors.completedTodosCard);
    const valueDiv = card.locator('div').first();
    const text = await valueDiv.textContent();
    return parseInt(text || '0', 10);
  }

  /**
   * Get welcome message text
   *
   * @returns Welcome message text
   *
   * @example
   * ```typescript
   * const message = await dashboardPage.getWelcomeMessage();
   * expect(message).toContain('Welcome');
   * ```
   */
  async getWelcomeMessage(): Promise<string> {
    return this.getTextContent(this.selectors.welcomeMessage);
  }

  /**
   * Click "View Todos" button
   *
   * @returns Promise that resolves when button is clicked
   *
   * @example
   * ```typescript
   * await dashboardPage.clickViewTodos();
   * await expect(page).toHaveURL(/todos/);
   * ```
   */
  async clickViewTodos(): Promise<void> {
    await this.clickElement(this.selectors.viewTodosButton);
  }

  /**
   * Click "Logout" button
   *
   * @returns Promise that resolves when button is clicked
   *
   * @example
   * ```typescript
   * await dashboardPage.logout();
   * await expect(page).toHaveURL(/^\//);
   * ```
   */
  async logout(): Promise<void> {
    await this.clickElement(this.selectors.logoutButton);
  }

  /**
   * Navigate to todos page via link
   *
   * @returns Promise that resolves when navigation is complete
   *
   * @example
   * ```typescript
   * await dashboardPage.navigateToTodos();
   * ```
   */
  async navigateToTodos(): Promise<void> {
    await this.clickElement(this.selectors.todosLink);
    await this.waitForUrl('/todos');
  }

  /**
   * Check if stats are displayed
   *
   * @returns True if all stats are visible
   *
   * @example
   * ```typescript
   * const statsVisible = await dashboardPage.areStatsVisible();
   * expect(statsVisible).toBe(true);
   * ```
   */
  async areStatsVisible(): Promise<boolean> {
    const totalVisible = await this.isElementVisible(this.selectors.totalTodosCard);
    const activeVisible = await this.isElementVisible(this.selectors.activeTodosCard);
    const completedVisible = await this.isElementVisible(this.selectors.completedTodosCard);

    return totalVisible && activeVisible && completedVisible;
  }

  /**
   * Verify page loaded correctly
   *
   * @returns Promise that resolves when page is verified
   *
   * @example
   * ```typescript
   * await dashboardPage.navigate();
   * await dashboardPage.verifyPageLoaded();
   * ```
   */
  async verifyPageLoaded(): Promise<void> {
    await super.verifyPageLoaded();
    await this.waitForDashboardLoaded();
    await this.waitForSelector(this.selectors.pageTitle);
  }

  /**
   * Assertions
   * Methods for validating dashboard state
   */

  /**
   * Expect stats cards to be visible
   *
   * @returns Promise that resolves when assertion passes
   *
   * @example
   * ```typescript
   * await dashboardPage.expectStatsVisible();
   * ```
   */
  async expectStatsVisible(): Promise<void> {
    await expect(this.page.locator(this.selectors.totalTodosCard)).toBeVisible();
    await expect(this.page.locator(this.selectors.activeTodosCard)).toBeVisible();
    await expect(this.page.locator(this.selectors.completedTodosCard)).toBeVisible();
  }

  /**
   * Expect specific todo counts
   *
   * @param expected - Expected todo counts
   * @returns Promise that resolves when assertion passes
   *
   * @example
   * ```typescript
   * await dashboardPage.expectTodoCounts({ total: 10, active: 5, completed: 5 });
   * ```
   */
  async expectTodoCounts(expected: {
    total?: number;
    active?: number;
    completed?: number;
  }): Promise<void> {
    if (expected.total !== undefined) {
      const total = await this.getTotalTodos();
      expect(total).toBe(expected.total);
    }

    if (expected.active !== undefined) {
      const active = await this.getActiveTodos();
      expect(active).toBe(expected.active);
    }

    if (expected.completed !== undefined) {
      const completed = await this.getCompletedTodos();
      expect(completed).toBe(expected.completed);
    }
  }

  /**
   * Expect welcome message to contain text
   *
   * @param expectedText - Expected text in welcome message
   * @returns Promise that resolves when assertion passes
   *
   * @example
   * ```typescript
   * await dashboardPage.expectWelcomeMessage('Test User');
   * ```
   */
  async expectWelcomeMessage(expectedText: string): Promise<void> {
    const message = this.page.locator(this.selectors.welcomeMessage);
    await expect(message).toContainText(expectedText);
  }
}
