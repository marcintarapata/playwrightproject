/**
 * Wait Helpers
 *
 * Custom wait strategies and polling utilities for more complex waiting scenarios.
 * These helpers complement Playwright's built-in wait methods.
 *
 * @module utils/waitHelpers
 */

import { Page, Locator } from '@playwright/test';
import { TIMEOUTS, WAIT } from './constants';

/**
 * Wait for a condition to be true
 *
 * Polls a condition function until it returns true or timeout is reached.
 *
 * @param condition - Function that returns a boolean or Promise<boolean>
 * @param options - Wait options
 * @returns Promise that resolves when condition is true
 * @throws Error if timeout is reached
 *
 * @example
 * ```typescript
 * await waitForCondition(
 *   async () => {
 *     const count = await getItemCount();
 *     return count > 5;
 *   },
 *   { timeout: 10000, message: 'Item count did not exceed 5' }
 * );
 * ```
 */
export async function waitForCondition(
  condition: () => boolean | Promise<boolean>,
  options: {
    timeout?: number;
    interval?: number;
    message?: string;
  } = {}
): Promise<void> {
  const timeout = options.timeout || TIMEOUTS.MEDIUM;
  const interval = options.interval || WAIT.RETRY;
  const message = options.message || 'Condition was not met within timeout';

  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      const result = await Promise.resolve(condition());
      if (result) {
        return;
      }
    } catch (error) {
      // Ignore errors during polling, will timeout if condition never succeeds
    }

    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error(`${message} (timeout: ${timeout}ms)`);
}

/**
 * Wait for text to appear in an element
 *
 * @param locator - Element locator
 * @param expectedText - Text to wait for (string or RegExp)
 * @param options - Wait options
 * @returns Promise that resolves when text appears
 *
 * @example
 * ```typescript
 * await waitForText(
 *   page.locator('.status'),
 *   'Completed',
 *   { timeout: 15000 }
 * );
 * ```
 */
export async function waitForText(
  locator: Locator,
  expectedText: string | RegExp,
  options: {
    timeout?: number;
  } = {}
): Promise<void> {
  await waitForCondition(
    async () => {
      const text = await locator.textContent();
      if (typeof expectedText === 'string') {
        return text?.includes(expectedText) ?? false;
      } else {
        return expectedText.test(text || '');
      }
    },
    {
      timeout: options.timeout || TIMEOUTS.MEDIUM,
      message: `Text "${expectedText}" did not appear`,
    }
  );
}

/**
 * Wait for element count to match expected value
 *
 * @param locator - Element locator
 * @param expectedCount - Expected number of elements
 * @param options - Wait options
 * @returns Promise that resolves when count matches
 *
 * @example
 * ```typescript
 * await waitForElementCount(
 *   page.locator('.list-item'),
 *   5,
 *   { timeout: 10000 }
 * );
 * ```
 */
export async function waitForElementCount(
  locator: Locator,
  expectedCount: number,
  options: {
    timeout?: number;
  } = {}
): Promise<void> {
  await waitForCondition(
    async () => {
      const count = await locator.count();
      return count === expectedCount;
    },
    {
      timeout: options.timeout || TIMEOUTS.MEDIUM,
      message: `Element count did not reach ${expectedCount}`,
    }
  );
}

/**
 * Wait for URL to contain a specific string
 *
 * @param page - Playwright Page object
 * @param urlPart - URL string to wait for
 * @param options - Wait options
 * @returns Promise that resolves when URL contains the string
 *
 * @example
 * ```typescript
 * await waitForUrlContains(page, '/dashboard');
 * ```
 */
export async function waitForUrlContains(
  page: Page,
  urlPart: string,
  options: {
    timeout?: number;
  } = {}
): Promise<void> {
  await waitForCondition(
    () => page.url().includes(urlPart),
    {
      timeout: options.timeout || TIMEOUTS.MEDIUM,
      message: `URL did not contain "${urlPart}"`,
    }
  );
}

/**
 * Wait for loading spinner to disappear
 *
 * Common use case: wait for page or component to finish loading.
 *
 * @param page - Playwright Page object
 * @param spinnerSelector - Selector for the loading spinner
 * @param options - Wait options
 * @returns Promise that resolves when spinner is hidden
 *
 * @example
 * ```typescript
 * await waitForLoadingToComplete(page, '.loading-spinner');
 * ```
 */
