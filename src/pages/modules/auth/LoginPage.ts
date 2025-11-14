import { Page, expect } from '@playwright/test';
import { BasePage } from '../../base/BasePage';

/**
 * Login Page Object
 *
 * Represents the application login page.
 * Provides methods for login-related interactions and validations.
 *
 * URL: /login
 *
 * @example
 * ```typescript
 * const loginPage = new LoginPage(page);
 * await loginPage.navigate();
 * await loginPage.login('user@example.com', 'password123');
 * await loginPage.expectLoginSuccess();
 * ```
 */
export class LoginPage extends BasePage {
  /**
   * Page Selectors
   * Centralized selector definitions for easy maintenance
   */
  private readonly selectors = {
    // Form inputs
    emailInput: '[data-testid="email-input"], #email, input[name="email"]',
    passwordInput: '[data-testid="password-input"], #password, input[name="password"]',

    // Buttons
    submitButton:
      '[data-testid="login-submit"], button[type="submit"], .login-button',
    forgotPasswordLink: '[data-testid="forgot-password"], a[href*="forgot-password"]',

    // Messages
    errorMessage: '[data-testid="error-message"], .error-message, .alert-error',
    successMessage: '[data-testid="success-message"], .success-message, .alert-success',

    // Form elements
    rememberMeCheckbox: '[data-testid="remember-me"], #remember-me',
    showPasswordButton: '[data-testid="show-password"], .show-password',
  };

  /**
   * Constructor
   *
   * @param page - Playwright Page object
   */
  constructor(page: Page) {
    super(page, '/login');
  }

  /**
   * Login with email and password
   *
   * This is the primary method for logging into the application.
   * It fills the email and password fields and submits the form.
   *
   * @param email - User's email address
   * @param password - User's password
   * @param options - Additional login options
   * @returns Promise that resolves when login action is complete
   *
   * @example
   * ```typescript
   * await loginPage.login('user@example.com', 'SecurePass123!');
   * ```
   *
   * @example
   * ```typescript
   * // With remember me option
   * await loginPage.login('user@example.com', 'password', { rememberMe: true });
   * ```
   */
  async login(
    email: string,
    password: string,
    options?: {
      rememberMe?: boolean;
    }
  ): Promise<void> {
    await this.fillInput(this.selectors.emailInput, email);
    await this.fillInput(this.selectors.passwordInput, password);

    if (options?.rememberMe) {
      await this.clickElement(this.selectors.rememberMeCheckbox);
    }

    // Wait for the login API call to complete
    const loginPromise = this.page.waitForResponse(
      (response) => response.url().includes('/api/auth/sign-in/email') && response.status() === 200,
      { timeout: 10000 }
    );

    await this.clickElement(this.selectors.submitButton);
    
    // Wait for login API to complete
    await loginPromise.catch(() => {
      // If response already happened, continue
    });
  }

  /**
   * Enter email address
   *
   * @param email - Email address to enter
   * @returns Promise that resolves when email is filled
   *
   * @example
   * ```typescript
   * await loginPage.enterEmail('user@example.com');
   * ```
   */
  async enterEmail(email: string): Promise<void> {
    await this.fillInput(this.selectors.emailInput, email);
  }

  /**
   * Enter password
   *
   * @param password - Password to enter
   * @returns Promise that resolves when password is filled
   *
   * @example
   * ```typescript
   * await loginPage.enterPassword('SecurePass123!');
   * ```
   */
  async enterPassword(password: string): Promise<void> {
    await this.fillInput(this.selectors.passwordInput, password);
  }

  /**
   * Click the submit/login button
   *
   * @returns Promise that resolves when button is clicked
   *
   * @example
   * ```typescript
   * await loginPage.clickSubmit();
   * ```
   */
  async clickSubmit(): Promise<void> {
    await this.clickElement(this.selectors.submitButton);
  }

  /**
   * Click "Forgot Password" link
   *
   * @returns Promise that resolves when link is clicked
   *
   * @example
   * ```typescript
   * await loginPage.clickForgotPassword();
   * await expect(page).toHaveURL(/forgot-password/);
   * ```
   */
  async clickForgotPassword(): Promise<void> {
    await this.clickElement(this.selectors.forgotPasswordLink);
  }

