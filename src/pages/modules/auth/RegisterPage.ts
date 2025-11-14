import { Page, expect } from '@playwright/test';
import { BasePage } from '../../base/BasePage';

/**
 * Register Page Object
 *
 * Represents the user registration page.
 * Provides methods for user registration and validation.
 *
 * URL: /register
 *
 * @example
 * ```typescript
 * const registerPage = new RegisterPage(page);
 * await registerPage.navigate();
 * await registerPage.register('John Doe', 'john@example.com', 'SecurePass123!');
 * ```
 */
export class RegisterPage extends BasePage {
  /**
   * Page Selectors
   * Centralized selector definitions using data-testid attributes
   */
  private readonly selectors = {
    // Form inputs
    nameInput: '[data-testid="name-input"], input[name="name"]',
    emailInput: '[data-testid="email-input"], input[name="email"]',
    passwordInput: '[data-testid="password-input"], input[name="password"]',
    confirmPasswordInput: '[data-testid="confirm-password-input"], input[name="confirmPassword"]',

    // Buttons
    submitButton: '[data-testid="register-submit"], button[type="submit"]',
    signInLink: '[data-testid="signin-link"], a[href*="login"]',

    // Messages
    errorMessage: '[data-testid="error-message"], .error-message, .alert-error',
    successMessage: '[data-testid="success-message"], .success-message, .alert-success',

    // Form elements
    showPasswordButton: '[data-testid="show-password"], .show-password',
    termsCheckbox: '[data-testid="terms-checkbox"], #terms',
  };

  /**
   * Constructor
   *
   * @param page - Playwright Page object
   */
  constructor(page: Page) {
    super(page, '/register');
  }

  /**
   * Register a new user
   *
   * @param name - User's full name
   * @param email - User's email address
   * @param password - User's password
   * @param confirmPassword - Password confirmation (defaults to password)
   * @param options - Additional registration options
   * @returns Promise that resolves when registration action is complete
   *
   * @example
   * ```typescript
   * await registerPage.register('John Doe', 'john@example.com', 'SecurePass123!');
   * ```
   */
  async register(
    name: string,
    email: string,
    password: string,
    confirmPassword?: string,
    options?: {
      acceptTerms?: boolean;
    }
  ): Promise<void> {
    // Fill name if field exists
    const nameFieldExists = await this.isElementVisible(this.selectors.nameInput, 1000);
    if (nameFieldExists) {
      await this.fillInput(this.selectors.nameInput, name);
    }

    await this.fillInput(this.selectors.emailInput, email);
    await this.fillInput(this.selectors.passwordInput, password);

    // Fill confirm password if field exists
    const confirmPasswordFieldExists = await this.isElementVisible(
      this.selectors.confirmPasswordInput,
      1000
    );
    if (confirmPasswordFieldExists) {
      await this.fillInput(this.selectors.confirmPasswordInput, confirmPassword || password);
    }

    // Accept terms if checkbox exists and option is set
    if (options?.acceptTerms) {
      const termsCheckboxExists = await this.isElementVisible(this.selectors.termsCheckbox, 1000);
      if (termsCheckboxExists) {
        await this.clickElement(this.selectors.termsCheckbox);
      }
    }

    await this.clickElement(this.selectors.submitButton);
  }

  /**
   * Enter name
   *
   * @param name - Name to enter
   * @returns Promise that resolves when name is filled
   *
   * @example
   * ```typescript
   * await registerPage.enterName('John Doe');
   * ```
   */
  async enterName(name: string): Promise<void> {
    await this.fillInput(this.selectors.nameInput, name);
  }

  /**
   * Enter email address
   *
   * @param email - Email address to enter
   * @returns Promise that resolves when email is filled
   *
   * @example
   * ```typescript
   * await registerPage.enterEmail('john@example.com');
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
   * await registerPage.enterPassword('SecurePass123!');
   * ```
   */
  async enterPassword(password: string): Promise<void> {
    await this.fillInput(this.selectors.passwordInput, password);
  }

