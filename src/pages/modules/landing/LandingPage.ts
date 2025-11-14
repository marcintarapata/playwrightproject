import { Page, expect } from '@playwright/test';
import { BasePage } from '../../base/BasePage';

/**
 * Landing Page Object
 *
 * Represents the application's public landing page.
 * Provides methods for interacting with the landing page elements.
 *
 * URL: /
 *
 * @example
 * ```typescript
 * const landingPage = new LandingPage(page);
 * await landingPage.navigate();
 * await landingPage.clickGetStarted();
 * ```
 */
export class LandingPage extends BasePage {
  /**
   * Page Selectors
   * Centralized selector definitions using data-testid attributes
   */
  private readonly selectors = {
    // Hero section
    heroHeading: '[data-testid="hero-heading"]',
    heroSubtitle: '[data-testid="hero-subtitle"]',
    getStartedButton: '[data-testid="cta-button"]',

    // Navigation
    signInButton: '[data-testid="signin-button"]',
    logoLink: '[data-testid="logo-link"]',

    // Features section
    featuresSection: '[data-testid="features-section"]',
    featureCards: '[data-testid^="feature-"]',

    // Footer
    footer: 'footer',
  };

  /**
   * Constructor
   *
   * @param page - Playwright Page object
   */
  constructor(page: Page) {
    super(page, '/');
  }

  /**
   * Click "Get Started" button in hero section
   *
   * @returns Promise that resolves when button is clicked
   *
   * @example
   * ```typescript
   * await landingPage.clickGetStarted();
   * await expect(page).toHaveURL(/login/);
   * ```
   */
  async clickGetStarted(): Promise<void> {
    await this.clickElement(this.selectors.getStartedButton);
  }

  /**
   * Click "Sign In" button in navigation
   *
   * @returns Promise that resolves when button is clicked
   *
   * @example
   * ```typescript
   * await landingPage.clickSignIn();
   * await expect(page).toHaveURL(/login/);
   * ```
   */
  async clickSignIn(): Promise<void> {
    await this.clickElement(this.selectors.signInButton);
  }

  /**
   * Click logo to return to homepage
   *
   * @returns Promise that resolves when logo is clicked
   *
   * @example
   * ```typescript
   * await landingPage.clickLogo();
   * ```
   */
  async clickLogo(): Promise<void> {
    await this.clickElement(this.selectors.logoLink);
  }

  /**
   * Get hero heading text
   *
   * @returns Hero heading text
   *
   * @example
   * ```typescript
   * const heading = await landingPage.getHeroHeading();
   * expect(heading).toContain('TodoApp');
   * ```
   */
  async getHeroHeading(): Promise<string> {
    return this.getTextContent(this.selectors.heroHeading);
  }

  /**
   * Get hero subtitle text
   *
   * @returns Hero subtitle text
   *
   * @example
   * ```typescript
   * const subtitle = await landingPage.getHeroSubtitle();
   * expect(subtitle).toBeTruthy();
   * ```
   */
  async getHeroSubtitle(): Promise<string> {
    return this.getTextContent(this.selectors.heroSubtitle);
  }

  /**
   * Get number of feature cards displayed
   *
   * @returns Number of feature cards
   *
   * @example
   * ```typescript
   * const count = await landingPage.getFeatureCount();
   * expect(count).toBe(4);
   * ```
   */
  async getFeatureCount(): Promise<number> {
    const features = this.page.locator(this.selectors.featureCards);
    return features.count();
  }

  /**
   * Check if features section is visible
   *
   * @returns True if features section is visible
   *
   * @example
   * ```typescript
   * const isVisible = await landingPage.isFeaturesVisible();
   * expect(isVisible).toBe(true);
   * ```
   */
  async isFeaturesVisible(): Promise<boolean> {
    return this.isElementVisible(this.selectors.featuresSection);
  }

  /**
   * Verify page loaded correctly
   *
   * @returns Promise that resolves when page is verified
   *
   * @example
   * ```typescript
   * await landingPage.navigate();
   * await landingPage.verifyPageLoaded();
   * ```
   */
  async verifyPageLoaded(): Promise<void> {
    await super.verifyPageLoaded();
    await this.waitForSelector(this.selectors.heroHeading);
    await this.waitForSelector(this.selectors.getStartedButton);
  }

  /**
   * Assertions
   * Methods for validating landing page state
   */

  /**
   * Expect hero section to be visible
   *
   * @returns Promise that resolves when assertion passes
   *
   * @example
   * ```typescript
   * await landingPage.expectHeroVisible();
   * ```
   */
  async expectHeroVisible(): Promise<void> {
    await expect(this.page.locator(this.selectors.heroHeading)).toBeVisible();
    await expect(this.page.locator(this.selectors.heroSubtitle)).toBeVisible();
    await expect(this.page.locator(this.selectors.getStartedButton)).toBeVisible();
  }

  /**
   * Expect navigation buttons to be visible
   *
   * @returns Promise that resolves when assertion passes
   *
   * @example
   * ```typescript
   * await landingPage.expectNavigationVisible();
   * ```
   */
  async expectNavigationVisible(): Promise<void> {
    await expect(this.page.locator(this.selectors.signInButton)).toBeVisible();
  }

  /**
   * Expect features section to be visible
   *
   * @param minFeatures - Minimum number of expected features
   * @returns Promise that resolves when assertion passes
   *
   * @example
   * ```typescript
   * await landingPage.expectFeaturesVisible(4);
   * ```
   */
  async expectFeaturesVisible(minFeatures: number = 1): Promise<void> {
    const features = this.page.locator(this.selectors.featureCards);
    await expect(features).toHaveCount(minFeatures, { timeout: 5000 });
  }
}