  /**
   * Toggle password visibility
   *
   * @returns Promise that resolves when toggle is clicked
   *
   * @example
   * ```typescript
   * await loginPage.togglePasswordVisibility();
   * ```
   */
  async togglePasswordVisibility(): Promise<void> {
    await this.clickElement(this.selectors.showPasswordButton);
  }

  /**
   * Check/uncheck "Remember Me" checkbox
   *
   * @param checked - True to check, false to uncheck
   * @returns Promise that resolves when checkbox state is set
   *
   * @example
   * ```typescript
   * await loginPage.setRememberMe(true);
   * ```
   */
  async setRememberMe(checked: boolean): Promise<void> {
    const checkbox = this.page.locator(this.selectors.rememberMeCheckbox);
    const isChecked = await checkbox.isChecked();

    if (checked !== isChecked) {
      await this.clickElement(this.selectors.rememberMeCheckbox);
    }
  }

  /**
   * Get the error message text
   *
   * @returns Error message text or null if not present
   *
   * @example
   * ```typescript
   * const error = await loginPage.getErrorMessage();
   * expect(error).toContain('Invalid credentials');
   * ```
   */
  async getErrorMessage(): Promise<string | null> {
    const isVisible = await this.isElementVisible(this.selectors.errorMessage);
    if (!isVisible) {
      return null;
    }
    return this.getTextContent(this.selectors.errorMessage);
  }

  /**
   * Check if submit button is enabled
   *
   * @returns True if enabled, false otherwise
   *
   * @example
   * ```typescript
   * const isEnabled = await loginPage.isSubmitButtonEnabled();
   * expect(isEnabled).toBe(true);
   * ```
   */
  async isSubmitButtonEnabled(): Promise<boolean> {
    return this.isElementEnabled(this.selectors.submitButton);
  }

  /**
   * Verify page loaded correctly
   *
   * Overrides base class method to add page-specific validation.
   *
   * @returns Promise that resolves when page is verified
   *
   * @example
   * ```typescript
   * await loginPage.navigate();
   * await loginPage.verifyPageLoaded();
   * ```
   */
  async verifyPageLoaded(): Promise<void> {
    await super.verifyPageLoaded();
    await this.waitForSelector(this.selectors.emailInput);
    await this.waitForSelector(this.selectors.passwordInput);
    await this.waitForSelector(this.selectors.submitButton);
  }

  /**
   * Assertions
   * Methods for validating login page state
   */

  /**
   * Expect login to succeed
   * Validates that user is redirected after successful login
   *
   * @param redirectPath - Expected redirect path (default: /dashboard)
   * @returns Promise that resolves when assertion passes
   *
   * @example
   * ```typescript
   * await loginPage.login('user@example.com', 'password');
   * await loginPage.expectLoginSuccess();
   * ```
   */
  async expectLoginSuccess(redirectPath: string = '/dashboard'): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(redirectPath), {
      timeout: 10000,
    });
  }

  /**
   * Expect login to fail with error message
   *
   * @param expectedMessage - Expected error message (string or RegExp)
   * @returns Promise that resolves when assertion passes
   *
   * @example
   * ```typescript
   * await loginPage.login('user@example.com', 'wrongpassword');
   * await loginPage.expectLoginError('Invalid credentials');
   * ```
   */
  async expectLoginError(expectedMessage?: string | RegExp): Promise<void> {
    const errorLocator = this.page.locator(this.selectors.errorMessage);
    await expect(errorLocator).toBeVisible({ timeout: 5000 });

    if (expectedMessage) {
      await expect(errorLocator).toContainText(expectedMessage);
    }
  }

  /**
   * Expect submit button to be disabled
   *
   * @returns Promise that resolves when assertion passes
   *
   * @example
   * ```typescript
   * await loginPage.enterEmail('');
   * await loginPage.expectSubmitButtonDisabled();
   * ```
   */
  async expectSubmitButtonDisabled(): Promise<void> {
    const submitButton = this.page.locator(this.selectors.submitButton);
    await expect(submitButton).toBeDisabled();
  }

  /**
   * Expect submit button to be enabled
   *
   * @returns Promise that resolves when assertion passes
   *
   * @example
   * ```typescript
   * await loginPage.enterEmail('user@example.com');
   * await loginPage.enterPassword('password');
   * await loginPage.expectSubmitButtonEnabled();
   * ```
   */
  async expectSubmitButtonEnabled(): Promise<void> {
    const submitButton = this.page.locator(this.selectors.submitButton);
    await expect(submitButton).toBeEnabled();
  }
}
