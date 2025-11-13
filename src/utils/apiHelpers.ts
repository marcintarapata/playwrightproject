/**
 * API Helpers
 *
 * Utility functions for making API requests during tests.
 * These helpers are useful for:
 * - Test data setup (creating users, entities, etc.)
 * - Validation (checking backend state)
 * - Authentication (getting tokens)
 * - Bypassing UI for faster test setup
 *
 * @module utils/apiHelpers
 */

import { APIRequestContext, request } from '@playwright/test';
import { getCurrentEnvironment } from '../config/environments';
import { HTTP_STATUS } from './constants';

/**
 * API Response Interface
 */
export interface ApiResponse<T = unknown> {
  status: number;
  ok: boolean;
  data?: T;
  error?: string;
  headers: Record<string, string>;
}

/**
 * Create an API request context
 *
 * @param options - Request context options
 * @returns API request context
 *
 * @example
 * ```typescript
 * const apiContext = await createApiContext({
 *   extraHTTPHeaders: { 'Authorization': 'Bearer token' }
 * });
 * ```
 */
export async function createApiContext(
  options: {
    baseURL?: string;
    extraHTTPHeaders?: Record<string, string>;
    ignoreHTTPSErrors?: boolean;
  } = {}
): Promise<APIRequestContext> {
  const env = getCurrentEnvironment();

  return request.newContext({
    baseURL: options.baseURL || env.apiURL || env.baseURL,
    extraHTTPHeaders: options.extraHTTPHeaders || {},
    ignoreHTTPSErrors: options.ignoreHTTPSErrors ?? true,
  });
}

/**
 * Make a GET request
 *
 * @param apiContext - API request context
 * @param endpoint - API endpoint
 * @param options - Request options
 * @returns API response
 *
 * @example
 * ```typescript
 * const response = await get(apiContext, '/api/users/123');
 * expect(response.ok).toBe(true);
 * expect(response.data).toHaveProperty('id', '123');
 * ```
 */
export async function get<T = unknown>(
  apiContext: APIRequestContext,
  endpoint: string,
  options: {
    params?: Record<string, string>;
    headers?: Record<string, string>;
  } = {}
): Promise<ApiResponse<T>> {
  const response = await apiContext.get(endpoint, {
    params: options.params,
    headers: options.headers,
  });

  return parseResponse<T>(response);
}

/**
 * Make a POST request
 *
 * @param apiContext - API request context
 * @param endpoint - API endpoint
 * @param options - Request options
 * @returns API response
 *
 * @example
 * ```typescript
 * const response = await post(apiContext, '/api/users', {
 *   data: { name: 'John Doe', email: 'john@example.com' }
 * });
 * expect(response.status).toBe(201);
 * ```
 */
export async function post<T = unknown>(
  apiContext: APIRequestContext,
  endpoint: string,
  options: {
    data?: unknown;
    headers?: Record<string, string>;
  } = {}
): Promise<ApiResponse<T>> {
  const response = await apiContext.post(endpoint, {
    data: options.data,
    headers: options.headers,
  });

  return parseResponse<T>(response);
}

/**
 * Make a PUT request
 *
 * @param apiContext - API request context
 * @param endpoint - API endpoint
 * @param options - Request options
 * @returns API response
 *
 * @example
 * ```typescript
 * const response = await put(apiContext, '/api/users/123', {
 *   data: { name: 'Jane Doe' }
 * });
 * ```
 */
export async function put<T = unknown>(
  apiContext: APIRequestContext,
  endpoint: string,
  options: {
    data?: unknown;
    headers?: Record<string, string>;
  } = {}
): Promise<ApiResponse<T>> {
  const response = await apiContext.put(endpoint, {
    data: options.data,
    headers: options.headers,
  });

  return parseResponse<T>(response);
}

/**
 * Make a PATCH request
 *
 * @param apiContext - API request context
 * @param endpoint - API endpoint
 * @param options - Request options
 * @returns API response
 *
 * @example
 * ```typescript
 * const response = await patch(apiContext, '/api/users/123', {
 *   data: { email: 'newemail@example.com' }
 * });
 * ```
 */
export async function patch<T = unknown>(
  apiContext: APIRequestContext,
  endpoint: string,
  options: {
    data?: unknown;
    headers?: Record<string, string>;
  } = {}
): Promise<ApiResponse<T>> {
  const response = await apiContext.patch(endpoint, {
    data: options.data,
    headers: options.headers,
  });

  return parseResponse<T>(response);
}

