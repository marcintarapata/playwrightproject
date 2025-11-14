# Example Application Implementation Plan

## Overview
Create a Next.js application with authentication and CRUD functionality to demonstrate the Playwright testing framework capabilities.

## Technology Stack Decision

### Framework & Libraries
- **Next.js 14** (App Router) - Modern React framework
- **Better Auth** - Simpler than Auth.js, good for demos
- **Drizzle ORM** - Lighter than Prisma, great TypeScript support
- **SQLite** - Zero-config database, perfect for demo/testing
- **Tailwind CSS** - Fast styling for UI

### Rationale
- **Better Auth over Auth.js**: Simpler setup, built-in UI components, better for learning
- **Drizzle over Prisma**: Lighter weight, SQL-like syntax, faster for demos
- **SQLite**: No external dependencies, easy to reset/seed for testing

## Application Structure

```
example-app/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (authenticated)/
│   │   │   ├── dashboard/
│   │   │   └── todos/
│   │   ├── layout.tsx
│   │   └── page.tsx              # Landing page
│   ├── components/
│   │   ├── ui/                   # Reusable UI components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── TodoList.tsx
│   ├── lib/
│   │   ├── db/
│   │   │   ├── schema.ts         # Drizzle schema
│   │   │   ├── index.ts          # DB connection
│   │   │   └── seed.ts           # Seed script
│   │   └── auth.ts               # Better Auth config
│   └── middleware.ts             # Auth middleware
├── scripts/
│   ├── reset-db.ts               # Reset database
│   └── seed-db.ts                # Seed test data
├── drizzle/
│   └── migrations/               # DB migrations
├── data/
│   └── dev.db                    # SQLite database
└── [config files]
```

## Features Implementation

### 1. Unauthenticated Landing Page (`/`)
**Features:**
- Hero section with marketing copy
- Features showcase (3-4 feature cards)
- CTA button → "Get Started" → redirects to `/register`
- "Sign In" button in header → redirects to `/login`
- Footer with links

**Test Coverage:**
- ✅ Page loads successfully
- ✅ Hero section is visible
- ✅ Feature cards are displayed
- ✅ CTA buttons work
- ✅ Navigation to login/register pages

### 2. Authentication System

#### Login Page (`/login`)
**Features:**
- Email + Password form
- "Remember me" checkbox
- "Forgot password" link (placeholder)
- "Don't have an account?" → register link
- Error handling for invalid credentials
- Success redirect to `/dashboard`

**Test Coverage:**
- ✅ Login with valid credentials
- ✅ Login with invalid credentials shows error
- ✅ Form validation (empty fields)
- ✅ Remember me functionality
- ✅ Redirect to register page
- ✅ Successful login redirects to dashboard

#### Register Page (`/register`)
**Features:**
- Name, Email, Password, Confirm Password
- Client-side validation
- Server-side validation
- Success redirect to `/dashboard`
- "Already have an account?" → login link

**Test Coverage:**
- ✅ Register new user successfully
- ✅ Email already exists error
- ✅ Password mismatch error
- ✅ Form validation
- ✅ Redirect to login page

### 3. Authenticated Dashboard (`/dashboard`)
**Features:**
- Welcome message with user's name
- Quick stats cards (Total Todos, Completed, Pending)
- Recent todos list (last 5)
- Navigation to `/todos` page
- User menu with logout

**Test Coverage:**
- ✅ Protected route - redirects if not authenticated
- ✅ Displays user name
- ✅ Shows correct todo statistics
- ✅ Navigation to todos page works
- ✅ Logout functionality

### 4. Todo List Page (`/todos`)
**Features:**
- List of all todos (with pagination if > 20)
- Add new todo (title, description, priority)
- Mark todo as complete/incomplete (toggle)
- Edit todo (inline or modal)
- Delete todo (with confirmation)
- Filter: All / Active / Completed
- Sort: Date / Priority / Title

**Database Schema:**
```typescript
todos:
  - id (integer, primary key)
  - userId (integer, foreign key)
  - title (string, required)
  - description (string, optional)
  - priority (enum: low, medium, high)
  - completed (boolean)
  - createdAt (timestamp)
  - updatedAt (timestamp)

users:
  - id (integer, primary key)
  - name (string)
  - email (string, unique)
  - passwordHash (string)
  - createdAt (timestamp)
```

