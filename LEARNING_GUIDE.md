# Playwright Automation Framework - Complete Learning Guide

A comprehensive guide to understand and master the Playwright Automation Framework from scratch.

---

## Table of Contents

1. [Part 1: Fundamentals](#part-1-fundamentals)
2. [Part 2: Framework Architecture](#part-2-framework-architecture)
3. [Part 3: Page Object Model](#part-3-page-object-model)
4. [Part 4: Writing Tests](#part-4-writing-tests)
5. [Part 5: API Testing](#part-5-api-testing)
6. [Part 6: Utilities & Helpers](#part-6-utilities--helpers)
7. [Part 7: Configuration & Setup](#part-7-configuration--setup)
8. [Part 8: Running & Debugging Tests](#part-8-running--debugging-tests)
9. [Part 9: CI/CD & Deployment](#part-9-cicd--deployment)
10. [Part 10: Best Practices & Patterns](#part-10-best-practices--patterns)

---

# Part 1: Fundamentals

## 1.1 What is Playwright?

**Playwright** is a testing framework that allows you to automate browser interactions. Think of it as a robot that can:

- Open a browser
- Navigate to websites
- Click buttons
- Fill forms
- Check if elements exist
- Run actions and verify results

### Why Playwright?

- Supports multiple browsers: Chromium (Chrome/Edge), Firefox, WebKit (Safari)
- Fast and reliable
- Good for UI testing, API testing, and integration testing
- Built on modern web standards

## 1.2 What is TypeScript?

**TypeScript** is a superset of JavaScript that adds **types**. Think of it as:

- JavaScript with safety guardrails
- Catches errors before you run code
- Better IDE support (autocomplete, refactoring)
- Self-documenting code

### Example:

```typescript
// JavaScript (no type checking)
function add(a, b) {
  return a + b;
}
add('5', 3); // Returns "53" (string concatenation, not math!)

// TypeScript (with types - catches errors)
function add(a: number, b: number): number {
  return a + b;
}
add('5', 3); // ❌ ERROR: Argument of type 'string' is not assignable to parameter of type 'number'
```

## 1.3 Page Object Model (POM)

**POM** is a design pattern that separates **test logic** from **page structure**.

### Without POM (Hard to maintain):

```typescript
test('Login test', async ({ page }) => {
  await page.locator('input[name="username"]').fill('user@example.com');
  await page.locator('input[name="password"]').fill('password123');
  await page.locator('button:has-text("Login")').click();
  await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
});
```

**Problems:**

- If selectors change, you must update every test
- Hard to read business logic
- Code duplication across tests

### With POM (Clean & maintainable):

```typescript
// LoginPage.ts - Contains selectors and actions
export class LoginPage {
  async fillUsername(username: string) {
    await this.page.locator('input[name="username"]').fill(username);
  }
  async fillPassword(password: string) {
    await this.page.locator('input[name="password"]').fill(password);
  }
  async clickLogin() {
    await this.page.locator('button:has-text("Login")').click();
  }
}

// login.test.ts - Uses POM
test('Login test', async ({ page }) => {
  const login = new LoginPage(page);
  await login.fillUsername('user@example.com');
  await login.fillPassword('password123');
  await login.clickLogin();
  await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
});
```

**Benefits:**

- Selectors in one place
- Tests read like business requirements
- Easy to maintain and update

---

# Part 2: Framework Architecture

## 2.1 Folder Structure Overview

```
UI_Automation_Framework/
├── .github/
│   └── workflows/              ← CI/CD pipeline (GitHub Actions)
├── .husky/                     ← Git hooks (pre-commit checks)
├── src/
│   ├── pages/                  ← Page Object classes (UI abstraction)
│   ├── interface/              ← TypeScript contracts (interfaces)
│   ├── utils/                  ← Shared utilities (helpers, validators)
│   └── fixture/                ← Test data and custom fixtures
├── tests/                      ← Test files (.spec.ts)
├── test-data/                  ← External data files (JSON)
├── schemas/                    ← JSON schemas for API validation
├── globals/                    ← Global setup/teardown
├── playwright.config.ts        ← Playwright configuration
├── tsconfig.json               ← TypeScript configuration
├── package.json                ← Dependencies & scripts
└── README.md                   ← Documentation
```

## 2.2 Component Relationship

```
┌─────────────────────────────────────────────┐
│             Test File (*.spec.ts)           │
│        (Business logic, assertions)         │
└──────────────┬──────────────────────────────┘
               │ Uses
               ▼
┌─────────────────────────────────────────────┐
│         Page Objects (LoginPage.ts)         │
│    (User interactions, locator selectors)   │
└──────────────┬──────────────────────────────┘
               │ Extends
               ▼
┌─────────────────────────────────────────────┐
│         BasePage (Base class)               │
│    (Common navigation, helper methods)      │
└──────────────┬──────────────────────────────┘
               │ Uses
               ▼
┌─────────────────────────────────────────────┐
│         Utilities & Helpers                 │
│ (Logging, validation, selectors, API calls) │
└─────────────────────────────────────────────┘
```

## 2.3 Key Technologies

| Technology         | Purpose                      | File                         |
| ------------------ | ---------------------------- | ---------------------------- |
| **Playwright**     | Browser automation framework | `package.json`               |
| **TypeScript**     | Type-safe JavaScript         | `tsconfig.json`              |
| **ESLint**         | Code quality checker         | `.eslintrc.json`             |
| **Prettier**       | Code formatter               | `.prettierrc.json`           |
| **AJV**            | JSON schema validator        | Used in `schemaValidator.ts` |
| **Husky**          | Git hooks                    | `.husky/`                    |
| **Docker**         | Containerization             | `Dockerfile`                 |
| **GitHub Actions** | CI/CD pipeline               | `.github/workflows/`         |

---

# Part 3: Page Object Model

## 3.1 BasePage - The Foundation

All page objects inherit from `BasePage`, which provides common functionality:

```typescript
// src/pages/BasePage.ts
import { Page } from '@playwright/test';

export abstract class BasePage {
  constructor(protected page: Page) {}

  // Navigation
  async goto(path: string) {
    await this.page.goto(path);
  }

  // Locators (preferred order)
  protected getByTestId(testId: string) {
    return this.page.getByTestId(testId);
  }

  protected getByRole(role: string, options?: any) {
    return this.page.getByRole(role, options);
  }

  // Waiting
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }
}
```

### Why BasePage?

- **DRY (Don't Repeat Yourself):** Common methods in one place
- **Consistency:** All pages follow same pattern
- **Easy to update:** Change once, affects all pages

## 3.2 Page Object Example - LoginPage

```typescript
// src/pages/LoginPage.ts
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { SELECTORS_BY_TESTID } from '../utils/selectors';

// Interface: Contract for LoginPage
export interface ILoginPage {
  navigate(): Promise<void>;
  fillUsername(username: string): Promise<void>;
  fillPassword(password: string): Promise<void>;
  clickLoginButton(): Promise<void>;
  getErrorMessage(): Locator;
}

// Implementation
export class LoginPage extends BasePage implements ILoginPage {
  // Page-specific paths
  private readonly LOGIN_PATH = '/login';

  // Navigate to login page
  async navigate(): Promise<void> {
    await this.goto(this.LOGIN_PATH);
    await this.waitForPageLoad();
  }

  // Fill username - Prefer testId (explicit, maintainable)
  async fillUsername(username: string): Promise<void> {
    await this.getByTestId(SELECTORS_BY_TESTID.login.usernameInput).fill(username);
  }

  // Fill password
  async fillPassword(password: string): Promise<void> {
    await this.getByTestId(SELECTORS_BY_TESTID.login.passwordInput).fill(password);
  }

  // Click login - Use role (accessible, user-centric)
  async clickLoginButton(): Promise<void> {
    await this.getByRole('button', { name: /login|sign in/i }).click();
  }

  // Get error message for assertions
  getErrorMessage() {
    return this.page.locator('[data-testid="error-message"]');
  }

  // Business flow: Complete login
  async login(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLoginButton();
  }
}
```

## 3.3 Selectors - The "Brain"

Selectors are **locators** - how we find elements on the page.

### Selector Priority (Best to Worst):

```typescript
// src/utils/selectors.ts
export const SELECTORS_BY_TESTID = {
  login: {
    usernameInput: 'username-field',      // ✅ BEST: explicit data-testid
    passwordInput: 'password-field',
    loginButton: 'login-button',
    errorMessage: 'error-message'
  },
  dashboard: {
    welcomeHeader: 'welcome-header',
    logoutButton: 'logout-button'
  }
};

// In LoginPage:
async fillUsername(username: string) {
  // 1. Test ID (Explicit, maintainable)
  await this.getByTestId(SELECTORS_BY_TESTID.login.usernameInput).fill(username);
}

async clickLoginButton() {
  // 2. Role-based (Accessible, user-centric)
  await this.getByRole('button', { name: /login|sign in/i }).click();
}

// 3. Text-based (When testId/role not available)
await this.page.getByText('Username').fill(username);

// 4. CSS (Last resort - fragile)
await this.page.locator('.form-input.username').fill(username); // ❌ AVOID
```

### Why This Order?

- **test-testid:** Developers explicitly mark testable elements
- **role-based:** Users interact with roles (buttons, inputs), not CSS
- **text-based:** Good for labels and user-visible text
- **CSS/XPath:** Break when HTML changes, not accessible

## 3.4 Interfaces - Type Safety

```typescript
// src/interface/pages.interface.ts
export interface ILoginPage {
  navigate(): Promise<void>;
  fillUsername(username: string): Promise<void>;
  fillPassword(password: string): Promise<void>;
  clickLoginButton(): Promise<void>;
}

// LoginPage MUST implement all methods
export class LoginPage extends BasePage implements ILoginPage {
  // If you forget a method → TypeScript ERROR ❌
  // This ensures consistency across all pages
}
```

**Benefits:**

- Compiler checks all methods exist
- IDE autocomplete for page methods
- Easy to see what methods a page has
- Refactoring safety

---

# Part 4: Writing Tests

## 4.1 Test Anatomy (Arrange-Act-Assert)

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { DashboardPage } from '../src/pages/DashboardPage';

test.describe('User Authentication', () => {
  test('should login with valid credentials', async ({ page }) => {
    // ARRANGE: Setup test data and page objects
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const testUser = {
      username: 'user@example.com',
      password: 'SecurePassword123',
    };

    // ACT: Perform user actions
    await loginPage.navigate();
    await loginPage.login(testUser.username, testUser.password);

    // ASSERT: Verify expected behavior
    await expect(dashboardPage.getWelcomeMessage()).toContainText('Welcome');
    await expect(page).toHaveURL(/dashboard/);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // ARRANGE
    const loginPage = new LoginPage(page);

    // ACT
    await loginPage.navigate();
    await loginPage.login('wrong@example.com', 'wrongpassword');

    // ASSERT
    await expect(loginPage.getErrorMessage()).toBeVisible();
    await expect(loginPage.getErrorMessage()).toContainText('Invalid credentials');
  });
});
```

### Key Concepts:

1. **test.describe()** - Group related tests
2. **test()** - Individual test case
3. **async ({ page })** - Playwright provides the browser page
4. **await** - Wait for async operations
5. **expect()** - Assertion (verify behavior)

## 4.2 Common Assertions

```typescript
// Visibility
await expect(loginForm).toBeVisible();
await expect(loginForm).toBeHidden();

// Text content
await expect(header).toContainText('Welcome');
await expect(header).toHaveText('Welcome, John');

// URL
await expect(page).toHaveURL('/dashboard');
await expect(page).toHaveURL(/dashboard/); // Regex pattern

// Attributes
await expect(input).toHaveAttribute('placeholder', 'Enter username');
await expect(button).toBeEnabled();
await expect(button).toBeDisabled();

// Count
await expect(rows).toHaveCount(5);

// Value
await expect(input).toHaveValue('john@example.com');
```

## 4.3 Test Hooks

```typescript
test.describe('User Profile', () => {
  let profilePage: ProfilePage;

  test.beforeAll(async () => {
    // Runs ONCE before all tests in this group
    console.log('Setting up test suite');
  });

  test.beforeEach(async ({ page }) => {
    // Runs BEFORE EACH test
    profilePage = new ProfilePage(page);
    await profilePage.navigate();
  });

  test('should display user name', async () => {
    // Test runs here (profilePage already navigated)
    await expect(profilePage.getUserName()).toContainText('John Doe');
  });

  test('should update profile', async () => {
    // Test runs here (profilePage already navigated)
    await profilePage.updateName('Jane Doe');
  });

  test.afterEach(async () => {
    // Runs AFTER EACH test (cleanup)
    console.log('Test completed, cleaning up');
  });

  test.afterAll(async () => {
    // Runs ONCE after all tests
    console.log('Test suite completed');
  });
});
```

**Execution Order:**

```
beforeAll()
└─ beforeEach()
   └─ test 1
   └─ afterEach()

└─ beforeEach()
   └─ test 2
   └─ afterEach()
afterAll()
```

---

# Part 5: API Testing

## 5.1 Why API Testing?

- Faster than UI tests (no browser rendering)
- More reliable (less flaky)
- Tests backend logic independent of UI
- Can seed test data before running UI tests

## 5.2 API Testing Flow

```typescript
// tests/06-api-testing/user-api.spec.ts
import { test, expect } from '@playwright/test';
import { apiHelper } from '../src/utils/apiHelper';

test.describe('User API', () => {
  test('should get user by ID', async ({ request }) => {
    // ACT: Call API
    const user = await apiHelper.getUser(1);

    // ASSERT: Verify response
    expect(user.id).toBe(1);
    expect(user.name).toBeTruthy();
    expect(user.email).toMatch(/@/); // Basic email validation
  });

  test('should create user with valid data', async ({ request }) => {
    // ARRANGE: Prepare payload
    const newUser = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '555-1234',
    };

    // ACT: Call API
    const response = await apiHelper.createUser(newUser);

    // ASSERT: Verify response
    expect(response.id).toBeTruthy();
    expect(response.name).toBe(newUser.name);
  });
});
```

## 5.3 Schema Validation - The Power

**What is Schema Validation?**
Define what valid API responses look like, then validate against that definition.

### Without Schema Validation (Weak):

```typescript
test('Get user', async () => {
  const user = await apiHelper.getUser(1);

  // Manual checks (incomplete, hard to maintain)
  expect(user.id).toBeTruthy();
  expect(user.name).toBeTruthy();
  expect(typeof user.email === 'string').toBe(true);
  // Forgot to check: phone, address, role, etc.
});
```

### With Schema Validation (Comprehensive):

```typescript
// schemas/user.schema.json - Define valid user shape
{
  "type": "object",
  "required": ["id", "name", "email"],
  "properties": {
    "id": {
      "type": "integer",
      "minimum": 1
    },
    "name": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100
    },
    "email": {
      "type": "string",
      "format": "email"
    },
    "phone": {
      "type": "string"
    }
  }
}

// Test uses schema validation
test('Get user', async () => {
  const user = await apiHelper.getUser(1);

  // One call validates ENTIRE response against schema
  schemaValidator.validateOrThrow(user, 'user.schema.json');

  // All fields, types, formats validated automatically ✅
});
```

## 5.4 API Helper - Type-Safe Requests

```typescript
// src/utils/apiHelper.ts
import { APIRequestContext } from '@playwright/test';
import { User, CreateUserRequest } from '../interface/api.interface';
import { schemaValidator } from './schemaValidator';

export class ApiHelper {
  constructor(private request: APIRequestContext) {}

  // Type-safe GET: returns User, validates schema
  async getUser(userId: number): Promise<User> {
    const response = await this.request.get(`/users/${userId}`);
    const data = await response.json();

    // Automatic validation
    schemaValidator.validateOrThrow(data, 'user.schema.json');
    return data as User;
  }

  // Type-safe POST: accepts CreateUserRequest, returns User
  async createUser(payload: CreateUserRequest): Promise<User> {
    const response = await this.request.post('/users', {
      data: payload,
    });
    const data = await response.json();

    schemaValidator.validateOrThrow(data, 'user.schema.json');
    return data as User;
  }
}

// Usage
const user = await apiHelper.getUser(1);
// TypeScript KNOWS user has: id, name, email, phone
// IDE autocomplete works perfectly ✅
console.log(user.name); // ✅ TypeScript knows this exists
console.log(user.unknown); // ❌ TypeScript ERROR: unknown property
```

## 5.5 API Interfaces - Contracts

```typescript
// src/interface/api.interface.ts

// Request types
export interface CreateUserRequest {
  name: string;
  email: string;
  phone?: string; // Optional (?)
}

// Response types
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export interface ErrorResponse {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Generic types for pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Usage
async function getUsers(): Promise<PaginatedResponse<User>> {
  const response = await apiHelper.getUsers();
  // TypeScript knows: response.data is User[]
  // Can access: response.total, response.page, etc.
}
```

---

# Part 6: Utilities & Helpers

## 6.1 Logger - Track Test Execution

```typescript
// src/utils/logger.ts
export class Logger {
  info(message: string) {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
  }

  error(message: string, error?: any) {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
  }

  debug(message: string) {
    if (process.env.LOG_LEVEL === 'debug') {
      console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`);
    }
  }
}

// Usage in tests
import { logger } from '../src/utils/logger';

test('Login flow', async ({ page }) => {
  logger.info('Starting login test');
  await loginPage.navigate();
  logger.debug('Navigated to login page');
  await loginPage.login(username, password);
  logger.info('Login successful');
});
```

## 6.2 Selectors - Centralized Locators

```typescript
// src/utils/selectors.ts
export const SELECTORS_BY_TESTID = {
  login: {
    usernameInput: 'username-field',
    passwordInput: 'password-field',
    loginButton: 'login-button',
    errorMessage: 'error-message',
  },
  dashboard: {
    welcomeHeader: 'welcome-header',
    logoutButton: 'logout-button',
    userMenu: 'user-menu',
  },
  profile: {
    nameInput: 'profile-name-input',
    emailInput: 'profile-email-input',
    saveButton: 'profile-save-button',
  },
};

// Why centralized?
// If HTML changes from <input class="username"> to <input data-testid="username-field">
// Update ONCE in selectors.ts - all tests automatically use new selector
```

## 6.3 Schema Validator - API Contract Checking

```typescript
// src/utils/schemaValidator.ts
import Ajv from 'ajv';
import * as fs from 'fs';

export class SchemaValidator {
  private ajv = new Ajv();
  private schemas = new Map();

  // Load schema from file (cached)
  private loadSchema(schemaName: string) {
    if (this.schemas.has(schemaName)) {
      return this.schemas.get(schemaName);
    }

    const path = `./schemas/${schemaName}`;
    const schema = JSON.parse(fs.readFileSync(path, 'utf-8'));
    this.schemas.set(schemaName, schema);
    return schema;
  }

  // Validate data against schema
  validate(data: any, schemaName: string): { valid: boolean; errors: any[] } {
    const schema = this.loadSchema(schemaName);
    const valid = this.ajv.validate(schema, data);
    return {
      valid,
      errors: this.ajv.errors || [],
    };
  }

  // Throw error if validation fails
  validateOrThrow(data: any, schemaName: string) {
    const result = this.validate(data, schemaName);
    if (!result.valid) {
      throw new Error(`Schema validation failed: ${JSON.stringify(result.errors)}`);
    }
  }

  // Get human-readable error messages
  getErrorMessages(schemaName: string, data: any): string[] {
    const result = this.validate(data, schemaName);
    return result.errors.map((err) => `${err.instancePath || 'root'}: ${err.message}`);
  }
}

export const schemaValidator = new SchemaValidator();
```

---

# Part 7: Configuration & Setup

## 7.1 playwright.config.ts - The Control Center

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

export default defineConfig({
  // Timeout settings
  timeout: 30000, // Overall test timeout
  expect: {
    timeout: 5000, // Assertion timeout
  },

  // Retry logic
  retries: process.env.CI ? 2 : 0, // Retry 2x in CI, 0x locally

  // Parallel workers
  workers: process.env.CI ? 1 : 4, // 1 worker in CI (safe), 4 locally (fast)

  // Reporters
  reporter: [
    ['html'], // HTML report in playwright-report/
    ['json', { outputFile: 'test-results/results.json' }], // JSON for CI
  ],

  // Projects (browsers to test)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  // Global setup/teardown
  globalSetup: require.resolve('./globals/global-setup.ts'),
  globalTeardown: require.resolve('./globals/global-teardown.ts'),

  // Web server (auto-start)
  webServer: {
    command: 'npm run dev', // Command to start app
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### What This Does:

- **timeout:** If test runs longer than 30s, fail it
- **retries:** Flaky tests retry automatically
- **workers:** Run multiple tests in parallel for speed
- **reporter:** Generate reports for viewing results
- **projects:** Define which browsers to test
- **globalSetup:** Login once, share across all tests
- **webServer:** Auto-start your app before tests

## 7.2 Global Setup - Shared Authentication

```typescript
// globals/global-setup.ts
import { chromium, FullConfig } from '@playwright/test';
import path from 'path';

async function globalSetup(config: FullConfig) {
  // Launch browser
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Login and save authentication state
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="username"]', process.env.USERNAME!);
  await page.fill('input[name="password"]', process.env.PASSWORD!);
  await page.click('button:has-text("Login")');

  // Wait for navigation (logged in)
  await page.waitForURL('**/dashboard');

  // Save cookies and localStorage to file
  await page.context().storageState({
    path: path.join(__dirname, '../storage-state/auth.json'),
  });

  await browser.close();
}

export default globalSetup;
```

### How It Works:

1. **Global setup runs ONCE before all tests**
2. **Logs in to application**
3. **Saves auth state to file** (cookies, localStorage)
4. **Each test loads this auth state** (no login needed!)
5. **Tests start already authenticated** (fast!)

```typescript
// In each test
test('View dashboard', async ({ page }) => {
  // page already has auth! No login needed
  await page.goto('/dashboard');
  await expect(page.locator('h1')).toContainText('Welcome');
});
```

## 7.3 Environment Variables (.env)

```bash
# .env.example
BASE_URL=https://your-app.com
USERNAME=test_user@example.com
PASSWORD=SecurePassword123
LOG_LEVEL=info
API_BASE_URL=https://api.your-app.com
```

```typescript
// Access in code
import dotenv from 'dotenv';
dotenv.config();

const baseUrl = process.env.BASE_URL; // https://your-app.com
const username = process.env.USERNAME; // test_user@example.com
```

---

# Part 8: Running & Debugging Tests

## 8.1 Running Tests Locally

```bash
# Install dependencies
npm install

# Run all tests (headless)
npm test

# Run tests in headed mode (see browser)
npm run test:headed

# Run specific test file
npx playwright test tests/auth.spec.ts

# Run tests matching pattern
npx playwright test --grep "login"

# Run in debug mode (step through)
npx playwright test --debug

# Run with verbose output
npx playwright test --verbose

# View HTML report
npx playwright show-report
```

## 8.2 Debugging Tests

### Method 1: VS Code Debugger

```typescript
// Place breakpoint on line, then run in debug mode
npx playwright test --debug

// Debugger will pause at breakpoint
// Step through code line-by-line
// Inspect variables
```

### Method 2: Playwright Inspector

```bash
npx playwright test --debug
# Opens Playwright Inspector
# Step through each action
# See what element is being interacted with
```

### Method 3: Logging

```typescript
test('Login', async ({ page }) => {
  logger.info('Starting login');
  await loginPage.navigate();

  logger.debug(`Username field visible: ${await usernameField.isVisible()}`);
  logger.debug(`Password field value: ${await passwordField.inputValue()}`);

  await loginPage.login(user, pass);
  logger.info('Login completed');
});
```

## 8.3 Slow Tests

```typescript
// If test is slow, slow it down for viewing
test('Complete checkout flow', async ({ page }) => {
  // Slow down by 1000ms = actions visible
  page.slowMo = 1000;

  await homePage.navigate();
  await homePage.addToCart(product);
  await checkout.proceed();
  // ...
});
```

---

# Part 9: CI/CD & Deployment

## 9.1 GitHub Actions - Automated Testing

```yaml
# .github/workflows/test.yml
name: Playwright Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        browser: [chromium, firefox, webkit]

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '18'

      - run: npm ci

      - run: npx playwright install --with-deps ${{ matrix.browser }}

      - run: npm test -- --project=${{ matrix.browser }}

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### How It Works:

1. **Push code to GitHub** → Workflow triggers
2. **Checkout code**
3. **Install Node.js**
4. **Install dependencies**
5. **Install Playwright browsers**
6. **Run tests** for each browser
7. **Upload report** for viewing

### Benefits:

- Every commit tested automatically
- Tests run on clean machine (reproducible)
- Multiple browsers, platforms, Node versions
- Reports archived for later review

## 9.2 Pre-commit Hooks - Local Quality Gates

```bash
# When you run: git commit

# Husky automatically:
1. Runs ESLint on changed files
2. Fixes linting issues (--fix)
3. Runs Prettier on changed files
4. Validates TypeScript (npm run typecheck)

# If any check fails → Commit rejected
# Fix and try again

# Result: Only good code enters repository
```

## 9.3 Docker - Consistent Environments

```bash
# Build Docker image
docker build -t playwright-tests .

# Run tests in Docker
docker run --rm -v $(pwd)/test-results:/app/test-results playwright-tests

# Benefits:
# - Same browser versions everywhere
# - Same Node version everywhere
# - Works on Windows, Mac, Linux identically
# - Matches CI environment exactly
```

---

# Part 10: Best Practices & Patterns

## 10.1 Test Organization

```
tests/
├── 01-fundamentals/          # Basic scenarios
│   ├── buttons.spec.ts
│   └── forms.spec.ts
├── 02-interactions/          # User workflows
│   ├── login.spec.ts
│   └── checkout.spec.ts
├── 03-test-organization/     # Test structure examples
├── 04-advanced-features/     # Complex scenarios
├── 05-page-object-model/     # POM examples
├── 06-api-testing/           # API tests
│   └── user-api.spec.ts
└── config.ts                 # Shared test config
```

## 10.2 Test Data Management

```typescript
// test-data/fixtures/users.json
{
  "validUser": {
    "username": "user@example.com",
    "password": "SecurePassword123"
  },
  "invalidUser": {
    "username": "invalid@example.com",
    "password": "wrong"
  },
  "testAdmin": {
    "username": "admin@example.com",
    "password": "AdminPassword123"
  }
}

// Usage in tests
import testUsers from '../../test-data/fixtures/users.json';

test('Login with valid user', async () => {
  await loginPage.login(
    testUsers.validUser.username,
    testUsers.validUser.password
  );
});
```

## 10.3 Avoiding Flaky Tests

**What makes tests flaky?**

- Hardcoded waits: `await page.waitForTimeout(1000)`
- Brittle selectors: CSS that changes easily
- Not waiting for elements: `await element.click()` before visible
- External dependencies: Tests fail due to server, not code

**Best Practices:**

```typescript
// ❌ FLAKY: Hardcoded wait
test('Login', async ({ page }) => {
  await page.waitForTimeout(2000); // What if server is slow?
  // ...
});

// ✅ RELIABLE: Wait for actual state
test('Login', async ({ page }) => {
  await expect(page.getByText('Dashboard')).toBeVisible(); // Wait until ready
});

// ❌ FLAKY: Brittle selector
await page.locator('.btn.btn-blue.login-btn').click();

// ✅ RELIABLE: Role-based selector
await page.getByRole('button', { name: /login/i }).click();

// ❌ FLAKY: Clicking without waiting
await page.locator('button').click(); // Is button visible/enabled?

// ✅ RELIABLE: Wait for readiness
await page.getByRole('button', { name: /login/i }).isEnabled();
await page.getByRole('button', { name: /login/i }).click();
```

## 10.4 Test Isolation

Each test should be **independent**:

```typescript
// ❌ DEPENDENT: Test relies on previous test running
test('Login', async ({ page }) => {
  // ...
});

test('View dashboard', async ({ page }) => {
  // Assumes previous test logged in
  // If login test skipped or fails, this fails too
});

// ✅ INDEPENDENT: Each test is complete
test.beforeEach(async ({ page }) => {
  // Run before each test
  await loginPage.navigate();
  await loginPage.login(testUser.username, testUser.password);
});

test('Login', async ({ page }) => {
  // Has fresh login already
  await expect(dashboardPage.getWelcomeMessage()).toBeVisible();
});

test('View dashboard', async ({ page }) => {
  // Also has fresh login (doesn't depend on previous test)
  await expect(dashboardPage.getNavigation()).toBeVisible();
});
```

## 10.5 Meaningful Test Names

```typescript
// ❌ VAGUE: What is this testing?
test('Test 1', async () => {});
test('Login', async () => {});

// ✅ CLEAR: Describes behavior
test('should login successfully with valid credentials', async () => {});
test('should display error message for invalid credentials', async () => {});
test('should redirect to dashboard after successful login', async () => {});

// ✅ EXCELLENT: Follows business requirement format
test('user can login with email and password', async () => {});
test('login fails with detailed error message when credentials invalid', async () => {});
test('successful login stores authentication token in localStorage', async () => {});
```

## 10.6 Code Examples Coming Together

```typescript
// ✅ GOOD TEST: Uses all best practices
import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { DashboardPage } from '../src/pages/DashboardPage';
import testUsers from '../test-data/fixtures/users.json';
import { logger } from '../src/utils/logger';

test.describe('User Authentication', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    // Fresh page objects for each test
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
  });

  test('user can login with valid credentials', async () => {
    // ARRANGE: Clear test data
    const user = testUsers.validUser;

    // ACT: User actions
    logger.info('Navigating to login page');
    await loginPage.navigate();

    logger.info(`Logging in as ${user.username}`);
    await loginPage.login(user.username, user.password);

    // ASSERT: Verify behavior (wait for actual state, not arbitrary time)
    logger.info('Verifying login success');
    await expect(dashboardPage.getWelcomeMessage()).toBeVisible();
    await expect(dashboardPage.getWelcomeMessage()).toContainText('Welcome');
  });

  test('login fails with error message for invalid credentials', async () => {
    const user = testUsers.invalidUser;

    await loginPage.navigate();
    await loginPage.login(user.username, user.password);

    // Wait for actual error visibility, not arbitrary time
    await expect(loginPage.getErrorMessage()).toBeVisible();
    await expect(loginPage.getErrorMessage()).toContainText('Invalid');
  });
});
```

---

## Summary: Your Learning Path

1. **Start:** Understand POM, BasePage, Interfaces
2. **Write:** Simple tests (login, navigation)
3. **Refactor:** Extract to page objects
4. **Expand:** API testing, schema validation
5. **Integrate:** CI/CD, Docker, automation
6. **Master:** Complex workflows, performance, optimization

---

## Quick Reference

### Common Commands

```bash
npm install          # Install dependencies
npm test            # Run all tests
npm run test:headed # Run with visible browser
npm run lint        # Check code quality
npm run lint:fix    # Fix linting issues
npm run format      # Format code
npm run typecheck   # TypeScript validation
npx playwright show-report # View test report
```

### File Locations

- **Tests:** `tests/`
- **Pages:** `src/pages/` (extend BasePage, implement IPage)
- **Utilities:** `src/utils/` (helpers, validators)
- **Interfaces:** `src/interface/` (type contracts)
- **Selectors:** `src/utils/selectors.ts` (centralized)
- **Schemas:** `schemas/` (API contracts)
- **Config:** `playwright.config.ts` (test settings)
- **Setup:** `globals/global-setup.ts` (authentication)

### Best Practices Checklist

- ✅ Use test-id selectors (explicit)
- ✅ Use role-based selectors (accessible)
- ✅ Extend BasePage (DRY)
- ✅ Implement interfaces (type safety)
- ✅ Use schema validation (API contracts)
- ✅ Arrange-Act-Assert (clear structure)
- ✅ Meaningful test names (clear intent)
- ✅ beforeEach for setup (isolation)
- ✅ Avoid hardcoded waits (reliability)
- ✅ Centralize test data (DRY)

---

**You now have everything needed to understand and work with this framework!**

Next: Choose a topic to deep-dive into, or write your first test!
