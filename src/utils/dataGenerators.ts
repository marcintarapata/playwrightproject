/**
 * Data Generators
 *
 * This module provides utility functions for generating test data.
 * Use these generators to create unique, realistic test data for your tests.
 *
 * Benefits:
 * - Avoid hardcoded test data
 * - Ensure data uniqueness across test runs
 * - Generate realistic data patterns
 * - Support for various data types
 *
 * @module utils/dataGenerators
 */

import { TEST_DATA } from './constants';

/**
 * Generate a random string
 *
 * @param length - Length of the string
 * @param charset - Character set to use (default: alphanumeric)
 * @returns Random string
 *
 * @example
 * ```typescript
 * const randomId = generateRandomString(10);
 * // Output: "a3f5k9d2h7"
 * ```
 */
export function generateRandomString(
  length: number,
  charset: 'alphanumeric' | 'alpha' | 'numeric' = 'alphanumeric'
): string {
  const charsets = {
    alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    alpha: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    numeric: '0123456789',
  };

  const characters = charsets[charset];
  let result = '';

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

/**
 * Generate a unique email address
 *
 * @param prefix - Email prefix (optional)
 * @param domain - Email domain (optional)
 * @returns Unique email address
 *
 * @example
 * ```typescript
 * const email = generateUniqueEmail('testuser');
 * // Output: "testuser_1234567890@test.example.com"
 * ```
 */
export function generateUniqueEmail(
  prefix: string = 'user',
  domain: string = TEST_DATA.EMAIL_DOMAIN
): string {
  const timestamp = Date.now();
  const random = generateRandomString(4, 'alphanumeric').toLowerCase();
  return `${prefix}_${timestamp}_${random}@${domain}`;
}

/**
 * Generate a unique username
 *
 * @param prefix - Username prefix (optional)
 * @returns Unique username
 *
 * @example
 * ```typescript
 * const username = generateUniqueUsername('john');
 * // Output: "john_1234567890"
 * ```
 */
export function generateUniqueUsername(prefix: string = 'user'): string {
  const timestamp = Date.now();
  return `${prefix}_${timestamp}`;
}

/**
 * Generate a random number within a range
 *
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns Random number
 *
 * @example
 * ```typescript
 * const age = generateRandomNumber(18, 65);
 * // Output: 42
 * ```
 */
export function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random phone number
 *
 * @param format - Phone format ('US' or 'International')
 * @returns Random phone number
 *
 * @example
 * ```typescript
 * const phone = generatePhoneNumber('US');
 * // Output: "+1-555-123-4567"
 * ```
 */
export function generatePhoneNumber(format: 'US' | 'International' = 'US'): string {
  if (format === 'US') {
    const areaCode = generateRandomNumber(200, 999);
    const prefix = generateRandomNumber(200, 999);
    const lineNumber = generateRandomNumber(1000, 9999);
    return `+1-${areaCode}-${prefix}-${lineNumber}`;
  } else {
    const countryCode = generateRandomNumber(1, 99);
    const number = generateRandomString(10, 'numeric');
    return `+${countryCode}-${number}`;
  }
}

/**
 * Generate a random date within a range
 *
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Random date
 *
 * @example
 * ```typescript
 * const birthDate = generateRandomDate(
 *   new Date('1950-01-01'),
 *   new Date('2000-12-31')
 * );
 * ```
 */
export function generateRandomDate(startDate: Date, endDate: Date): Date {
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();
  const randomTime = startTime + Math.random() * (endTime - startTime);
  return new Date(randomTime);
}

/**
 * Generate a random boolean
 *
 * @param probability - Probability of true (0-1, default 0.5)
 * @returns Random boolean
 *
 * @example
 * ```typescript
 * const isActive = generateRandomBoolean(0.7); // 70% chance of true
 * ```
 */
export function generateRandomBoolean(probability: number = 0.5): boolean {
  return Math.random() < probability;
}

/**
 * Generate a random UUID v4
 *
 * @returns UUID v4 string
 *
 * @example
 * ```typescript
 * const id = generateUUID();
 * // Output: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 * ```
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Pick a random item from an array
 *
 * @param array - Array to pick from
 * @returns Random item from the array
 *
 * @example
 * ```typescript
 * const colors = ['red', 'green', 'blue'];
 * const randomColor = pickRandom(colors);
 * // Output: "green" (or any other color)
 * ```
 */
export function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)] as T;
}

/**
 * Generate a random name
 *
 * @param type - Type of name ('first', 'last', or 'full')
 * @returns Random name
 *
 * @example
 * ```typescript
 * const firstName = generateRandomName('first');
 * const fullName = generateRandomName('full');
 * ```
 */
export function generateRandomName(type: 'first' | 'last' | 'full' = 'full'): string {
  const firstNames = [
    'James',
    'Mary',
    'John',
    'Patricia',
    'Robert',
    'Jennifer',
    'Michael',
    'Linda',
    'William',
    'Elizabeth',
    'David',
    'Barbara',
    'Richard',
    'Susan',
    'Joseph',
    'Jessica',
  ];

  const lastNames = [
    'Smith',
    'Johnson',
    'Williams',
    'Brown',
    'Jones',
    'Garcia',
    'Miller',
    'Davis',
    'Rodriguez',
    'Martinez',
    'Hernandez',
    'Lopez',
    'Gonzalez',
    'Wilson',
    'Anderson',
    'Thomas',
  ];

  if (type === 'first') {
    return pickRandom(firstNames);
  } else if (type === 'last') {
    return pickRandom(lastNames);
  } else {
    return `${pickRandom(firstNames)} ${pickRandom(lastNames)}`;
  }
}

/**
 * Generate a random address
 *
 * @returns Random address object
 *
 * @example
 * ```typescript
 * const address = generateRandomAddress();
 * // Output: {
 * //   street: "123 Main St",
 * //   city: "New York",
 * //   state: "NY",
 * //   zipCode: "10001",
 * //   country: "USA"
 * // }
 * ```
 */
export function generateRandomAddress(): {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
} {
  const streetNumber = generateRandomNumber(1, 9999);
  const streets = ['Main St', 'Oak Ave', 'Pine Rd', 'Maple Dr', 'Cedar Ln', 'Elm St'];
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'];
  const states = ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA'];
  const zipCode = generateRandomString(5, 'numeric');

  return {
    street: `${streetNumber} ${pickRandom(streets)}`,
    city: pickRandom(cities),
    state: pickRandom(states),
    zipCode,
    country: 'USA',
  };
}

/**
 * Generate test user data
 *
 * @param overrides - Optional overrides for specific fields
 * @returns Complete user object for testing
 *
 * @example
 * ```typescript
 * const user = generateTestUser({
 *   email: 'specific@example.com'
 * });
 * ```
 */
export function generateTestUser(overrides?: {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}): {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
} {
  const firstName = overrides?.firstName || generateRandomName('first');
  const lastName = overrides?.lastName || generateRandomName('last');

  return {
    email: overrides?.email || generateUniqueEmail(),
    password: overrides?.password || TEST_DATA.DEFAULT_PASSWORD,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    phone: overrides?.phone || generatePhoneNumber('US'),
  };
}