**Test Coverage:**
- ✅ View all todos
- ✅ Add new todo
- ✅ Edit existing todo
- ✅ Delete todo
- ✅ Mark as complete/incomplete
- ✅ Filter todos (all/active/completed)
- ✅ Sort todos
- ✅ Pagination works (if implemented)
- ✅ Empty state when no todos

### 5. Database Scripts

#### Reset Script (`scripts/reset-db.ts`)
**Purpose:** Clean database and recreate schema
**Functionality:**
```typescript
- Drop all tables
- Run Drizzle migrations
- Clear all data
- Reset auto-increment counters
```

**Usage:**
```bash
npm run db:reset
```

#### Seed Script (`scripts/seed-db.ts`)
**Purpose:** Populate database with test data
**Test Data:**
```typescript
Users:
  - Test User (test@example.com / password123)
  - Admin User (admin@example.com / admin123)
  - John Doe (john@example.com / password123)

Todos (for Test User):
  - 5 completed todos
  - 5 active todos
  - Mix of priorities (low, medium, high)
  - Various dates (past week)

Todos (for Admin User):
  - 3 active todos
```

**Usage:**
```bash
npm run db:seed
npm run db:reset-and-seed  # Combined command
```

## Implementation Phases

### Phase 1: Next.js App Setup (30 min)
- [ ] Create Next.js app with TypeScript
- [ ] Install dependencies (Better Auth, Drizzle, Tailwind)
- [ ] Configure Tailwind CSS
- [ ] Set up basic project structure
- [ ] Create layout and basic components

### Phase 2: Database Setup (30 min)
- [ ] Install Drizzle ORM + SQLite
- [ ] Define database schema (users, todos)
- [ ] Configure Drizzle migrations
- [ ] Create database connection
- [ ] Test migrations work

### Phase 3: Authentication (1 hour)
- [ ] Set up Better Auth
- [ ] Create login page
- [ ] Create register page
- [ ] Implement authentication middleware
- [ ] Add protected route handling
- [ ] Test authentication flow manually

### Phase 4: Landing Page (30 min)
- [ ] Create landing page UI
- [ ] Add hero section
- [ ] Add feature cards
- [ ] Add header/footer components
- [ ] Add responsive design

### Phase 5: Dashboard (45 min)
- [ ] Create dashboard layout
- [ ] Add welcome section
- [ ] Add statistics cards
- [ ] Query todos from database
- [ ] Add navigation to todos

### Phase 6: Todo List Feature (1.5 hours)
- [ ] Create todos page
- [ ] Implement CRUD API routes
- [ ] Add todo list component
- [ ] Add new todo form
- [ ] Add edit functionality
- [ ] Add delete functionality
- [ ] Add toggle complete
- [ ] Add filters
- [ ] Add sorting

### Phase 7: Database Scripts (45 min)
- [ ] Create reset-db.ts script
- [ ] Create seed-db.ts script
- [ ] Add npm scripts to package.json
- [ ] Test scripts work correctly
- [ ] Add documentation

### Phase 8: Integration with Test Framework (1 hour)
- [ ] Update test environment configuration
- [ ] Create page objects for new pages
- [ ] Update user configuration with seeded users
- [ ] Create test data utilities
- [ ] Add database reset to test setup

### Phase 9: Example Tests (2 hours)
- [ ] Landing page tests (5 tests)
- [ ] Authentication tests (8 tests)
- [ ] Dashboard tests (5 tests)
- [ ] Todo CRUD tests (10 tests)
- [ ] Integration/workflow tests (3 tests)
- [ ] Update smoke tests

### Phase 10: Documentation (30 min)
- [ ] Update README with app setup
- [ ] Add app usage guide
- [ ] Document database scripts
- [ ] Add development workflow guide
- [ ] Create troubleshooting section

## API Routes Required

```typescript
POST   /api/auth/login           # Login user
POST   /api/auth/register        # Register user
POST   /api/auth/logout          # Logout user
GET    /api/auth/session         # Get current session

GET    /api/todos                # Get all todos
POST   /api/todos                # Create todo
GET    /api/todos/:id            # Get single todo
PUT    /api/todos/:id            # Update todo
DELETE /api/todos/:id            # Delete todo
PATCH  /api/todos/:id/toggle     # Toggle complete status
```

## Test Data Structure