export async function waitForLoadingToComplete(
  page: Page,
  spinnerSelector: string = '.loading, .spinner, [data-testid="loading"]',
  options: {
    timeout?: number;
  } = {}
): Promise<void> {
  try {
    // First check if spinner exists
    await page.locator(spinnerSelector).waitFor({
      state: 'hidden',
      timeout: options.timeout || TIMEOUTS.MEDIUM,
    });
  } catch {
    // Spinner may not exist, which is fine
  }
}

/**
 * Wait for network to be idle
 *
 * Waits until no network requests are pending for a specified duration.
 *
 * @param page - Playwright Page object
 * @param options - Wait options
 * @returns Promise that resolves when network is idle
 *
 * @example
 * ```typescript
 * await waitForNetworkIdle(page, { idleTime: 500 });
 * ```
 */
export async function waitForNetworkIdle(
  page: Page,
  options: {
    idleTime?: number;
    timeout?: number;
  } = {}
): Promise<void> {
  await page.waitForLoadState('networkidle', {
    timeout: options.timeout || TIMEOUTS.LONG,
  });

  // Additional wait to ensure stability
  if (options.idleTime) {
    await new Promise((resolve) => setTimeout(resolve, options.idleTime));
  }
}

/**
 * Retry an action until it succeeds or max retries is reached
 *
 * @param action - Function to retry
 * @param options - Retry options
 * @returns Promise that resolves with the action result
 * @throws Error if max retries is reached
 *
 * @example
 * ```typescript
 * const result = await retryAction(
 *   async () => {
 *     await page.click('.sometimes-hidden-button');
 *   },
 *   { maxRetries: 3, delay: 1000 }
 * );
 * ```
 */
export async function retryAction<T>(
  action: () => T | Promise<T>,
  options: {
    maxRetries?: number;
    delay?: number;
    onRetry?: (attempt: number, error: Error) => void;
  } = {}
): Promise<T> {
  const maxRetries = options.maxRetries || 3;
  const delay = options.delay || WAIT.RETRY;

  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await Promise.resolve(action());
    } catch (error) {
      lastError = error as Error;

      if (options.onRetry) {
        options.onRetry(attempt, lastError);
      }

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(
    `Action failed after ${maxRetries} retries. Last error: ${lastError?.message}`
  );
}

/**
 * Wait for an attribute to have a specific value
 *
 * @param locator - Element locator
 * @param attribute - Attribute name
 * @param expectedValue - Expected attribute value (string or RegExp)
 * @param options - Wait options
 * @returns Promise that resolves when attribute matches
 *
 * @example
 * ```typescript
 * await waitForAttribute(
 *   page.locator('#status'),
 *   'data-status',
 *   'completed'
 * );
 * ```
 */
export async function waitForAttribute(
  locator: Locator,
  attribute: string,
  expectedValue: string | RegExp,
  options: {
    timeout?: number;
  } = {}
): Promise<void> {
  await waitForCondition(
    async () => {
      const value = await locator.getAttribute(attribute);
      if (typeof expectedValue === 'string') {
        return value === expectedValue;
      } else {
        return expectedValue.test(value || '');
      }
    },
    {
      timeout: options.timeout || TIMEOUTS.MEDIUM,
      message: `Attribute "${attribute}" did not match expected value`,
    }
  );
}

/**
 * Wait for element to be stable (not moving/changing)
 *
 * Useful for animations or dynamic content that needs to settle.
 *
 * @param locator - Element locator
 * @param options - Wait options
 * @returns Promise that resolves when element is stable
 *
 * @example
 * ```typescript
 * await waitForElementToBeStable(page.locator('.animated-element'));
 * ```
 */
export async function waitForElementToBeStable(
  locator: Locator,
  options: {
    timeout?: number;
    stableTime?: number;
  } = {}
): Promise<void> {
  const stableTime = options.stableTime || WAIT.ANIMATION;

  await locator.waitFor({ state: 'visible', timeout: options.timeout });

  // Wait for element to stop moving
  await waitForCondition(
    async () => {
      const box1 = await locator.boundingBox();
      await new Promise((resolve) => setTimeout(resolve, stableTime));
      const box2 = await locator.boundingBox();

      return (
        box1?.x === box2?.x &&
        box1?.y === box2?.y &&
        box1?.width === box2?.width &&
        box1?.height === box2?.height
      );
    },
    {
      timeout: options.timeout || TIMEOUTS.MEDIUM,
      message: 'Element did not stabilize',
    }
  );
}
