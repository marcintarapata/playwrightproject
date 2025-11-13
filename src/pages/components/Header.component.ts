import { Page } from '@playwright/test';
import { BaseComponent } from './BaseComponent';

/**
 * Header Component
 *
 * Represents the application header/navigation bar.
 * This component typically appears on all pages and contains navigation links,
 * user menu, logo, search functionality, etc.
 *
 * @example
 * ```typescript
 * const header = new HeaderComponent(page);
 * await header.waitForVisible();
 * await header.clickLogo();
 * await header.navigateTo('Dashboard');
 * const username = await header.getLoggedInUserName();
 * ```
 */
export class HeaderComponent extends BaseComponent {
  /**
   * Component Selectors
   * Define all selectors as private properties for easy maintenance
   */
  private readonly selectors = {
    logo: '[data-testid="header-logo"]',
    navigation: {
      home: '[data-testid="nav-home"]',
      dashboard: '[data-testid="nav-dashboard"]',
      profile: '[data-testid="nav-profile"]',
      settings: '[data-testid="nav-settings"]',
    },
    userMenu: {
      trigger: '[data-testid="user-menu-trigger"]',
      dropdown: '[data-testid="user-menu-dropdown"]',
      username: '[data-testid="user-menu-username"]',
      profile: '[data-testid="user-menu-profile"]',
      settings: '[data-testid="user-menu-settings"]',
      logout: '[data-testid="user-menu-logout"]',
    },
    searchInput: '[data-testid="header-search"]',
    notificationIcon: '[data-testid="notification-icon"]',
    notificationBadge: '[data-testid="notification-badge"]',
  };

  /**
   * Constructor
   *
   * @param page - Playwright Page object
   */
  constructor(page: Page) {
    // Assuming the header has a role="banner" or specific selector
    super(page, 'header[role="banner"]');
  }

  /**
   * Click the logo to navigate to home page
   *
   * @returns Promise that resolves when logo is clicked
   *
   * @example
   * ```typescript
   * await header.clickLogo();
   * ```
   */
  async clickLogo(): Promise<void> {
    await this.click(this.selectors.logo);
  }

  /**
   * Navigate to a specific section using the main navigation
   *
   * @param section - Section name ('Home', 'Dashboard', 'Profile', 'Settings')
   * @returns Promise that resolves when navigation link is clicked
   *
   * @example
   * ```typescript
   * await header.navigateTo('Dashboard');
   * ```
   */
  async navigateTo(section: 'Home' | 'Dashboard' | 'Profile' | 'Settings'): Promise<void> {
    const selectorMap: Record<string, string> = {
      Home: this.selectors.navigation.home,
      Dashboard: this.selectors.navigation.dashboard,
      Profile: this.selectors.navigation.profile,
      Settings: this.selectors.navigation.settings,
    };

    const selector = selectorMap[section];
    if (!selector) {
      throw new Error(`Unknown navigation section: ${section}`);
    }

    await this.click(selector);
  }

  /**
   * Open the user menu dropdown
   *
   * @returns Promise that resolves when user menu is opened
   *
   * @example
   * ```typescript
   * await header.openUserMenu();
   * ```
   */
  async openUserMenu(): Promise<void> {
    await this.click(this.selectors.userMenu.trigger);
    await this.locator(this.selectors.userMenu.dropdown).waitFor({ state: 'visible' });
  }

  /**
   * Get the logged-in user's name from the user menu
   *
   * @returns Logged-in user's name
   *
   * @example
   * ```typescript
   * const username = await header.getLoggedInUserName();
   * expect(username).toBe('John Doe');
   * ```
   */
  async getLoggedInUserName(): Promise<string> {
    // Open user menu if not already open
    const isMenuVisible = await this.isElementVisible(
      this.selectors.userMenu.dropdown,
      1000
    );

    if (!isMenuVisible) {
      await this.openUserMenu();
    }

    return this.getText(this.selectors.userMenu.username);
  }

  /**
   * Logout from the application
   *
   * @returns Promise that resolves when logout is clicked
   *
   * @example
   * ```typescript
   * await header.logout();
   * ```
   */
  async logout(): Promise<void> {
    await this.openUserMenu();
    await this.click(this.selectors.userMenu.logout);
  }

  /**
   * Navigate to profile page via user menu
   *
   * @returns Promise that resolves when profile link is clicked
   *
   * @example
   * ```typescript
   * await header.goToProfile();
   * ```
   */
  async goToProfile(): Promise<void> {
    await this.openUserMenu();
    await this.click(this.selectors.userMenu.profile);
  }

  /**
   * Navigate to settings page via user menu
   *
   * @returns Promise that resolves when settings link is clicked
   *
   * @example
   * ```typescript
   * await header.goToSettings();
   * ```
   */
  async goToSettings(): Promise<void> {
    await this.openUserMenu();
    await this.click(this.selectors.userMenu.settings);
  }

  /**
   * Perform a search using the header search input
   *
   * @param query - Search query
   * @returns Promise that resolves when search is submitted
   *
   * @example
   * ```typescript
   * await header.search('test query');
   * ```
   */
  async search(query: string): Promise<void> {
    await this.fill(this.selectors.searchInput, query);
    await this.page.keyboard.press('Enter');
  }

  /**
   * Click the notification icon
   *
   * @returns Promise that resolves when notification icon is clicked
   *
   * @example
   * ```typescript
   * await header.clickNotificationIcon();
   * ```
   */
  async clickNotificationIcon(): Promise<void> {
    await this.click(this.selectors.notificationIcon);
  }

  /**
   * Get the notification count from the badge
   *
   * @returns Notification count as a number
   *
   * @example
   * ```typescript
   * const count = await header.getNotificationCount();
   * expect(count).toBeGreaterThan(0);
   * ```
   */
  async getNotificationCount(): Promise<number> {
    const hasNotificationBadge = await this.isElementVisible(
      this.selectors.notificationBadge,
      1000
    );

    if (!hasNotificationBadge) {
      return 0;
    }

    const badgeText = await this.getText(this.selectors.notificationBadge);
    return parseInt(badgeText, 10) || 0;
  }

  /**
   * Check if user is logged in
   * Determined by the presence of the user menu
   *
   * @returns True if user is logged in, false otherwise
   *
   * @example
   * ```typescript
   * const isLoggedIn = await header.isUserLoggedIn();
   * expect(isLoggedIn).toBe(true);
   * ```
   */
  async isUserLoggedIn(): Promise<boolean> {
    return this.isElementVisible(this.selectors.userMenu.trigger);
  }
}
