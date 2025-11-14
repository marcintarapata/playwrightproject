# TodoApp - Playwright Testing Example

A fully functional Next.js app demonstrating the enterprise Playwright testing framework with authentication, CRUD operations, and real-world workflows.

## Quick Start

```bash
# Install dependencies
npm install

# Setup database with test users
npm run db:reset-and-seed

# Start development server
npm run dev
```

Open http://localhost:3000

## Test Users

| Email | Password | Todos |
|-------|----------|-------|
| test@example.com | Test123!@# | 10 todos |
| admin@example.com | Admin123!@# | 3 todos |
| john@example.com | John123!@# | 2 todos |

## Features

- 🏠 Landing page with marketing content
- 🔐 Authentication (login/register)
- 📊 Dashboard with todo statistics
- ✅ Full CRUD todo management
- 🎯 Priority levels & filtering
- 🔒 Protected routes

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Better Auth
- SQLite + Drizzle ORM

## Scripts

```bash
npm run dev               # Start dev server
npm run build             # Build for production  
npm run db:reset-and-seed # Reset & seed database
npm run test:prepare      # Prepare for testing
```

## All Pages Include data-testid for Testing

See parent directory for Playwright tests.