  /**
   * Enter password confirmation
   *
   * @param password - Password confirmation to enter
   * @returns Promise that resolves when confirmation is filled
   *
   * @example
   * ```typescript
   * await registerPage.enterConfirmPassword('SecurePass123!');
   * ```
   */
  async enterConfirmPassword(password: string): Promise<void> {
    await this.fillInput(this.selectors.confirmPasswordInput, password);
  }

  /**
   * Click the submit/register button
   *
   * @returns Promise that resolves when button is clicked
   *
   * @example
   * ```typescript
   * await registerPage.clickSubmit();
   * ```
   */
  async clickSubmit(): Promise<void> {
    await this.clickElement(this.selectors.submitButton);
  }

  /**
   * Click "Sign In" link to go to login page
   *
   * @returns Promise that resolves when link is clicked
   *
   * @example
   * ```typescript
   * await registerPage.clickSignIn();
   * await expect(page).toHaveURL(/login/);
   * ```
   */
  async clickSignIn(): Promise<void> {
    await this.clickElement(this.selectors.signInLink);
  }

  /**
   * Toggle password visibility
   *
   * @returns Promise that resolves when toggle is clicked
   *
   * @example
   * ```typescript
   * await registerPage.togglePasswordVisibility();
   * ```
   */
  async togglePasswordVisibility(): Promise<void> {
    await this.clickElement(this.selectors.showPasswordButton);
  }

  /**
   * Accept terms and conditions
   *
   * @param checked - True to check, false to uncheck
   * @returns Promise that resolves when checkbox state is set
   *
   * @example
   * ```typescript
   * await registerPage.setTermsAccepted(true);
   * ```
   */
  async setTermsAccepted(checked: boolean): Promise<void> {
    const checkbox = this.page.locator(this.selectors.termsCheckbox);
    const isChecked = await checkbox.isChecked();

    if (checked !== isChecked) {
      await this.clickElement(this.selectors.termsCheckbox);
    }
  }

  /**
   * Get the error message text
   *
   * @returns Error message text or null if not present
   *
   * @example
   * ```typescript
   * const error = await registerPage.getErrorMessage();
   * expect(error).toContain('Email already exists');
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
   * const isEnabled = await registerPage.isSubmitButtonEnabled();
   * expect(isEnabled).toBe(true);
   * ```
   */
  async isSubmitButtonEnabled(): Promise<boolean> {
    return this.isElementEnabled(this.selectors.submitButton);
  }

  /**
   * Verify page loaded correctly
   *
   * @returns Promise that resolves when page is verified
   *
   * @example
   * ```typescript
   * await registerPage.navigate();
   * await registerPage.verifyPageLoaded();
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
   * Methods for validating registration page state
   */

  /**
   * Expect registration to succeed
   * Validates that user is redirected after successful registration
   *
   * @param redirectPath - Expected redirect path (default: /dashboard)
   * @returns Promise that resolves when assertion passes
   *
   * @example
   * ```typescript
   * await registerPage.register('John Doe', 'john@example.com', 'password');
   * await registerPage.expectRegistrationSuccess();
   * ```
   */
  async expectRegistrationSuccess(redirectPath: string = '/dashboard'): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(redirectPath), {
      timeout: 10000,
    });
  }

  /**
   * Expect registration to fail with error message
   *
   * @param expectedMessage - Expected error message (string or RegExp)
   * @returns Promise that resolves when assertion passes
   *
   * @example
   * ```typescript
   * await registerPage.register('John Doe', 'john@example.com', 'weak');
   * await registerPage.expectRegistrationError('Password too weak');
   * ```
   */
  async expectRegistrationError(expectedMessage?: string | RegExp): Promise<void> {
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
   * await registerPage.enterEmail('');
   * await registerPage.expectSubmitButtonDisabled();
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
   * await registerPage.enterEmail('john@example.com');
   * await registerPage.enterPassword('password');
   * await registerPage.expectSubmitButtonEnabled();
   * ```
   */
  async expectSubmitButtonEnabled(): Promise<void> {
    const submitButton = this.page.locator(this.selectors.submitButton);
    await expect(submitButton).toBeEnabled();
  }
}
