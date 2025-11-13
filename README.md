# Playwright Enterprise Test Automation Framework

[![Playwright Tests](https://github.com/yourusername/playwrightproject/actions/workflows/playwright.yml/badge.svg)](https://github.com/yourusername/playwrightproject/actions/workflows/playwright.yml)

A comprehensive, enterprise-grade test automation framework built with Playwright and TypeScript. This framework follows industry best practices and design patterns to ensure scalability, maintainability, and reliability.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Writing Tests](#writing-tests)
- [Running Tests](#running-tests)
- [Best Practices](#best-practices)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Features

### Core Capabilities
- ✅ **TypeScript** - Type-safe test development
- ✅ **Page Object Model** - Maintainable page representations
- ✅ **Component Model** - Reusable UI components
- ✅ **Custom Fixtures** - Advanced test setup and teardown
- ✅ **Data Generators** - Dynamic test data creation
- ✅ **API Helpers** - Backend interaction utilities
- ✅ **Wait Helpers** - Smart wait strategies
- ✅ **Multi-Environment** - Support for dev, staging, QA, production

### Quality & Reliability
- ✅ **ESLint** - Code quality enforcement
- ✅ **Prettier** - Consistent code formatting
- ✅ **GitHub Actions** - Automated CI/CD pipeline
- ✅ **Parallel Execution** - Fast test execution
- ✅ **Retry Logic** - Flaky test mitigation
- ✅ **Screenshot/Video** - Failure debugging

## Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Git**

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/playwrightproject.git
cd playwrightproject
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Playwright Browsers

```bash
npx playwright install chromium
```

### 4. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### 5. Run Your First Test

```bash
# Run smoke tests
npm run test:smoke

# Or run all tests
npm test
```

### 6. View Test Report

```bash
npm run report
```

## Project Structure

```
playwrightproject/
├── .github/
│   └── workflows/
│       └── playwright.yml         # CI/CD pipeline configuration
├── src/
│   ├── pages/                     # Page Object Models
│   │   ├── base/
│   │   │   └── BasePage.ts        # Base page class
│   │   ├── components/            # Reusable UI components
│   │   │   ├── BaseComponent.ts   # Base component class
│   │   │   └── Header.component.ts
│   │   └── modules/               # Feature-specific pages
│   │       ├── auth/
│   │       ├── dashboard/
│   │       └── profile/
│   ├── fixtures/                  # Custom Playwright fixtures
│   │   └── baseFixtures.ts
│   ├── utils/                     # Utility functions
│   │   ├── apiHelpers.ts          # API interaction helpers
│   │   ├── dataGenerators.ts      # Test data generators
│   │   ├── waitHelpers.ts         # Custom wait conditions
│   │   └── constants.ts           # Application constants
│   ├── config/                    # Configuration files
│   │   ├── environments.ts        # Environment configurations
│   │   └── users.ts               # Test user configurations
│   └── types/                     # TypeScript type definitions
├── tests/                         # Test specifications
│   ├── e2e/                       # End-to-end tests
│   ├── integration/               # Integration tests
│   └── smoke/                     # Smoke tests
├── test-data/                     # Test data files
├── playwright.config.ts           # Playwright configuration
├── tsconfig.json                  # TypeScript configuration
├── .eslintrc.json                 # ESLint configuration
├── .prettierrc.json               # Prettier configuration
└── package.json                   # Project dependencies
```

## Configuration

### Environment Variables

Configure your test environment by editing the `.env` file:

```bash
# Test Environment
TEST_ENV=staging                   # development | staging | qa | production

# Application URLs
BASE_URL=https://staging.example.com
API_URL=https://api-staging.example.com

# Test User Credentials
TEST_USER_EMAIL=test.user@example.com
TEST_USER_PASSWORD=TestPassword123!

# Playwright Configuration
HEADLESS=true
WORKERS=4
RETRIES=2
```

### Multiple Environments

The framework supports multiple environments out of the box:

```typescript
// In your test
import { getCurrentEnvironment } from '../config/environments';

const env = getCurrentEnvironment();
await page.goto(env.baseURL);
```

Environments are defined in `src/config/environments.ts` and can be switched via the `TEST_ENV` environment variable.

## Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '../fixtures/baseFixtures';

test.describe('Login Functionality', () => {
  test('should login with valid credentials', async ({ page }) => {
    // Arrange
    await page.goto('/login');

    // Act
    await page.fill('#email', 'user@example.com');
    await page.fill('#password', 'password123');
    await page.click('button[type="submit"]');

    // Assert
    await expect(page).toHaveURL(/dashboard/);
  });
});
```

### Using Page Objects

```typescript
import { test, expect } from '../fixtures/baseFixtures';
import { LoginPage } from '../pages/modules/auth/LoginPage';
import { DashboardPage } from '../pages/modules/dashboard/DashboardPage';

test('login and verify dashboard', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  await loginPage.navigate();
  await loginPage.login('user@example.com', 'password123');

  await dashboardPage.verifyPageLoaded();
  const username = await dashboardPage.getUsername();
  expect(username).toBe('Test User');
});
```

### Using Components

```typescript
import { test, expect } from '../fixtures/baseFixtures';
import { HeaderComponent } from '../pages/components/Header.component';

test('verify header navigation', async ({ page }) => {
  await page.goto('/');

  const header = new HeaderComponent(page);
  await header.waitForVisible();

  await header.navigateTo('Dashboard');
  await expect(page).toHaveURL(/dashboard/);
});
```

### Using Data Generators

```typescript
import { generateTestUser, generateUniqueEmail } from '../utils/dataGenerators';

test('register new user', async ({ page }) => {
  const testUser = generateTestUser();

  await page.goto('/register');
  await page.fill('#email', testUser.email);
  await page.fill('#password', testUser.password);
  await page.fill('#firstName', testUser.firstName);
  await page.fill('#lastName', testUser.lastName);
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/dashboard/);
});
```

### Using API Helpers

```typescript
import { test, expect } from '../fixtures/baseFixtures';
import { createApiContext, post } from '../utils/apiHelpers';

test('create user via API', async ({ }) => {
  const apiContext = await createApiContext();

  const response = await post(apiContext, '/api/users', {
    data: {
      name: 'John Doe',
      email: 'john@example.com'
    }
  });

  expect(response.status).toBe(201);
  expect(response.data).toHaveProperty('id');
});
```

## Running Tests

### Available Commands

```bash
# Run all tests
npm test

# Run smoke tests only
npm run test:smoke

# Run E2E tests
npm run test:e2e

# Run integration tests
npm run test:integration

# Run tests in headed mode (see browser)
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run tests in UI mode (interactive)
npm run test:ui

# Generate tests using codegen
npm run test:codegen

# View test report
npm run report
```

### Running Specific Tests

```bash
# Run a specific test file
npx playwright test tests/e2e/auth/login.spec.ts

# Run tests matching a pattern
npx playwright test --grep "login"

# Run tests in a specific project
npx playwright test --project=chromium
```

### Code Quality Commands

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check

# Type check
npm run type-check

# Clean up test artifacts
npm run clean
```

## Best Practices

### 1. Test Organization

- Group related tests in `describe` blocks
- Use descriptive test names that explain intent
- Follow the Arrange-Act-Assert pattern

```typescript
test.describe('User Authentication', () => {
  test('should successfully login with valid credentials', async ({ page }) => {
    // Arrange - Set up test data and navigate
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    // Act - Perform the action
    await loginPage.login('user@example.com', 'password');

    // Assert - Verify the outcome
    await expect(page).toHaveURL(/dashboard/);
  });
});
```

### 2. Avoid Hard Waits

```typescript
// ❌ Bad - Hard wait
await page.waitForTimeout(5000);

// ✅ Good - Wait for specific condition
await page.waitForSelector('.data-loaded');

// ✅ Better - Use auto-waiting
await expect(page.locator('.status')).toHaveText('Ready');
```

### 3. Use Page Objects

```typescript
// ❌ Bad - Direct interaction in test
await page.click('#login-button');
await page.fill('#email', 'test@example.com');

// ✅ Good - Use page objects
const loginPage = new LoginPage(page);
await loginPage.login('test@example.com', 'password');
```

### 4. Generate Dynamic Data

```typescript
// ❌ Bad - Hardcoded data
const email = 'test@example.com';

// ✅ Good - Generate unique data
const email = generateUniqueEmail('testuser');
```

### 5. Independent Tests

```typescript
// ✅ Each test should be independent
test.beforeEach(async ({ page }) => {
  // Set up fresh state for each test
  await page.goto('/');
});

// ❌ Don't depend on previous test state
```

## CI/CD Integration

The framework includes a comprehensive GitHub Actions workflow that:

- Runs linting and type checking
- Executes smoke tests on PRs
- Runs full E2E suite on main branch
- Performs daily regression tests
- Supports manual test execution with environment selection
- Uploads test artifacts and reports

### Workflow Triggers

- **Push to main/develop**: Full E2E test suite
- **Pull Request**: Smoke tests only
- **Schedule**: Daily regression tests at 2 AM UTC
- **Manual**: On-demand execution with environment selection

### Secrets Configuration

Add these secrets to your GitHub repository:

- `BASE_URL`: Application base URL
- `TEST_USER_EMAIL`: Test user email
- `TEST_USER_PASSWORD`: Test user password

## Troubleshooting

### Common Issues

#### 1. Tests failing with timeout errors

```bash
# Increase timeout in playwright.config.ts
timeout: 60 * 1000  // 60 seconds
```

#### 2. Browser not installed

```bash
# Install Playwright browsers
npx playwright install chromium
```

#### 3. TypeScript errors

```bash
# Check TypeScript configuration
npm run type-check

# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 4. Linting errors

```bash
# Auto-fix linting issues
npm run lint:fix
```

### Debug Mode

Run tests in debug mode to step through test execution:

```bash
npm run test:debug
```

Or use Playwright Inspector:

```bash
PWDEBUG=1 npm test
```

### UI Mode

Use Playwright's UI mode for interactive debugging:

```bash
npm run test:ui
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Development Workflow

1. Create a feature branch
2. Make your changes
3. Run linter and tests
4. Submit a pull request

```bash
git checkout -b feature/my-new-feature
# Make changes
npm run lint
npm run type-check
npm test
git commit -am "Add new feature"
git push origin feature/my-new-feature
```

## Resources

- [Playwright Documentation](https://playwright.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Test Plan](TESTPLAN.md)
- [Contributing Guide](CONTRIBUTING.md)

## License

This project is licensed under the ISC License.

## Support

For issues and questions:
- Create an issue in the GitHub repository
- Contact the QA team

---

**Happy Testing!** 🎭
