/**
 * Landing Page Test Suite
 *
 * Tests for the public landing page functionality including:
 * - Page load and rendering
 * - Navigation elements
 * - Call-to-action buttons
 * - Hero section
 * - Features section
 *
 * @group e2e
 * @group landing
 */

import { test, expect } from '../../../src/fixtures/baseFixtures';
import { LandingPage } from '../../../src/pages/modules/landing/LandingPage';

test.describe('Landing Page', () => {
  let landingPage: LandingPage;

  test.beforeEach(async ({ page }) => {
    landingPage = new LandingPage(page);
    await landingPage.navigate();
  });

  test.describe('Page Load and Rendering', () => {
    test('should load landing page successfully', async () => {
      await landingPage.verifyPageLoaded();
      await expect(landingPage['page']).toHaveURL('/');
    });

    test('should display hero section', async () => {
      await landingPage.expectHeroVisible();
    });

    test('should display navigation buttons', async () => {
      await landingPage.expectNavigationVisible();
    });

    test('should display features section', async () => {
      const isFeaturesVisible = await landingPage.isFeaturesVisible();
      expect(isFeaturesVisible).toBe(true);
    });

    test('should have correct page title', async () => {
      const title = await landingPage.getTitle();
      expect(title).toContain('TodoApp');
    });
  });

  test.describe('Hero Section', () => {
    test('should display hero heading', async () => {
      const heading = await landingPage.getHeroHeading();
      expect(heading).toBeTruthy();
      expect(heading.length).toBeGreaterThan(0);
    });

    test('should display hero subtitle', async () => {
      const subtitle = await landingPage.getHeroSubtitle();
      expect(subtitle).toBeTruthy();
      expect(subtitle.length).toBeGreaterThan(0);
    });

    test('should have Get Started button', async ({ page }) => {
      const button = page.locator('[data-testid="cta-button"]');
      await expect(button).toBeVisible();
      await expect(button).toBeEnabled();
    });
  });

  test.describe('Navigation', () => {
    test('should navigate to login when clicking Get Started', async ({ page }) => {
      await landingPage.clickGetStarted();
      await expect(page).toHaveURL(/\/login/);
    });

    test('should navigate to login when clicking Sign In', async ({ page }) => {
      await landingPage.clickSignIn();
      await expect(page).toHaveURL(/\/login/);
    });

    test('should return to homepage when clicking logo', async ({ page }) => {
      await landingPage.clickGetStarted();
      await page.waitForURL(/\/login/);
      await page.goBack();
      await landingPage.clickLogo();
      await expect(page).toHaveURL('/');
    });
  });

  test.describe('Features Section', () => {
    test('should display feature cards', async () => {
      await landingPage.expectFeaturesVisible(4);
    });

    test('should have correct number of features', async () => {
      const count = await landingPage.getFeatureCount();
      expect(count).toBeGreaterThanOrEqual(4);
    });

    test('each feature should have icon and description', async ({ page }) => {
      const features = page.locator('[data-testid^="feature-"]');
      const count = await features.count();

      for (let i = 0; i < count; i++) {
        const feature = features.nth(i);
        // Check for feature content
        await expect(feature).toBeVisible();
        const text = await feature.textContent();
        expect(text).toBeTruthy();
      }
    });
  });

  test.describe('Responsiveness', () => {
    test('should be mobile responsive', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await landingPage.navigate();
      await landingPage.verifyPageLoaded();

      // Verify key elements are still visible
      await landingPage.expectHeroVisible();
    });

    test('should be tablet responsive', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await landingPage.navigate();
      await landingPage.verifyPageLoaded();

      // Verify key elements are still visible
      await landingPage.expectHeroVisible();
      await landingPage.expectNavigationVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should have accessible navigation', async ({ page }) => {
      const signInButton = page.locator('[data-testid="signin-button"]');
      const getStartedButton = page.locator('[data-testid="cta-button"]');

      // Check that buttons have accessible text
      await expect(signInButton).toContainText(/.+/);
      await expect(getStartedButton).toContainText(/.+/);
    });

    test('should allow keyboard navigation', async ({ page }) => {
      // Tab through interactive elements
      await page.keyboard.press('Tab');
      const signInButton = page.locator('[data-testid="signin-button"]');
      await expect(signInButton).toBeFocused();

      await page.keyboard.press('Tab');
      const getStartedButton = page.locator('[data-testid="cta-button"]');
      await expect(getStartedButton).toBeFocused();
    });
  });
});