/**
 * Make a DELETE request
 *
 * @param apiContext - API request context
 * @param endpoint - API endpoint
 * @param options - Request options
 * @returns API response
 *
 * @example
 * ```typescript
 * const response = await del(apiContext, '/api/users/123');
 * expect(response.status).toBe(204);
 * ```
 */
export async function del<T = unknown>(
  apiContext: APIRequestContext,
  endpoint: string,
  options: {
    headers?: Record<string, string>;
  } = {}
): Promise<ApiResponse<T>> {
  const response = await apiContext.delete(endpoint, {
    headers: options.headers,
  });

  return parseResponse<T>(response);
}

/**
 * Parse API response
 *
 * @param response - Playwright API response
 * @returns Parsed API response
 */
async function parseResponse<T>(response: Awaited<ReturnType<APIRequestContext['get']>>): Promise<ApiResponse<T>> {
  const status = response.status();
  const ok = response.ok();
  const headers: Record<string, string> = {};

  // Convert headers to plain object
  response.headersArray().forEach((header) => {
    headers[header.name] = header.value;
  });

  let data: T | undefined;
  let error: string | undefined;

  try {
    const text = await response.text();
    if (text) {
      data = JSON.parse(text) as T;
    }
  } catch {
    // Response might not be JSON
    error = 'Failed to parse response';
  }

  if (!ok) {
    error = `Request failed with status ${status}`;
  }

  return {
    status,
    ok,
    data,
    error,
    headers,
  };
}

/**
 * Login via API and get authentication token
 *
 * @param apiContext - API request context
 * @param credentials - Login credentials
 * @returns Authentication token
 *
 * @example
 * ```typescript
 * const token = await loginViaApi(apiContext, {
 *   email: 'user@example.com',
 *   password: 'password123'
 * });
 * ```
 */
export async function loginViaApi(
  apiContext: APIRequestContext,
  credentials: {
    email: string;
    password: string;
  }
): Promise<string> {
  const response = await post<{ token: string }>(apiContext, '/api/auth/login', {
    data: credentials,
  });

  if (!response.ok || !response.data?.token) {
    throw new Error(`Login failed: ${response.error}`);
  }

  return response.data.token;
}

/**
 * Validate API response status
 *
 * @param response - API response
 * @param expectedStatus - Expected status code
 * @throws Error if status doesn't match
 *
 * @example
 * ```typescript
 * const response = await get(apiContext, '/api/users');
 * validateResponseStatus(response, 200);
 * ```
 */
export function validateResponseStatus(
  response: ApiResponse,
  expectedStatus: number
): void {
  if (response.status !== expectedStatus) {
    throw new Error(
      `Expected status ${expectedStatus}, but got ${response.status}. Error: ${response.error}`
    );
  }
}

/**
 * Wait for API condition to be met
 *
 * Polls an API endpoint until a condition is met or timeout is reached.
 *
 * @param apiContext - API request context
 * @param endpoint - API endpoint to poll
 * @param condition - Condition function that receives the response
 * @param options - Polling options
 * @returns Promise that resolves when condition is met
 *
 * @example
 * ```typescript
 * await waitForApiCondition(
 *   apiContext,
 *   '/api/jobs/123',
 *   (response) => response.data?.status === 'completed',
 *   { timeout: 30000, interval: 2000 }
 * );
 * ```
 */
export async function waitForApiCondition<T = unknown>(
  apiContext: APIRequestContext,
  endpoint: string,
  condition: (response: ApiResponse<T>) => boolean,
  options: {
    timeout?: number;
    interval?: number;
  } = {}
): Promise<void> {
  const timeout = options.timeout || 30000;
  const interval = options.interval || 2000;
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const response = await get<T>(apiContext, endpoint);

    if (condition(response)) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error(`API condition not met within timeout (${timeout}ms)`);
}

/**
 * Common HTTP status validators
 */
export const StatusValidators = {
  isOk: (status: number) => status === HTTP_STATUS.OK,
  isCreated: (status: number) => status === HTTP_STATUS.CREATED,
  isNoContent: (status: number) => status === HTTP_STATUS.NO_CONTENT,
  isSuccess: (status: number) => status >= 200 && status < 300,
  isClientError: (status: number) => status >= 400 && status < 500,
  isServerError: (status: number) => status >= 500 && status < 600,
  isError: (status: number) => status >= 400,
};