### Seeded Users
```typescript
{
  email: 'test@example.com',
  password: 'Test123!@#',
  name: 'Test User',
  todos: 10 (5 completed, 5 active)
}

{
  email: 'admin@example.com',
  password: 'Admin123!@#',
  name: 'Admin User',
  todos: 3 (all active)
}
```

### Seeded Todos
```typescript
- Mix of priorities (low: 4, medium: 6, high: 3)
- Mix of statuses (completed: 5, active: 8)
- Various titles and descriptions
- Created over past 7 days
```

## Integration with Playwright Framework

### Update Configuration Files

**src/config/environments.ts:**
```typescript
baseURL: 'http://localhost:3000'  // Next.js dev server
apiURL: 'http://localhost:3000/api'
```

**src/config/users.ts:**
```typescript
standardUser: {
  email: 'test@example.com',
  password: 'Test123!@#',
  fullName: 'Test User'
}

adminUser: {
  email: 'admin@example.com',
  password: 'Admin123!@#',
  fullName: 'Admin User'
}
```

### New Page Objects Needed

```
src/pages/modules/
├── landing/
│   └── LandingPage.ts
├── auth/
│   ├── LoginPage.ts (already exists - update)
│   └── RegisterPage.ts
├── dashboard/
│   └── DashboardPage.ts
└── todos/
    └── TodosPage.ts
```

### Test Fixtures Updates

**Add database fixture:**
```typescript
// src/fixtures/dbFixtures.ts
export const test = base.extend({
  freshDatabase: async ({}, use) => {
    // Reset and seed database before test
    await resetDatabase();
    await seedDatabase();
    await use();
  }
});
```

## NPM Scripts (Example App)

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "db:generate": "drizzle-kit generate:sqlite",
    "db:migrate": "tsx scripts/migrate.ts",
    "db:reset": "tsx scripts/reset-db.ts",
    "db:seed": "tsx scripts/seed-db.ts",
    "db:reset-and-seed": "npm run db:reset && npm run db:seed",
    "test:prepare": "npm run db:reset-and-seed"
  }
}
```

## Expected Test Coverage

### Total Tests: ~35-40 tests

**Landing Page Tests:** 5 tests
- Page load and rendering
- CTA buttons functionality
- Navigation to auth pages
- Responsive design
- Visual regression

**Authentication Tests:** 8 tests
- Valid login
- Invalid credentials
- Registration flow
- Form validation
- Session persistence
- Logout
- Protected routes
- Password requirements

**Dashboard Tests:** 5 tests
- Protected route access
- User information display
- Todo statistics accuracy
- Navigation
- Logout from dashboard

**Todo CRUD Tests:** 15 tests
- View all todos
- Create todo (various scenarios)
- Edit todo
- Delete todo
- Toggle completion
- Filtering (3 scenarios)
- Sorting (2 scenarios)
- Pagination
- Empty state
- Error handling

**Integration Tests:** 5 tests
- Complete user registration → login → create todo workflow
- Login → complete all todos → verify dashboard stats
- Create multiple todos → filter → sort → delete
- Cross-user data isolation
- Session expiration

**Smoke Tests:** Update existing
- App loads
- Login flow
- Create todo
- API health

## Success Criteria

✅ Example app runs locally with `npm run dev`
✅ Database scripts work reliably
✅ All authentication flows work
✅ Todo CRUD operations work
✅ All example tests pass
✅ Framework documentation updated
✅ Clear setup instructions provided
✅ Test data is consistent and repeatable

## Estimated Time

- **Development:** 6-7 hours
- **Testing:** 2-3 hours
- **Documentation:** 1 hour
- **Total:** ~10 hours

## Benefits

1. **Immediate Usability** - Users can run tests immediately
2. **Learning Resource** - Demonstrates all testing patterns
3. **Validation** - Proves framework works end-to-end
4. **Realistic Example** - Real-world application structure
5. **Database Testing** - Shows data setup/teardown patterns
6. **CI/CD Ready** - Example of full testing pipeline

## Next Steps

After approval:
1. Create `example-app/` directory
2. Scaffold Next.js application
3. Implement features phase by phase
4. Create corresponding tests
5. Update main framework documentation
6. Test everything end-to-end

---

**Ready to proceed?** I can start with Phase 1 and work through systematically, or we can adjust the plan based on your feedback.
