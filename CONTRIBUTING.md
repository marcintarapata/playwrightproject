# Contributing to Playwright Enterprise Test Framework

Thank you for your interest in contributing to our test automation framework! This document provides guidelines and best practices for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Writing Tests](#writing-tests)
- [Creating Page Objects](#creating-page-objects)
- [Pull Request Process](#pull-request-process)
- [Commit Guidelines](#commit-guidelines)

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Focus on constructive feedback
- Prioritize quality over quantity
- Help others learn and grow

### Our Responsibilities

- Maintain code quality
- Review PRs promptly
- Provide helpful feedback
- Keep documentation updated

## Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/playwrightproject.git
cd playwrightproject
```

### 2. Install Dependencies

```bash
npm install
npx playwright install chromium
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Branch naming conventions:
- `feature/` - New features or enhancements
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test-only changes

## Development Workflow

### 1. Make Your Changes

- Follow the coding standards (see below)
- Write tests for new functionality
- Update documentation as needed

### 2. Run Quality Checks

```bash
# Type check
npm run type-check

# Lint code
npm run lint

# Format code
npm run format

# Run tests
npm test
```

### 3. Commit Your Changes

```bash
git add .
git commit -m "feat: add new feature"
```

See [Commit Guidelines](#commit-guidelines) for commit message format.

### 4. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Coding Standards

### TypeScript

#### Use Strong Typing

```typescript
// ✅ Good
async function getUserById(id: string): Promise<User> {
  // ...
}

// ❌ Bad
async function getUserById(id: any): Promise<any> {
  // ...
}
```

#### Avoid `any` Type

```typescript
// ✅ Good
type Config = {
  url: string;
  timeout: number;
};

// ❌ Bad
type Config = {
  url: any;
  timeout: any;
};
```

#### Use `const` by Default

```typescript
// ✅ Good
const userName = 'John Doe';
let counter = 0;  // Only when reassignment is needed

// ❌ Bad
let userName = 'John Doe';
var counter = 0;
```

### Naming Conventions

#### Files

```
PascalCase.ts         → LoginPage.ts, UserService.ts
PascalCase.component.ts → Header.component.ts
kebab-case.spec.ts    → user-login.spec.ts
camelCase.ts          → dateHelpers.ts, apiHelpers.ts
```

#### Variables and Functions

```typescript
// Variables - camelCase
const userName = 'John';
const isActive = true;

// Functions - camelCase
async function getUserData() {}
function calculateTotal() {}

// Classes - PascalCase
class LoginPage {}
class UserService {}

// Constants - UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
const DEFAULT_TIMEOUT = 30000;
```

### Code Organization

#### Imports

```typescript
// 1. External imports
import { test, expect } from '@playwright/test';
import { Page } from '@playwright/test';

// 2. Internal imports (absolute paths)
import { BasePage } from '@pages/base/BasePage';
import { getCurrentEnvironment } from '@config/environments';

// 3. Relative imports
import { LoginPage } from '../pages/modules/auth/LoginPage';
```

#### Function Organization

```typescript
export class LoginPage extends BasePage {
  // 1. Properties
  private readonly selectors = {
    emailInput: '#email',
    passwordInput: '#password',
  };

  // 2. Constructor
  constructor(page: Page) {
    super(page, '/login');
  }

  // 3. Public methods
  async login(email: string, password: string): Promise<void> {
    // ...
  }

  // 4. Private methods
  private async validateForm(): Promise<boolean> {
    // ...
  }
}
```

### Documentation

#### JSDoc Comments

```typescript
/**
 * Login to the application
 *
 * @param email - User's email address
 * @param password - User's password
 * @returns Promise that resolves when login is complete
 * @throws Error if login fails
 *
 * @example
 * ```typescript
 * const loginPage = new LoginPage(page);
 * await loginPage.login('user@example.com', 'password123');
 * ```
 */
async login(email: string, password: string): Promise<void> {
  // Implementation
}
```

#### Inline Comments

```typescript
// ✅ Good - Explain WHY, not WHAT
// Retry login because of intermittent auth service issues
await retryAction(() => this.performLogin(email, password));

// ❌ Bad - States the obvious
// Click the login button
await this.click('.login-button');
```

## Writing Tests

### Test Structure

```typescript
import { test, expect } from '../fixtures/baseFixtures';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup before each test
  });

  test('should do something specific', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    // Act
    await loginPage.login('user@example.com', 'password');

    // Assert
    await expect(page).toHaveURL(/dashboard/);
  });

  test.afterEach(async ({ page }) => {
    // Cleanup after each test
  });
});
```

### Test Naming

```typescript
// ✅ Good - Descriptive and specific
test('should display error message when login fails with invalid credentials', async () => {});
test('should redirect to dashboard after successful login', async () => {});
test('should disable submit button when required fields are empty', async () => {});

// ❌ Bad - Vague or unclear
test('test login', async () => {});
test('error message', async () => {});
test('it works', async () => {});
```

### Test Independence

```typescript
// ✅ Good - Each test is independent
test('test 1', async ({ page }) => {
  const user = generateTestUser();
  await registerUser(user);
  // ...
});

test('test 2', async ({ page }) => {
  const user = generateTestUser();
  await registerUser(user);
  // ...
});

// ❌ Bad - Tests depend on each other
let sharedUser;
test('test 1', async () => {
  sharedUser = generateTestUser();
  // ...
});

test('test 2', async () => {
  // Uses sharedUser from previous test - BAD!
  // ...
});
```

### Assertions

```typescript
// ✅ Good - Use specific assertions
await expect(page.locator('.error')).toHaveText('Invalid credentials');
await expect(page).toHaveURL(/dashboard/);
await expect(page.locator('.status')).toBeVisible();

// ❌ Bad - Generic assertions
expect(await page.textContent('.error')).toBeTruthy();
expect(page.url().includes('dashboard')).toBe(true);
```

## Creating Page Objects

### Page Object Template

```typescript
import { Page } from '@playwright/test';
import { BasePage } from '@pages/base/BasePage';

/**
 * PageName Page Object
 *
 * Represents the [Page Description] page.
 * URL: /page-path
 *
 * @example
 * ```typescript
 * const pageName = new PageNamePage(page);
 * await pageName.navigate();
 * await pageName.performAction();
 * ```
 */
export class PageNamePage extends BasePage {
  /**
   * Page Selectors
   * Use data-testid attributes when possible
   */
  private readonly selectors = {
    primaryButton: '[data-testid="primary-button"]',
    inputField: '[data-testid="input-field"]',
  };

  /**
   * Constructor
   */
  constructor(page: Page) {
    super(page, '/page-path');
  }

  /**
   * Perform primary action
   *
   * @param param - Parameter description
   * @returns Promise that resolves when action is complete
   */
  async performAction(param: string): Promise<void> {
    await this.fillInput(this.selectors.inputField, param);
    await this.clickElement(this.selectors.primaryButton);
  }

  /**
   * Verify page loaded correctly
   */
  async verifyPageLoaded(): Promise<void> {
    await super.verifyPageLoaded();
    await this.waitForSelector(this.selectors.primaryButton);
  }
}
```

### Selector Guidelines

```typescript
// Priority order (best to worst):
// 1. data-testid attributes
'[data-testid="login-button"]'

// 2. Semantic selectors (role, accessible name)
'button[name="login"]'
page.getByRole('button', { name: 'Login' })

// 3. ID selectors
'#login-button'

// 4. Class selectors (avoid if possible)
'.login-button'

// ❌ Avoid - Brittle selectors
'div > div > button:nth-child(3)'
'button.MuiButton-root.MuiButton-contained'
```

## Pull Request Process

### Before Submitting

- [ ] All tests pass locally
- [ ] Code is formatted (`npm run format`)
- [ ] Linter passes (`npm run lint`)
- [ ] TypeScript compiles (`npm run type-check`)
- [ ] Documentation is updated
- [ ] Commit messages follow guidelines

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Added new tests
- [ ] All tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console warnings/errors
```

### Review Process

1. Automated checks must pass
2. At least one approval required
3. All comments addressed
4. Squash and merge to main

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
# Feature
git commit -m "feat(auth): add password reset functionality"

# Bug fix
git commit -m "fix(login): resolve timeout issue on slow networks"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Refactor
git commit -m "refactor(pages): extract common selectors to constants"

# Test
git commit -m "test(auth): add tests for password validation"
```

### Detailed Commit Message

```
feat(payment): add credit card payment processing

- Integrate with Stripe payment gateway
- Add credit card validation
- Implement payment error handling
- Add payment confirmation page

Closes #123
```

## Questions?

If you have questions:
- Check existing documentation
- Review similar implementations in the codebase
- Ask in the team chat
- Create a discussion in GitHub

## Thank You!

Your contributions make this project better for everyone. We appreciate your time and effort!
