/**
 * Page Objects Index
 *
 * Central export file for all page objects.
 * Provides convenient imports for test files.
 *
 * @example
 * ```typescript
 * import { LoginPage, DashboardPage, TodosPage } from '../src/pages';
 * ```
 */

// Base
export { BasePage } from './base/BasePage';

// Authentication
export { LoginPage } from './modules/auth/LoginPage';
export { RegisterPage } from './modules/auth/RegisterPage';

// Main Pages
export { LandingPage } from './modules/landing/LandingPage';
export { DashboardPage } from './modules/dashboard/DashboardPage';
export { TodosPage } from './modules/todos/TodosPage';

// Components
export { BaseComponent } from './components/BaseComponent';
export { Header } from './components/Header.component';

// Types
export type { TodoPriority, TodoFilter } from './modules/todos/TodosPage';
