import { Page, Locator, expect } from '@playwright/test';
import { TIMEOUTS } from '../../utils/constants';

/**
 * BasePage Class
 *
 * This is the foundational class for all Page Object Models in the framework.
 * It provides common functionality and utilities that are shared across all pages.
 *
 * Key Features:
 * - Centralized page navigation
 * - Common wait strategies
 * - Reusable interaction methods
 * - Error handling and logging
 * - Screenshot capabilities
 *
 * All page objects should extend this class to inherit common functionality.
 *
 * @example
 * ```typescript
 * export class LoginPage extends BasePage {
 *   constructor(page: Page) {
 *     super(page, '/login');
 *   }
 * }
 * ```
 */
export class BasePage {
  /**
   * Playwright Page object
   * @protected - Available to child classes
   */
  protected readonly page: Page;

  /**
   * Page URL path (relative to baseURL)
   * @protected - Available to child classes
   */
  protected readonly path: string;

  /**
   * Constructor
   *
   * @param page - Playwright Page object
   * @param path - Relative URL path for the page (e.g., '/login', '/dashboard')
   */
  constructor(page: Page, path: string = '/') {
    this.page = page;
    this.path = path;
  }

  /**
   * Navigate to the page
   *
   * Uses the path defined in the constructor to navigate to the page.
   * Waits for the page to be fully loaded before returning.
   *
   * @param options - Navigation options
   * @returns Promise that resolves when navigation is complete
   *
   * @example
   * ```typescript
   * const loginPage = new LoginPage(page);
   * await loginPage.navigate();
   * ```
   */
  async navigate(options?: {
    waitUntil?: 'load' | 'domcontentloaded' | 'networkidle';
  }): Promise<void> {
    await this.page.goto(this.path, {
      waitUntil: options?.waitUntil || 'domcontentloaded',
      timeout: TIMEOUTS.PAGE_LOAD,
    });
  }

