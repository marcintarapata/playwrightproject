import { Page, Locator } from '@playwright/test';
import { TIMEOUTS } from '../../utils/constants';

/**
 * BaseComponent Class
 *
 * This is the foundational class for all reusable UI components.
 * Components are reusable UI elements that appear across multiple pages,
 * such as headers, footers, modals, navigation menus, etc.
 *
 * Key Features:
 * - Encapsulates component-specific logic
 * - Provides scoped locators to the component container
 * - Reusable across multiple page objects
 * - Reduces code duplication
 *
 * All component objects should extend this class.
 *
 * @example
 * ```typescript
 * export class HeaderComponent extends BaseComponent {
 *   constructor(page: Page) {
 *     super(page, 'header[role="banner"]');
 *   }
 *
 *   async clickLogo(): Promise<void> {
 *     await this.click('.logo');
 *   }
 * }
 * ```
 */
export class BaseComponent {
  /**
   * Playwright Page object
   * @protected - Available to child classes
   */
  protected readonly page: Page;

  /**
   * Component root locator
   * All queries within the component should be scoped to this container
   * @protected - Available to child classes
   */
  protected readonly container: Locator;

  /**
   * Component selector (for reference and debugging)
   * @protected - Available to child classes
   */
  protected readonly selector: string;

  /**
   * Constructor
   *
   * @param page - Playwright Page object
   * @param selector - Component container selector
   *
   * @example
   * ```typescript
   * // In HeaderComponent.ts
   * constructor(page: Page) {
   *   super(page, 'header.main-header');
   * }
   * ```
   */
  constructor(page: Page, selector: string) {
    this.page = page;
    this.selector = selector;
    this.container = page.locator(selector);
  }

  /**
   * Wait for the component to be visible
   *
   * @param timeout - Maximum wait time in milliseconds
   * @returns Promise that resolves when component is visible
   *
   * @example
   * ```typescript
   * const header = new HeaderComponent(page);
   * await header.waitForVisible();
   * ```
   */
  async waitForVisible(timeout: number = TIMEOUTS.MEDIUM): Promise<void> {
    await this.container.waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for the component to be hidden
   *
   * @param timeout - Maximum wait time in milliseconds
   * @returns Promise that resolves when component is hidden
   *
   * @example
   * ```typescript
   * const modal = new ModalComponent(page);
   * await modal.clickClose();
   * await modal.waitForHidden();
   * ```
   */
  async waitForHidden(timeout: number = TIMEOUTS.MEDIUM): Promise<void> {
    await this.container.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Check if the component is visible
   *
   * @param timeout - Maximum wait time in milliseconds
   * @returns True if component is visible, false otherwise
   *
   * @example
   * ```typescript
   * const isVisible = await header.isVisible();
   * expect(isVisible).toBe(true);
   * ```
   */
  async isVisible(timeout: number = TIMEOUTS.SHORT): Promise<boolean> {
    try {
      await this.container.waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get a locator scoped to this component
   *
   * This ensures that element searches are confined to the component,
   * preventing accidental interactions with elements outside the component.
   *
   * @param selector - Element selector within the component
   * @returns Locator scoped to the component
   *
   * @example
   * ```typescript
   * // In HeaderComponent
   * async clickLogo(): Promise<void> {
   *   const logo = this.locator('.logo');
   *   await logo.click();
   * }
   * ```
   */
  protected locator(selector: string): Locator {
    return this.container.locator(selector);
  }

  /**
   * Click an element within the component
   *
   * @param selector - Element selector within the component
   * @param options - Click options
   * @returns Promise that resolves when click is complete
   *
   * @example
   * ```typescript
   * await this.click('.menu-button');
   * ```
   */
  protected async click(
    selector: string,
    options?: {
      force?: boolean;
      timeout?: number;
    }
  ): Promise<void> {
    const element = this.locator(selector);
    await element.waitFor({ state: 'visible', timeout: options?.timeout || TIMEOUTS.MEDIUM });
    await element.click({
      force: options?.force,
      timeout: options?.timeout || TIMEOUTS.MEDIUM,
    });
  }

  /**
   * Fill an input within the component
   *
   * @param selector - Input selector within the component
   * @param value - Value to fill
   * @param options - Fill options
   * @returns Promise that resolves when fill is complete
   *
   * @example
   * ```typescript
   * await this.fill('#search-input', 'query');
   * ```
   */
  protected async fill(
    selector: string,
    value: string,
    options?: {
      clear?: boolean;
      timeout?: number;
    }
  ): Promise<void> {
    const element = this.locator(selector);
    await element.waitFor({ state: 'visible', timeout: options?.timeout || TIMEOUTS.MEDIUM });

    if (options?.clear !== false) {
      await element.clear();
    }

    await element.fill(value, { timeout: options?.timeout || TIMEOUTS.MEDIUM });
  }

  /**
   * Get text content of an element within the component
   *
   * @param selector - Element selector within the component
   * @param timeout - Maximum wait time in milliseconds
   * @returns Text content
   *
   * @example
   * ```typescript
   * const username = await this.getText('.user-name');
   * expect(username).toBe('John Doe');
   * ```
   */
  protected async getText(selector: string, timeout: number = TIMEOUTS.MEDIUM): Promise<string> {
    const element = this.locator(selector);
    await element.waitFor({ state: 'visible', timeout });
    const text = await element.textContent();
    return text || '';
  }

  /**
   * Check if an element within the component is visible
   *
   * @param selector - Element selector within the component
   * @param timeout - Maximum wait time in milliseconds
   * @returns True if element is visible, false otherwise
   *
   * @example
   * ```typescript
   * const hasNotification = await this.isElementVisible('.notification-badge');
   * ```
   */
  protected async isElementVisible(
    selector: string,
    timeout: number = TIMEOUTS.SHORT
  ): Promise<boolean> {
    try {
      await this.locator(selector).waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Hover over an element within the component
   *
   * @param selector - Element selector within the component
   * @returns Promise that resolves when hover is complete
   *
   * @example
   * ```typescript
   * await this.hover('.dropdown-trigger');
   * ```
   */
  protected async hover(selector: string): Promise<void> {
    await this.locator(selector).hover();
  }

  /**
   * Get attribute value of an element within the component
   *
   * @param selector - Element selector within the component
   * @param attribute - Attribute name
   * @returns Attribute value or null
   *
   * @example
   * ```typescript
   * const href = await this.getAttribute('.logo', 'href');
   * ```
   */
  protected async getAttribute(selector: string, attribute: string): Promise<string | null> {
    return this.locator(selector).getAttribute(attribute);
  }

  /**
   * Count elements matching a selector within the component
   *
   * @param selector - Element selector within the component
   * @returns Number of matching elements
   *
   * @example
   * ```typescript
   * const itemCount = await this.count('.menu-item');
   * expect(itemCount).toBe(5);
   * ```
   */
  protected async count(selector: string): Promise<number> {
    return this.locator(selector).count();
  }
}
