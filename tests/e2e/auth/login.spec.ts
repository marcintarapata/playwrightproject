/**
 * Login Test Suite
 *
 * This test suite demonstrates best practices for writing tests in this framework:
 * - Using Page Object Model
 * - Using custom fixtures
 * - Using data generators
 * - Proper test organization
 * - Comprehensive assertions
 *
 * @group e2e
 * @group auth
 */

import { test, expect } from '../../../src/fixtures/baseFixtures';
import { LoginPage } from '../../../src/pages/modules/auth/LoginPage';
import { standardUser, adminUser } from '../../../src/config/users';
import { TIMEOUTS } from '../../../src/utils/constants';

/**
 * Test Suite: Login Functionality
 *
 * This suite tests all aspects of the login feature including:
 * - Successful login with valid credentials
 * - Failed login with invalid credentials
 * - Form validation
 * - Password visibility toggle
 * - Remember me functionality
 * - Forgot password flow
 */
test.describe('Login Functionality', () => {
  let loginPage: LoginPage;

  /**
   * Before Each Test
   * Set up the login page object and navigate to the login page
   */
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.verifyPageLoaded();
  });

  /**
   * Test: Successful Login with Valid Credentials
   *
   * Scenario:
   * 1. Navigate to login page
   * 2. Enter valid email and password
   * 3. Click submit button
   * 4. Verify redirect to dashboard
   */
  test('should successfully login with valid credentials', async ({ page }) => {
    // Arrange
    const { email, password } = standardUser;

    // Act
    await loginPage.login(email, password);

    // Assert
    await loginPage.expectLoginSuccess();

    // Additional verification - check if we're on the dashboard
    await expect(page).toHaveURL(new RegExp('/dashboard'), {
      timeout: TIMEOUTS.MEDIUM,
    });
  });

  /**
   * Test: Failed Login with Invalid Email
   *
   * Scenario:
   * 1. Navigate to login page
   * 2. Enter invalid email and valid password
   * 3. Click submit button
   * 4. Verify error message is displayed
   */
  test('should display error message with invalid email', async () => {
    // Arrange
    const invalidEmail = 'invalid@example.com';
    const { password } = standardUser;

    // Act
    await loginPage.login(invalidEmail, password);

    // Assert
    await loginPage.expectLoginError(/invalid|incorrect|credentials/i);
  });

  /**
   * Test: Failed Login with Invalid Password
   *
   * Scenario:
   * 1. Navigate to login page
   * 2. Enter valid email and invalid password
   * 3. Click submit button
   * 4. Verify error message is displayed
   */
  test('should display error message with invalid password', async () => {
    // Arrange
    const { email } = standardUser;
    const invalidPassword = 'WrongPassword123!';

    // Act
    await loginPage.login(email, invalidPassword);

    // Assert
    await loginPage.expectLoginError();
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
    expect(errorMessage?.toLowerCase()).toContain('invalid');
  });

  /**
   * Test: Submit Button Disabled with Empty Fields
   *
   * Scenario:
   * 1. Navigate to login page
   * 2. Leave email and password fields empty
   * 3. Verify submit button is disabled
   */
  test('should disable submit button when fields are empty', async () => {
    // Assert - Initially, submit button should be disabled
    await loginPage.expectSubmitButtonDisabled();
  });

  /**
   * Test: Submit Button Enabled with Filled Fields
   *
   * Scenario:
   * 1. Navigate to login page
   * 2. Fill email and password fields
   * 3. Verify submit button is enabled
   */
  test('should enable submit button when fields are filled', async () => {
    // Arrange & Act
    await loginPage.enterEmail('user@example.com');
    await loginPage.enterPassword('password123');

    // Assert
    await loginPage.expectSubmitButtonEnabled();
  });

  /**
   * Test: Email Field Validation
   *
   * Scenario:
   * 1. Navigate to login page
   * 2. Enter invalid email format
   * 3. Click submit button
   * 4. Verify validation error
   */
  test('should validate email format', async () => {
    // Arrange
    const invalidEmailFormats = ['notanemail', 'missing@domain', '@nodomain.com'];

    // Act & Assert
    for (const invalidEmail of invalidEmailFormats) {
      await loginPage.enterEmail(invalidEmail);
      await loginPage.enterPassword('ValidPassword123!');

      // Verify email field shows validation error
      const emailInput = loginPage['page'].locator('[data-testid="email-input"], #email');
      await expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    }
  });

  /**
   * Test: Remember Me Functionality
   *
   * Scenario:
   * 1. Navigate to login page
   * 2. Login with "Remember Me" checked
   * 3. Verify session persistence
   */
  test('should remember user when "Remember Me" is checked', async ({ page }) => {
    // Arrange
    const { email, password } = standardUser;

    // Act
    await loginPage.login(email, password, { rememberMe: true });

    // Assert
    await loginPage.expectLoginSuccess();

    // Verify cookie or localStorage for persistence
    // This is a placeholder - adjust based on actual implementation
    const cookies = await page.context().cookies();
    const hasRememberMeCookie = cookies.some(
      (cookie) => cookie.name.includes('remember') || cookie.name.includes('session')
    );
    expect(hasRememberMeCookie).toBeTruthy();
  });

  /**
   * Test: Forgot Password Link
   *
   * Scenario:
   * 1. Navigate to login page
   * 2. Click "Forgot Password" link
   * 3. Verify redirect to password reset page
   */
  test('should navigate to forgot password page', async ({ page }) => {
    // Act
    await loginPage.clickForgotPassword();

    // Assert
    await expect(page).toHaveURL(/forgot-password|reset-password/, {
      timeout: TIMEOUTS.MEDIUM,
    });
  });

  /**
   * Test: Password Visibility Toggle
   *
   * Scenario:
   * 1. Navigate to login page
   * 2. Enter password
   * 3. Click show/hide password button
   * 4. Verify password visibility changes
   */
  test('should toggle password visibility', async () => {
    // Arrange
    await loginPage.enterPassword('SecurePassword123!');

    // Get password input
    const passwordInput = loginPage['page'].locator(
      '[data-testid="password-input"], #password'
    );

    // Initially, password should be hidden (type="password")
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Act - Toggle to show password
    await loginPage.togglePasswordVisibility();

    // Assert - Password should now be visible (type="text")
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Act - Toggle again to hide password
    await loginPage.togglePasswordVisibility();

    // Assert - Password should be hidden again
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  /**
   * Test: Login with Admin User
   *
   * Scenario:
   * 1. Navigate to login page
   * 2. Login with admin credentials
   * 3. Verify admin access
   */
  test('should login successfully with admin credentials', async ({ page }) => {
    // Arrange
    const { email, password } = adminUser;

    // Act
    await loginPage.login(email, password);

    // Assert
    await loginPage.expectLoginSuccess();

    // Additional verification for admin user
    // This is a placeholder - adjust based on actual implementation
    await expect(page).toHaveURL(/dashboard|admin/);
  });

  /**
   * Test: Multiple Failed Login Attempts
   *
   * Scenario:
   * 1. Navigate to login page
   * 2. Attempt login with wrong password multiple times
   * 3. Verify account lockout or rate limiting
   */
  test('should handle multiple failed login attempts', async () => {
    // Arrange
    const { email } = standardUser;
    const wrongPassword = 'WrongPassword123!';

    // Act - Attempt login 3 times with wrong password
    for (let i = 0; i < 3; i++) {
      await loginPage.login(email, wrongPassword);
      await loginPage.expectLoginError();

      // Navigate back to login page for next attempt
      if (i < 2) {
        await loginPage.navigate();
      }
    }

    // Assert
    // After multiple failed attempts, should show rate limiting or lockout message
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage?.toLowerCase()).toMatch(/locked|too many attempts|rate limit/i);
  });

  /**
   * Test: Login Form Accessibility
   *
   * Scenario:
   * 1. Navigate to login page
   * 2. Verify form has proper ARIA labels
   * 3. Verify keyboard navigation works
   */
  test('should have accessible form elements', async ({ page }) => {
    // Assert - Email input should have label
    const emailInput = page.locator('[data-testid="email-input"], #email');
    await expect(emailInput).toHaveAttribute('aria-label', /.+/);

    // Assert - Password input should have label
    const passwordInput = page.locator('[data-testid="password-input"], #password');
    await expect(passwordInput).toHaveAttribute('aria-label', /.+/);

    // Assert - Submit button should have accessible name
    const submitButton = page.locator('[data-testid="login-submit"], button[type="submit"]');
    const buttonText = await submitButton.textContent();
    expect(buttonText?.trim()).toBeTruthy();

    // Test keyboard navigation
    await emailInput.focus();
    await page.keyboard.press('Tab');
    await expect(passwordInput).toBeFocused();
  });
});

/**
 * Test Suite: Login Page Visual Regression
 *
 * These tests verify the visual appearance of the login page
 */
test.describe('Login Page Visual Tests', () => {
  test('should match login page screenshot', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.verifyPageLoaded();

    // Take screenshot and compare
    await expect(page).toHaveScreenshot('login-page.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match error state screenshot', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('invalid@example.com', 'wrongpassword');
    await loginPage.expectLoginError();

    // Take screenshot of error state
    await expect(page).toHaveScreenshot('login-error-state.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});