  /**
   * Get the current page URL
   *
   * @returns Current page URL
   *
   * @example
   * ```typescript
   * const currentUrl = await page.getUrl();
   * expect(currentUrl).toContain('/dashboard');
   * ```
   */
  async getUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Get the page title
   *
   * @returns Page title
   *
   * @example
   * ```typescript
   * const title = await page.getTitle();
   * expect(title).toBe('Login - My App');
   * ```
   */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Wait for page to be fully loaded
   *
   * Waits for the 'load' event and ensures no network activity.
   *
   * @param timeout - Maximum wait time in milliseconds
   * @returns Promise that resolves when page is loaded
   *
   * @example
   * ```typescript
   * await page.waitForPageLoad();
   * ```
   */
  async waitForPageLoad(timeout: number = TIMEOUTS.PAGE_LOAD): Promise<void> {
    await this.page.waitForLoadState('load', { timeout });
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Wait for an element to be visible
   *
   * @param selector - Element selector
   * @param timeout - Maximum wait time in milliseconds
   * @returns Promise that resolves when element is visible
   *
   * @example
   * ```typescript
   * await page.waitForSelector('#submit-button');
   * ```
   */
  async waitForSelector(
    selector: string,
    timeout: number = TIMEOUTS.MEDIUM
  ): Promise<Locator> {
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: 'visible', timeout });
    return locator;
  }

  /**
   * Wait for an element to be hidden
   *
   * @param selector - Element selector
   * @param timeout - Maximum wait time in milliseconds
   * @returns Promise that resolves when element is hidden
   *
   * @example
   * ```typescript
   * await page.waitForSelectorToBeHidden('.loading-spinner');
   * ```
   */
  async waitForSelectorToBeHidden(
    selector: string,
    timeout: number = TIMEOUTS.MEDIUM
  ): Promise<void> {
    await this.page.locator(selector).waitFor({ state: 'hidden', timeout });
  }

  /**
   * Click an element
   *
   * Waits for the element to be visible and clickable before clicking.
   *
   * @param selector - Element selector
   * @param options - Click options
   * @returns Promise that resolves when click is complete
   *
   * @example
   * ```typescript
   * await page.clickElement('#submit-button');
   * ```
   */
  async clickElement(
    selector: string,
    options?: {
      force?: boolean;
      timeout?: number;
      clickCount?: number;
    }
  ): Promise<void> {
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: 'visible', timeout: options?.timeout || TIMEOUTS.MEDIUM });
    await locator.click({
      force: options?.force,
      clickCount: options?.clickCount || 1,
      timeout: options?.timeout || TIMEOUTS.MEDIUM,
    });
  }

  /**
   * Fill an input field
   *
   * Clears the field first, then fills it with the provided value.
   *
   * @param selector - Input field selector
   * @param value - Value to fill
   * @param options - Fill options
   * @returns Promise that resolves when fill is complete
   *
   * @example
   * ```typescript
   * await page.fillInput('#email', 'user@example.com');
   * ```
   */
  async fillInput(
    selector: string,
    value: string,
    options?: {
      clear?: boolean;
      timeout?: number;
    }
  ): Promise<void> {
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: 'visible', timeout: options?.timeout || TIMEOUTS.MEDIUM });

    if (options?.clear !== false) {
      await locator.clear();
    }

    await locator.fill(value, { timeout: options?.timeout || TIMEOUTS.MEDIUM });
  }

  /**
   * Get text content of an element
   *
   * @param selector - Element selector
   * @param timeout - Maximum wait time in milliseconds
   * @returns Text content of the element
   *
   * @example
   * ```typescript
   * const errorMessage = await page.getTextContent('.error-message');
   * expect(errorMessage).toBe('Invalid credentials');
   * ```
   */
  async getTextContent(selector: string, timeout: number = TIMEOUTS.MEDIUM): Promise<string> {
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: 'visible', timeout });
    const text = await locator.textContent();
    return text || '';
  }

  /**
   * Check if an element is visible
   *
   * @param selector - Element selector
   * @param timeout - Maximum wait time in milliseconds
   * @returns True if element is visible, false otherwise
   *
   * @example
   * ```typescript
   * const isVisible = await page.isElementVisible('#success-message');
   * expect(isVisible).toBe(true);
   * ```
   */
  async isElementVisible(selector: string, timeout: number = TIMEOUTS.SHORT): Promise<boolean> {
    try {
      await this.page.locator(selector).waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if an element is enabled
   *
   * @param selector - Element selector
   * @returns True if element is enabled, false otherwise
   *
   * @example
   * ```typescript
   * const isEnabled = await page.isElementEnabled('#submit-button');
   * expect(isEnabled).toBe(true);
   * ```
   */
  async isElementEnabled(selector: string): Promise<boolean> {
    return this.page.locator(selector).isEnabled();
  }

  /**
   * Get attribute value of an element
   *
   * @param selector - Element selector
   * @param attribute - Attribute name
   * @returns Attribute value or null
   *
   * @example
   * ```typescript
   * const placeholder = await page.getAttribute('#email', 'placeholder');
   * expect(placeholder).toBe('Enter your email');
   * ```
   */
  async getAttribute(selector: string, attribute: string): Promise<string | null> {
    return this.page.locator(selector).getAttribute(attribute);
  }

  /**
   * Take a screenshot
   *
   * @param name - Screenshot file name
   * @param options - Screenshot options
   * @returns Promise that resolves when screenshot is saved
   *
   * @example
   * ```typescript
   * await page.takeScreenshot('login-error');
   * ```
   */
  async takeScreenshot(
    name: string,
    options?: {
      fullPage?: boolean;
      path?: string;
    }
  ): Promise<void> {
    await this.page.screenshot({
      path: options?.path || `screenshots/${name}.png`,
      fullPage: options?.fullPage ?? true,
    });
  }

  /**
   * Scroll to an element
   *
   * @param selector - Element selector
   * @returns Promise that resolves when scrolling is complete
   *
   * @example
   * ```typescript
   * await page.scrollToElement('#footer');
   * ```
   */
  async scrollToElement(selector: string): Promise<void> {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  /**
   * Wait for URL to match a pattern
   *
   * @param urlPattern - URL pattern (string or RegExp)
   * @param timeout - Maximum wait time in milliseconds
   * @returns Promise that resolves when URL matches
   *
   * @example
   * ```typescript
   * await page.waitForUrl('/dashboard');
   * ```
   */
  async waitForUrl(urlPattern: string | RegExp, timeout: number = TIMEOUTS.MEDIUM): Promise<void> {
    await this.page.waitForURL(urlPattern, { timeout });
  }

  /**
   * Reload the current page
   *
   * @param options - Reload options
   * @returns Promise that resolves when page is reloaded
   *
   * @example
   * ```typescript
   * await page.reloadPage();
   * ```
   */
  async reloadPage(options?: {
    waitUntil?: 'load' | 'domcontentloaded' | 'networkidle';
  }): Promise<void> {
    await this.page.reload({
      waitUntil: options?.waitUntil || 'domcontentloaded',
      timeout: TIMEOUTS.PAGE_LOAD,
    });
  }

  /**
   * Press a keyboard key
   *
   * @param key - Key to press (e.g., 'Enter', 'Escape', 'Tab')
   * @returns Promise that resolves when key is pressed
   *
   * @example
   * ```typescript
   * await page.pressKey('Enter');
   * ```
   */
  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  /**
   * Hover over an element
   *
   * @param selector - Element selector
   * @returns Promise that resolves when hover is complete
   *
   * @example
   * ```typescript
   * await page.hoverElement('.dropdown-trigger');
   * ```
   */
  async hoverElement(selector: string): Promise<void> {
    await this.page.locator(selector).hover();
  }

  /**
   * Select an option from a dropdown
   *
   * @param selector - Dropdown selector
   * @param value - Option value to select
   * @returns Promise that resolves when option is selected
   *
   * @example
   * ```typescript
   * await page.selectOption('#country', 'USA');
   * ```
   */
  async selectOption(selector: string, value: string): Promise<void> {
    await this.page.locator(selector).selectOption(value);
  }

  /**
   * Wait for a specific amount of time
   *
   * ⚠️ Warning: Avoid using this method unless absolutely necessary.
   * Prefer using waitForSelector or other explicit waits.
   *
   * @param ms - Milliseconds to wait
   * @returns Promise that resolves after the specified time
   *
   * @example
   * ```typescript
   * await page.wait(1000); // Wait 1 second
   * ```
   */
  async wait(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  /**
   * Verify page is loaded correctly
   *
   * This method should be overridden in child classes to include
   * page-specific validation.
   *
   * @returns Promise that resolves when page is verified
   *
   * @example
   * ```typescript
   * // In LoginPage.ts
   * async verifyPageLoaded(): Promise<void> {
   *   await super.verifyPageLoaded();
   *   await expect(this.page.locator('h1')).toHaveText('Login');
   * }
   * ```
   */
  async verifyPageLoaded(): Promise<void> {
    await this.waitForPageLoad();
    await expect(this.page).toHaveURL(new RegExp(this.path));
  }
}
