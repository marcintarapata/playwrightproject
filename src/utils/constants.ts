/**
 * Application Constants
 *
 * This file contains reusable constants used throughout the test suite.
 * Centralizing constants improves maintainability and reduces duplication.
 *
 * @module utils/constants
 */

/**
 * Timeout Constants (in milliseconds)
 */
export const TIMEOUTS = {
  /** Extra short timeout for fast operations */
  EXTRA_SHORT: 2000,
  /** Short timeout for quick operations */
  SHORT: 5000,
  /** Medium timeout for standard operations */
  MEDIUM: 10000,
  /** Long timeout for slow operations */
  LONG: 30000,
  /** Extra long timeout for very slow operations */
  EXTRA_LONG: 60000,
  /** Page load timeout */
  PAGE_LOAD: 30000,
  /** API request timeout */
  API_REQUEST: 15000,
  /** Animation timeout */
  ANIMATION: 1000,
} as const;

/**
 * Wait Constants
 * Small delays for specific scenarios
 */
export const WAIT = {
  /** Minimum wait for UI updates */
  UI_UPDATE: 500,
  /** Wait for debounced inputs */
  DEBOUNCE: 300,
  /** Wait for animations to complete */
  ANIMATION: 1000,
  /** Wait between retry attempts */
  RETRY: 2000,
} as const;

/**
 * Test Data Constants
 */
export const TEST_DATA = {
  /** Default test email domain */
  EMAIL_DOMAIN: 'test.example.com',
  /** Default password for test users */
  DEFAULT_PASSWORD: 'TestPassword123!',
  /** Valid email pattern */
  VALID_EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

/**
 * UI Element Selectors
 * Common selectors used across the application
 */
export const SELECTORS = {
  /** Common button selectors */
  BUTTONS: {
    SUBMIT: '[type="submit"]',
    CANCEL: '[data-testid="cancel-button"]',
    CLOSE: '[data-testid="close-button"]',
    SAVE: '[data-testid="save-button"]',
    DELETE: '[data-testid="delete-button"]',
  },
  /** Common form selectors */
  FORMS: {
    ERROR_MESSAGE: '.error-message',
    SUCCESS_MESSAGE: '.success-message',
    REQUIRED_FIELD: '[required]',
    INPUT_ERROR: '.input-error',
  },
  /** Common navigation selectors */
  NAVIGATION: {
    HEADER: 'header[role="banner"]',
    NAV_MENU: 'nav[role="navigation"]',
    FOOTER: 'footer[role="contentinfo"]',
  },
  /** Common modal selectors */
  MODAL: {
    CONTAINER: '[role="dialog"]',
    OVERLAY: '.modal-overlay',
    CLOSE_BUTTON: '[aria-label="Close"]',
  },
} as const;

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * API Endpoints
 * Centralized API endpoint definitions
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REGISTER: '/api/auth/register',
    REFRESH_TOKEN: '/api/auth/refresh',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
  },
  USER: {
    PROFILE: '/api/user/profile',
    UPDATE: '/api/user/update',
    DELETE: '/api/user/delete',
    LIST: '/api/users',
  },
} as const;

/**
 * Error Messages
 * Common error messages for assertions
 */
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PASSWORD: 'Password does not meet requirements',
  LOGIN_FAILED: 'Invalid email or password',
  NETWORK_ERROR: 'Network error. Please try again.',
  SERVER_ERROR: 'Server error. Please contact support.',
} as const;

/**
 * Success Messages
 * Common success messages for assertions
 */
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in',
  LOGOUT_SUCCESS: 'Successfully logged out',
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
} as const;

/**
 * Regular Expressions
 * Common regex patterns for validation
 */
export const REGEX = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  PHONE: /^\+?[\d\s-()]+$/,
  URL: /^https?:\/\/.+/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
} as const;

/**
 * Viewport Sizes
 * Common viewport dimensions for responsive testing
 */
export const VIEWPORTS = {
  MOBILE: { width: 375, height: 667 },
  TABLET: { width: 768, height: 1024 },
  DESKTOP: { width: 1280, height: 720 },
  DESKTOP_LARGE: { width: 1920, height: 1080 },
} as const;

/**
 * Test Tags
 * Used for categorizing and filtering tests
 */
export const TEST_TAGS = {
  SMOKE: '@smoke',
  REGRESSION: '@regression',
  E2E: '@e2e',
  INTEGRATION: '@integration',
  CRITICAL: '@critical',
  FLAKY: '@flaky',
} as const;
