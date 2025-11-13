/**
 * Environment Configuration
 *
 * This file defines configuration settings for different environments.
 * Use these configurations to manage environment-specific settings like
 * base URLs, timeouts, and feature flags.
 *
 * @module config/environments
 */

/**
 * Environment Configuration Interface
 */
export interface EnvironmentConfig {
  /** Base URL for the application */
  baseURL: string;
  /** API base URL (if different from application URL) */
  apiURL?: string;
  /** Default timeout for operations (milliseconds) */
  timeout: number;
  /** Maximum number of retries for flaky operations */
  retries: number;
  /** Whether to run tests in headless mode */
  headless: boolean;
  /** Environment name */
  name: string;
  /** Feature flags for environment-specific features */
  features?: {
    authentication?: boolean;
    payments?: boolean;
    analytics?: boolean;
  };
}

/**
 * Development Environment Configuration
 */
export const development: EnvironmentConfig = {
  name: 'development',
  baseURL: 'http://localhost:3000',
  apiURL: 'http://localhost:3001/api',
  timeout: 30000,
  retries: 0,
  headless: false,
  features: {
    authentication: true,
    payments: false, // Mock payments in dev
    analytics: false, // Disable analytics in dev
  },
};

/**
 * Staging Environment Configuration
 */
export const staging: EnvironmentConfig = {
  name: 'staging',
  baseURL: 'https://staging.example.com',
  apiURL: 'https://api-staging.example.com',
  timeout: 45000,
  retries: 1,
  headless: true,
  features: {
    authentication: true,
    payments: true,
    analytics: true,
  },
};

/**
 * Production Environment Configuration
 * Note: Use with caution. Prefer smoke tests only in production.
 */
export const production: EnvironmentConfig = {
  name: 'production',
  baseURL: 'https://example.com',
  apiURL: 'https://api.example.com',
  timeout: 60000,
  retries: 2,
  headless: true,
  features: {
    authentication: true,
    payments: true,
    analytics: true,
  },
};

/**
 * QA Environment Configuration
 */
export const qa: EnvironmentConfig = {
  name: 'qa',
  baseURL: 'https://qa.example.com',
  apiURL: 'https://api-qa.example.com',
  timeout: 40000,
  retries: 1,
  headless: true,
  features: {
    authentication: true,
    payments: true,
    analytics: true,
  },
};

/**
 * Get the current environment configuration
 * Reads from process.env.TEST_ENV or defaults to 'development'
 *
 * @returns Current environment configuration
 * @example
 * ```typescript
 * const config = getCurrentEnvironment();
 * await page.goto(config.baseURL);
 * ```
 */
export function getCurrentEnvironment(): EnvironmentConfig {
  const env = process.env.TEST_ENV || 'development';

  const environments: Record<string, EnvironmentConfig> = {
    development,
    staging,
    production,
    qa,
  };

  const config = environments[env];

  if (!config) {
    console.warn(`Unknown environment: ${env}. Falling back to development.`);
    return development;
  }

  // Override with environment variables if provided
  return {
    ...config,
    baseURL: process.env.BASE_URL || config.baseURL,
    apiURL: process.env.API_URL || config.apiURL,
  };
}

/**
 * Check if a feature is enabled in the current environment
 *
 * @param feature - Feature name to check
 * @returns Whether the feature is enabled
 * @example
 * ```typescript
 * if (isFeatureEnabled('payments')) {
 *   // Test payment functionality
 * }
 * ```
 */
export function isFeatureEnabled(
  feature: keyof NonNullable<EnvironmentConfig['features']>
): boolean {
  const config = getCurrentEnvironment();
  return config.features?.[feature] ?? false;
}
