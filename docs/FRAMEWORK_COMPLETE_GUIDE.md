# 🚀 Playwright UI Automation Framework - Complete Learning Guide

This is your **step-by-step learning companion** to understand every aspect of your framework from scratch.

---

## 📚 Table of Contents

1. [Part 1: Foundation Concepts](#part-1-foundation-concepts)
2. [Part 2: Project Structure Deep Dive](#part-2-project-structure-deep-dive)
3. [Part 3: The Page Object Model (POM)](#part-3-the-page-object-model)
4. [Part 4: Writing UI Tests](#part-4-writing-ui-tests)
5. [Part 5: API Testing & Schema Validation](#part-5-api-testing--schema-validation)
6. [Part 6: Test Data & Fixtures](#part-6-test-data--fixtures)
7. [Part 7: Utilities & Helpers](#part-7-utilities--helpers)
8. [Part 8: Configuration & Setup](#part-8-configuration--setup)
9. [Part 9: Running & Debugging Tests](#part-9-running--debugging-tests)
10. [Part 10: Best Practices & Patterns](#part-10-best-practices--patterns)

---

# Part 1: Foundation Concepts

## 1.1 What is Playwright?

**Playwright** is a browser automation library. Think of it as **a robot that can:**

- Open web browsers (Chrome, Firefox, Safari)
- Click buttons
- Fill forms
- Navigate pages
- Take screenshots
- Intercept network requests
- Validate page content

### Why Playwright?

```
✅ Multi-browser support (no need for different tools per browser)
✅ Fast execution
✅ Built-in reporting and screenshots
✅ Great TypeScript support
✅ API testing capabilities
✅ Can run in headless mode (no visible browser) or headed mode (visible browser)
```

## 1.2 What is TypeScript?

**TypeScript** is JavaScript with **type safety**. It helps you:

- Catch errors _before_ running code
- Get better IDE suggestions (autocomplete)
- Write self-documenting code

### Example:

```typescript
// ❌ JavaScript - No type checking (WRONG!)
function add(a, b) {
  return a + b;
}
add('5', 3); // Result: "53" (string concatenation, not math!)

// ✅ TypeScript - Has type checking (CORRECT!)
function add(a: number, b: number): number {
  return a + b;
}
add('5', 3); // ❌ ERROR: Type 'string' is not assignable to type 'number'
add(5, 3); // ✅ OK: Result is 8
```

## 1.3 Key Testing Concepts

### What is a Test?

A test is **a series of steps that verify your application works correctly**.

```typescript
test('User can login successfully', async ({ page }) => {
  // Step 1: Navigate to login page
  await page.goto('https://myapp.com/login');

  // Step 2: Fill username
  await page.fill('input[name="username"]', 'john@example.com');

  // Step 3: Fill password
  await page.fill('input[name="password"]', 'password123');

  // Step 4: Click login button
  await page.click('button:has-text("Login")');

  // Step 5: Verify we're logged in (dashboard is visible)
  await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
});
```

### The Testing Pyramid

```
        🔝 End-to-End Tests (E2E)
       /     \
      /       \  - Full user workflows
     /         \ - Slow, expensive
    /__________\

        API/Integration Tests
       /     \
      /       \  - Test APIs directly
     /         \ - Medium speed
    /__________\

        Unit Tests
       /     \
      /       \  - Single functions/methods
     /         \ - Fast, cheap
    /__________\
```

Your framework focuses on **E2E tests** (UI testing) and **API tests**.

## 1.4 Page Object Model (POM) Pattern

POM separates **test logic** from **page implementation**.

### ❌ Without POM (Hard to Maintain)

```typescript
test('Login test', async ({ page }) => {
  // Selectors hardcoded in test
  await page.fill('input[name="username"]', 'user@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button:has-text("Login")');
  await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
});

test('Another login test', async ({ page }) => {
  // Selectors repeated (hard to maintain!)
  await page.fill('input[name="username"]', 'admin@example.com');
  await page.fill('input[name="password"]', 'adminpass');
  await page.click('button:has-text("Login")');
  await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
});
```

**Problem:** If selector changes, you must update EVERY test!

### ✅ With POM (Clean & Maintainable)

```typescript
// LoginPage.ts - All login selectors and actions in ONE place
export class LoginPage extends BasePage {
  async fillUsername(username: string) {
    await this.getByTestId('username-field').fill(username);
  }

  async fillPassword(password: string) {
    await this.getByTestId('password-field').fill(password);
  }

  async clickLoginButton() {
    await this.getByRole('button', { name: /login/i }).click();
  }

  async login(username: string, password: string) {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLoginButton();
  }
}

// login.spec.ts - Clean, readable test
test('Login test', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login('user@example.com', 'password123');
  await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
});

test('Another login test', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login('admin@example.com', 'adminpass');
  await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
});
```

**Benefits:**

- Selectors in ONE place ✅
- Tests read like English ✅
- Easy to update selectors ✅
- Code reuse ✅

---

# Part 2: Project Structure Deep Dive

## 2.1 Complete Folder Structure

```
UI_Automation_Framework/
│
├── .github/workflows/          # 🔄 CI/CD pipelines (GitHub Actions)
│   ├── test.yml                # Automated test execution
│   └── codeql.yml              # Security scanning
│
├── .husky/                     # 🎣 Git hooks (run before commits)
│   └── pre-commit              # Enforces code quality
│
├── src/                        # 📁 Source code (framework code)
│   ├── pages/                  # 📄 Page Objects (one per page)
│   │   ├── BasePage.ts         # Base class with shared methods
│   │   ├── LoginPage.ts        # Login page object
│   │   ├── DashboardPage.ts    # Dashboard page object
│   │   ├── ProfilePage.ts      # Profile page object
│   │   ├── RegisterPage.ts     # Registration page object
│   │   ├── SearchPage.ts       # Search page object
│   │   └── index.ts            # Exports all pages
│   │
│   ├── interface/              # 🔧 TypeScript Contracts
│   │   ├── pages.interface.ts  # ILoginPage, IDashboardPage, etc.
│   │   └── api.interface.ts    # API request/response types
│   │
│   ├── utils/                  # 🛠️ Helper functions
│   │   ├── selectors.ts        # Centralized selector definitions
│   │   ├── apiHelper.ts        # Type-safe API client
│   │   ├── schemaValidator.ts  # JSON schema validation (AJV)
│   │   ├── assertions.ts       # Common assertions
│   │   ├── logger.ts           # Logging utilities
│   │   ├── envHelper.ts        # Environment variable helpers
│   │   ├── formatDate.ts       # Date formatting
│   │   └── waitForElement.ts   # Wait conditions
│   │
│   └── fixture/                # 📦 Static test data
│       └── (Playwright fixtures if added)
│
├── tests/                      # ✅ Test files (organized by feature)
│   ├── 01-fundamentals/        # Basic examples
│   │   ├── login.spec.ts       # Login test examples
│   │   └── testData.json       # Test data
│   │
│   ├── 02-interactions/        # User interactions
│   │   └── (Clicking, filling, etc.)
│   │
│   ├── 03-test-organization/   # Grouped tests
│   │   └── (Test suites, nesting)
│   │
│   ├── 04-advanced-features/   # Advanced patterns
│   │   └── (Screenshots, tracing, etc.)
│   │
│   ├── 05-page-object-model/   # POM examples
│   │   ├── authenticated.spec.ts
│   │   ├── dashboard.spec.ts
│   │   └── profile.spec.ts
│   │
│   ├── 06-api-testing/         # API test examples
│   │   └── user-api.spec.ts    # API test with schema validation
│   │
│   ├── config.ts               # Test configuration
│   ├── example.spec.ts         # Simple example test
│   └── README.md               # Test documentation
│
├── test-data/                  # 📊 External test data (JSON)
│   ├── fixtures/               # Test data files
│   │   ├── example.json        # Example data
│   │   ├── login.testUsers.json # User credentials for testing
│   │   ├── login.env.json      # Environment credentials
│   │   ├── form.json           # Form test data
│   │   ├── search.json         # Search test data
│   │   └── README.md           # Data documentation
│   │
│   ├── dev/                    # 🔧 Development environment data
│   ├── qa/                     # 🧪 QA environment data
│   └── storage-state/          # 💾 Saved browser sessions
│       └── storageState.json   # Cached login state
│
├── schemas/                    # 📋 JSON Schema definitions
│   ├── user.schema.json        # Schema for user API responses
│   ├── error.schema.json       # Schema for error responses
│   ├── createUser.request.schema.json # Schema for request bodies
│   └── README.md               # Schema documentation
│
├── globals/                    # 🌍 Setup/Teardown scripts
│   ├── global-setup.ts         # Runs ONCE before all tests
│   │                            # (login, seed data, etc.)
│   └── global-teardown.ts      # Runs ONCE after all tests
│                                # (cleanup, logout, etc.)
│
├── playwright-report/          # 📊 HTML test reports (generated)
│   └── index.html              # Open this to see test results
│
├── test-results/               # 📈 JSON test results (generated)
│   └── results.json            # Raw test data
│
├── screenshots/                # 📸 Failed test screenshots (generated)
│   └── (Screenshots of failures)
│
├── Dockerfile                  # 🐳 Docker image configuration
├── docker-compose.yml          # 🐳 Docker orchestration
├── playwright.config.ts        # ⚙️ Playwright configuration
├── tsconfig.json               # ⚙️ TypeScript configuration
├── .eslintrc.json              # 🔍 Code style rules
├── .prettierrc.json            # 🎨 Code formatting rules
├── package.json                # 📦 Dependencies & scripts
├── README.md                   # 📖 Project readme
├── LEARNING_GUIDE.md           # 📚 Detailed guide
└── FRAMEWORK_COMPLETION.md     # ✅ Completion checklist
```

## 2.2 Understanding Each Component

### 📄 pages/ Directory

Contains **Page Object classes** - one class per page in your application.

```typescript
// src/pages/LoginPage.ts
export class LoginPage extends BasePage {
  // Methods that represent user actions on the login page
  async login(username: string, password: string): Promise<void> { ... }
  async fillUsername(username: string): Promise<void> { ... }
  async fillPassword(password: string): Promise<void> { ... }
  async clickLoginButton(): Promise<void> { ... }
  async assertLoginSuccess(): Promise<void> { ... }
}
```

### 🔧 interface/ Directory

Contains **TypeScript interfaces** that define **contracts** for page objects.

```typescript
// src/interface/pages.interface.ts
export interface ILoginPage extends IBasePage {
  login(username: string, password: string): Promise<void>;
  assertLoginSuccess(): Promise<void>;
  assertLoginFailure(): Promise<void>;
}
```

**Purpose:** Ensures every page object implements required methods.

### 🛠️ utils/ Directory

Contains **helper functions** used across tests.

```typescript
// src/utils/selectors.ts       - Centralized selectors
// src/utils/apiHelper.ts       - API request methods
// src/utils/schemaValidator.ts - Validate API responses
// src/utils/assertions.ts      - Common assertions
// src/utils/logger.ts          - Logging
// src/utils/envHelper.ts       - Environment variables
```

### 📊 test-data/ Directory

Contains **external test data** in JSON files.

```json
// test-data/fixtures/login.testUsers.json
{
  "validUsers": [
    { "username": "user1@example.com", "password": "pass123" },
    { "username": "admin@example.com", "password": "adminpass" }
  ],
  "invalidUsers": [{ "username": "wrong@example.com", "password": "badpass" }]
}
```

**Purpose:** Separate test data from code (easy to maintain).

### 📋 schemas/ Directory

Contains **JSON schemas** for validating API responses.

```json
// schemas/user.schema.json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "name", "email", "username"],
  "properties": {
    "id": { "type": "integer" },
    "name": { "type": "string" },
    "email": { "type": "string", "format": "email" },
    "username": { "type": "string" }
  }
}
```

**Purpose:** Ensure API responses have correct structure and data types.

---

# Part 3: The Page Object Model

## 3.1 How BasePage Works

`BasePage` is the **foundation class** that all page objects inherit from.

### What BasePage Provides

```typescript
// src/pages/BasePage.ts
export abstract class BasePage {
  constructor(protected page: Page) { }

  // Common methods available to all pages:

  // 1️⃣ Navigation methods
  abstract goto(): Promise<void>; // Each page implements its own URL
  async navigateTo(path: string): Promise<void> { ... }  // Navigate to relative path
  getCurrentUrl(): string { ... }  // Get current URL

  // 2️⃣ Locator methods (Playwright's accessible locators)
  protected getByTestId(testId: string) { ... }        // Find by data-testid
  protected getByRole(role: string, options?: {...}) { ... } // Find by ARIA role
  protected getByPlaceholder(placeholder: string) { ... } // Find by placeholder
  protected getByText(text: string) { ... }            // Find by visible text
  protected locator(selector: string) { ... }          // Generic CSS/XPath

  // 3️⃣ Wait methods
  async waitForPageLoad(): Promise<void> { ... }  // Wait for network idle

  // 4️⃣ Utility methods
  async close(): Promise<void> { ... }  // Close the page
}
```

### Selector Priority Strategy

Your framework uses **accessible, resilient selectors** in this order:

```
1️⃣ data-testid
   - Most resilient
   - Explicit test identifiers
   - Won't break if styling changes
   Example: await this.getByTestId('username-field').fill('john@example.com')

2️⃣ getByRole
   - Accessible (ARIA roles)
   - Captures semantic intent
   - Works across different markup
   Example: await this.getByRole('button', { name: /login/i }).click()

3️⃣ getByPlaceholder
   - Good for form inputs
   - Stable selector
   Example: await this.getByPlaceholder('Enter email').fill('john@example.com')

4️⃣ getByText
   - Good for buttons/links with visible text
   Example: await this.getByText(/forgot password/i).click()

5️⃣ CSS/XPath selectors
   - Last resort (BRITTLE!)
   - Breaks if class names or HTML structure changes
   - Only use when other options aren't available
   Example: await this.locator('#username').fill('john@example.com')
```

## 3.2 Creating a Page Object

### Step 1: Create the Class

```typescript
// src/pages/LoginPage.ts
import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ILoginPage } from '../interface/pages.interface';

export class LoginPage extends BasePage implements ILoginPage {
  // All methods here
}
```

### Step 2: Implement goto() Method

```typescript
async goto(): Promise<void> {
  await this.navigateTo('/login');  // Navigate to /login path
  await this.waitForPageLoad();     // Wait for page to load
}
```

### Step 3: Implement Action Methods

```typescript
async fillUsername(username: string): Promise<void> {
  // Use data-testid (most resilient)
  await this.getByTestId('username-field').fill(username);
}

async fillPassword(password: string): Promise<void> {
  await this.getByTestId('password-field').fill(password);
}

async clickLoginButton(): Promise<void> {
  // Use role-based locator (accessible)
  await this.getByRole('button', { name: /login|sign in/i }).click();
}
```

### Step 4: Implement Assertion Methods

```typescript
async assertLoginSuccess(): Promise<void> {
  // Verify success by checking for welcome message
  await expect(this.getByText(/welcome|dashboard/i).first()).toBeVisible();
}

async assertLoginFailure(): Promise<void> {
  // Verify failure by checking for error message
  await expect(this.getByTestId('login-error')).toBeVisible();
}
```

### Step 5: Implement Composite Methods

```typescript
async login(username: string, password: string): Promise<void> {
  await this.fillUsername(username);      // Fill username
  await this.fillPassword(password);      // Fill password
  await this.clickLoginButton();          // Click login
  await this.page.waitForLoadState('networkidle'); // Wait for navigation
}
```

### Step 6: Export from index.ts

```typescript
// src/pages/index.ts
export { BasePage } from './BasePage';
export { LoginPage } from './LoginPage';
export { DashboardPage } from './DashboardPage';
export { ProfilePage } from './ProfilePage';
// ... export other pages
```

## 3.3 Complete LoginPage Example

```typescript
// src/pages/LoginPage.ts
import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ILoginPage } from '../interface/pages.interface';
import { SELECTORS_BY_TESTID, SELECTORS } from '../utils/selectors';

/**
 * Login Page Object Model
 * Handles all login-related interactions and assertions
 */
export class LoginPage extends BasePage implements ILoginPage {
  /**
   * Navigate to login page
   */
  async goto(): Promise<void> {
    await this.navigateTo('/login');
    await this.waitForPageLoad();
  }

  /**
   * Fill username/email field
   */
  async fillUsername(username: string): Promise<void> {
    await this.getByTestId(SELECTORS_BY_TESTID.login.usernameInput).fill(username);
  }

  /**
   * Fill password field
   */
  async fillPassword(password: string): Promise<void> {
    await this.getByTestId(SELECTORS_BY_TESTID.login.passwordInput).fill(password);
  }

  /**
   * Click login button
   */
  async clickLoginButton(): Promise<void> {
    await this.getByRole('button', { name: /login|sign in/i }).click();
  }

  /**
   * Complete login flow
   */
  async login(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLoginButton();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verify successful login
   */
  async assertLoginSuccess(): Promise<void> {
    await expect(this.getByText(/welcome|dashboard|logged in/i).first()).toBeVisible();
  }

  /**
   * Verify login failed
   */
  async assertLoginFailure(): Promise<void> {
    await expect(
      this.getByTestId(SELECTORS_BY_TESTID.login.errorMessage).or(
        this.locator(SELECTORS.login.errorMessage),
      ),
    ).toBeVisible();
  }
}
```

---

# Part 4: Writing UI Tests

## 4.1 Test Structure

Every Playwright test has this structure:

```typescript
test('Test name that describes what is being tested', async ({ page }) => {
  // Arrange: Set up test data and navigate
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  // Act: Perform user actions
  await loginPage.login('user@example.com', 'password123');

  // Assert: Verify the results
  await loginPage.assertLoginSuccess();
});
```

This is called **AAA (Arrange-Act-Assert)** pattern.

## 4.2 Simple Test Example

```typescript
// tests/01-fundamentals/login.spec.ts
import { test } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { getEnv } from '../../src/utils/envHelper';
import testUsers from '../../test-data/fixtures/login.testUsers.json';
import envLogin from '../../test-data/fixtures/login.env.json';
import { assertLoginSuccess, assertLoginFailure } from '../../src/utils/assertions';

// Single test with environment credentials
test('Login with environment credentials', async ({ page }) => {
  // 🔧 Arrange: Set up
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  // Get credentials from .env or JSON file
  const username = getEnv('USERNAME') || envLogin.username;
  const password = getEnv('PASSWORD') || envLogin.password;

  // 🎬 Act: Perform login
  await loginPage.login(username, password);

  // ✅ Assert: Verify success
  await assertLoginSuccess(page);
});
```

## 4.3 Data-Driven Tests

**Data-driven** means **one test template, multiple data sets**.

```typescript
// Same test runs with different data
for (const user of testUsers.validUsers) {
  test(`Login succeeds for ${user.username}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(user.username, user.password);
    await assertLoginSuccess(page);
  });
}

// Test invalid logins
for (const user of testUsers.invalidUsers) {
  test(`Login fails for ${user.username}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(user.username, user.password);
    await assertLoginFailure(page);
  });
}
```

**Data file** (`test-data/fixtures/login.testUsers.json`):

```json
{
  "validUsers": [
    { "username": "user1@example.com", "password": "pass123" },
    { "username": "admin@example.com", "password": "adminpass" }
  ],
  "invalidUsers": [{ "username": "wrong@example.com", "password": "badpass" }]
}
```

**Result:** You get multiple tests from one template:

- ✅ Login succeeds for user1@example.com
- ✅ Login succeeds for admin@example.com
- ❌ Login fails for wrong@example.com

## 4.4 Test Organization with describe()

Group related tests:

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';

test.describe('Authentication', () => {
  // All these tests are grouped under "Authentication"

  test('User can login with valid credentials', async ({ page }) => {
    // Test code
  });

  test('User cannot login with invalid credentials', async ({ page }) => {
    // Test code
  });

  test('User can logout', async ({ page }) => {
    // Test code
  });

  // Nested groups
  test.describe('Password Reset', () => {
    test('User can request password reset', async ({ page }) => {
      // Test code
    });

    test('User can reset password with token', async ({ page }) => {
      // Test code
    });
  });
});
```

## 4.5 Common Assertions

```typescript
// Visibility
await expect(element).toBeVisible();
await expect(element).not.toBeVisible();

// Text content
await expect(element).toContainText('Login successful');
await expect(element).toHaveText('Exact text');

// Attributes
await expect(element).toHaveAttribute('href', '/dashboard');

// Enabled/Disabled
await expect(element).toBeEnabled();
await expect(element).toBeDisabled();

// Count
await expect(page.locator('button')).toHaveCount(5);

// URL
await expect(page).toHaveURL('/dashboard');
await expect(page).toHaveURL(/\/dashboard/);

// Title
await expect(page).toHaveTitle('Dashboard');
```

---

# Part 5: API Testing & Schema Validation

## 5.1 What is API Testing?

**API** = Application Programming Interface

Instead of testing through the browser UI, you test the **backend directly**:

```typescript
// ❌ What you DON'T do in API tests
await page.goto('/api/users'); // Can't navigate to APIs

// ✅ What you DO in API tests
const response = await request.get('https://api.example.com/users/1');
const data = await response.json();
expect(data.name).toBe('John Doe');
```

### Why Test APIs?

```
✅ Faster execution (no browser overhead)
✅ More reliable (no UI flakiness)
✅ Test edge cases easily (error responses, boundary values)
✅ Can run in parallel
✅ Great for validating data integrity
```

## 5.2 ApiHelper Class

Your framework provides `ApiHelper` - a **type-safe API client**.

```typescript
// src/utils/apiHelper.ts
export class ApiHelper {
  private baseUrl: string;

  constructor(
    private request: APIRequestContext,
    baseUrl: string,
  ) {
    this.baseUrl = baseUrl;
  }

  /**
   * Make GET request with schema validation
   */
  async get<T>(endpoint: string, schemaFile?: string): Promise<{ data: T; status: number }> {
    const url = this.buildUrl(endpoint);
    const response = await this.request.get(url);
    const data = await response.json();

    if (schemaFile) {
      schemaValidator.validateOrThrow(data, schemaFile);
    }

    return {
      data: data as T,
      status: response.status(),
    };
  }

  /**
   * Make POST request with type safety
   */
  async post<T>(
    endpoint: string,
    payload: unknown,
    schemaFile?: string,
  ): Promise<{ data: T; status: number }> {
    // Implementation...
  }
}
```

### GenericMethods

```typescript
// GET request with automatic schema validation
const { data: user, status } = await apiHelper.get<User>(
  '/users/1',
  'user.schema.json', // Validates response structure
);

// POST request with typed payload
const response = await apiHelper.post<User>(
  '/users',
  {
    name: 'John Doe',
    email: 'john@example.com',
    username: 'johndoe',
  },
  'user.schema.json',
);

// PUT request
await apiHelper.put<User>('/users/1', { name: 'Jane Doe' }, 'user.schema.json');

// DELETE request
await apiHelper.delete<void>('/users/1');
```

## 5.3 JSON Schema Validation

**JSON Schema** = A template that defines what valid JSON looks like.

### Example Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "User Schema",
  "type": "object",
  "required": ["id", "name", "email", "username"],
  "properties": {
    "id": {
      "type": "integer",
      "description": "Unique user identifier"
    },
    "name": {
      "type": "string",
      "minLength": 1,
      "description": "User's full name"
    },
    "email": {
      "type": "string",
      "format": "email",
      "description": "User's email address"
    },
    "username": {
      "type": "string",
      "minLength": 3,
      "description": "User's username"
    },
    "phone": {
      "type": "string",
      "description": "Optional phone number"
    }
  }
}
```

### Schema Validation in Tests

```typescript
import { schemaValidator } from '../../src/utils/schemaValidator';

test('Validate user response against schema', async ({ request }) => {
  const response = await request.get('https://api.example.com/users/1');
  const user = await response.json();

  // This line validates user against user.schema.json
  // If validation fails, it throws an error
  schemaValidator.validateOrThrow(user, 'user.schema.json');
});
```

**What validation checks:**

```
✅ Required fields exist (id, name, email, username)
✅ Fields have correct types (id is number, not string)
✅ String fields have minimum length
✅ Email is in valid format
✅ No extra unexpected fields (if strict mode)
```

## 5.4 Complete API Test Example

```typescript
// tests/06-api-testing/user-api.spec.ts
import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../src/utils/apiHelper';
import { schemaValidator } from '../../src/utils/schemaValidator';
import type { CreateUserRequest } from '../../src/interface/api.interface';

const BASE_API_URL = 'https://jsonplaceholder.typicode.com';

test.describe('User API Tests', () => {
  // Test 1: GET with schema validation
  test('GET user by ID with schema validation', async ({ request }) => {
    const apiHelper = new ApiHelper(request, BASE_API_URL);

    // Fetch user and validate against schema
    const { data: user } = await apiHelper.get('/users/1', 'user.schema.json');

    // Assertions on the data
    expect(user.id).toBe(1);
    expect(user.name).toBe('Leanne Graham');
    expect(user.email).toContain('@');
    expect(user.username).toBeTruthy();
  });

  // Test 2: GET multiple and validate each
  test('GET multiple users and validate each', async ({ request }) => {
    const response = await request.get(`${BASE_API_URL}/users`);
    const users = await response.json();

    // Validate array structure
    expect(Array.isArray(users)).toBeTruthy();
    expect(users.length).toBeGreaterThan(0);

    // Validate first 3 against schema
    for (const user of users.slice(0, 3)) {
      schemaValidator.validateOrThrow(user, 'user.schema.json');
    }
  });

  // Test 3: POST create new user
  test('POST create new user with validation', async ({ request }) => {
    const apiHelper = new ApiHelper(request, BASE_API_URL);

    const newUser: CreateUserRequest = {
      name: 'Test User',
      email: 'testuser@example.com',
      username: 'testuser123',
    };

    const { data: createdUser } = await apiHelper.post('/users', newUser, 'user.schema.json');

    // Verify creation
    expect(createdUser.name).toBe(newUser.name);
    expect(createdUser.email).toBe(newUser.email);
    expect(createdUser.id).toBeDefined();
  });

  // Test 4: Validate email format
  test('Validate user email format in response', async ({ request }) => {
    const apiHelper = new ApiHelper(request, BASE_API_URL);
    const { data: user } = await apiHelper.get('/users/1');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(user.email).toMatch(emailRegex);
  });

  // Test 5: Test error handling
  test('Handle 404 error gracefully', async ({ request }) => {
    const response = await request.get(`${BASE_API_URL}/users/99999`);
    expect(response.status()).toBe(404);
  });
});
```

---

# Part 6: Test Data & Fixtures

## 6.1 Why Separate Test Data?

**Good Practice:**

```typescript
// ❌ BAD: Data hardcoded in test
test('Login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login('user1@example.com', 'pass123');
});

// ✅ GOOD: Data in external file
import testUsers from '../../test-data/fixtures/login.testUsers.json';

for (const user of testUsers.validUsers) {
  test(`Login as ${user.username}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(user.username, user.password);
  });
}
```

**Benefits:**

```
✅ Easy to change test data without editing code
✅ Can have different data for dev/qa/staging/prod
✅ Non-technical people can manage test data
✅ Version control for test data
✅ Data reuse across multiple tests
```

## 6.2 Test Data Structure

### User Credentials

```json
// test-data/fixtures/login.testUsers.json
{
  "validUsers": [
    {
      "username": "user1@example.com",
      "password": "pass123"
    },
    {
      "username": "admin@example.com",
      "password": "adminpass"
    }
  ],
  "invalidUsers": [
    {
      "username": "wrong@example.com",
      "password": "badpass"
    }
  ]
}
```

### Environment Credentials

```json
// test-data/fixtures/login.env.json
{
  "username": "test@example.com",
  "password": "testpassword123"
}
```

### Search Test Data

```json
// test-data/fixtures/search.json
{
  "searchTests": [
    {
      "searchTerm": "laptop",
      "expectedResultCount": 10,
      "firstResultTitle": "Dell Laptop"
    },
    {
      "searchTerm": "invalid-product-xyz",
      "expectedResultCount": 0,
      "expectNoResults": true
    }
  ]
}
```

### Form Test Data

```json
// test-data/fixtures/form.json
{
  "validRegistrations": [
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "SecurePass123!",
      "passwordConfirm": "SecurePass123!"
    }
  ],
  "invalidRegistrations": [
    {
      "name": "Jane",
      "email": "invalid-email",
      "password": "weak",
      "errorField": "email"
    }
  ]
}
```

## 6.3 Using Test Data in Tests

```typescript
import testUsers from '../../test-data/fixtures/login.testUsers.json';

// Single test with first valid user
test('Login as first user', async ({ page }) => {
  const user = testUsers.validUsers[0];
  const loginPage = new LoginPage(page);
  await loginPage.login(user.username, user.password);
});

// Data-driven: create test per user
for (const user of testUsers.validUsers) {
  test(`Login as ${user.username}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(user.username, user.password);
  });
}

// Filter data
const adminUser = testUsers.validUsers.find((u) => u.username.includes('admin'));
test('Admin can login', async ({ page }) => {
  if (!adminUser) throw new Error('Admin user not found');
  const loginPage = new LoginPage(page);
  await loginPage.login(adminUser.username, adminUser.password);
});
```

## 6.4 Environment-Specific Data

Different data for different environments:

```
test-data/
├── dev/             # Development environment
│   ├── users.json
│   └── credentials.json
│
├── qa/              # QA environment
│   ├── users.json
│   └── credentials.json
│
└── prod/            # Production (use sparingly! readonly tests)
    ├── users.json
    └── credentials.json
```

**Usage:**

```typescript
const env = process.env.TEST_ENV || 'qa';
const testUsers = require(`../../test-data/${env}/users.json`);

test('Login with environment-specific user', async ({ page }) => {
  const user = testUsers.validUsers[0];
  const loginPage = new LoginPage(page);
  await loginPage.login(user.username, user.password);
});
```

---

# Part 7: Utilities & Helpers

## 7.1 Selectors Utility

Centralized selector definitions prevent duplication.

```typescript
// src/utils/selectors.ts
/**
 * Selector Strategy Priority:
 * 1. data-testid (most resilient)
 * 2. getByRole  (accessible)
 * 3. getByPlaceholder
 * 4. getByText
 * 5. CSS selectors (brittle, last resort)
 */

export const SELECTORS_BY_TESTID = {
  login: {
    usernameInput: 'username-field',
    passwordInput: 'password-field',
    submitButton: 'login-button',
    errorMessage: 'login-error',
  },
  dashboard: {
    welcomeHeader: 'welcome-header',
    profileLink: 'profile-nav-link',
    profileButton: 'profile-button',
  },
  search: {
    input: 'search-input',
    results: 'search-results',
    resultItem: 'search-result-item',
    noResults: 'no-results-message',
  },
  profile: {
    nameInput: 'name-input',
    saveButton: 'save-button',
    nameDisplay: 'name-display',
    emailInput: 'email-input',
  },
};

// Fallback CSS selectors
export const SELECTORS = {
  login: {
    usernameInput: '#username',
    passwordInput: '#password',
    submitButton: '#login-button',
    errorMessage: '.error-message',
  },
  // ... more selectors
};
```

## 7.2 Environment Helper

Manage environment variables safely.

```typescript
// src/utils/envHelper.ts
export function getEnv(key: string, defaultValue?: string): string | undefined {
  const value = process.env[key];

  if (!value && !defaultValue) {
    console.warn(`Environment variable ${key} not found`);
    return undefined;
  }

  return value || defaultValue;
}

// Usage
const username = getEnv('USERNAME') || 'default@example.com';
const password = getEnv('PASSWORD') || 'defaultpass';
const baseUrl = getEnv('BASE_URL', 'https://example.com');
```

## 7.3 Assertions Utility

Common assertions in one place.

```typescript
// src/utils/assertions.ts
import { expect, Page } from '@playwright/test';

export async function assertLoginSuccess(page: Page): Promise<void> {
  await expect(page.getByText(/welcome|dashboard|logged in/i).first()).toBeVisible();
}

export async function assertLoginFailure(page: Page): Promise<void> {
  await expect(page.getByTestId('login-error')).toBeVisible();
}

export async function assertPageTitle(page: Page, title: string): Promise<void> {
  await expect(page).toHaveTitle(new RegExp(title, 'i'));
}

// Usage in tests
import { assertLoginSuccess, assertPageTitle } from '../../src/utils/assertions';

test('Login success', async ({ page }) => {
  // ... login code ...
  await assertLoginSuccess(page);
});
```

## 7.4 API Response Types

Type-safe API contracts.

```typescript
// src/interface/api.interface.ts

/**
 * User response from API
 */
export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  phone?: string;
}

/**
 * Request payload to create user
 */
export interface CreateUserRequest {
  name: string;
  email: string;
  username: string;
}

/**
 * Error response
 */
export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

/**
 * Successful API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  status: number;
  timestamp: string;
}
```

**Usage in tests:**

```typescript
import type { User, CreateUserRequest } from '../../src/interface/api.interface';

test('Create user', async ({ request }) => {
  const apiHelper = new ApiHelper(request, BASE_URL);

  const newUser: CreateUserRequest = {
    name: 'John Doe',
    email: 'john@example.com',
    username: 'johndoe',
  };

  const response = await apiHelper.post<User>('/users', newUser);
  // response.data is typed as User ✅
  expect(response.data.id).toBeDefined();
});
```

---

# Part 8: Configuration & Setup

## 8.1 Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  // Where tests are located
  testDir: './tests',

  // Timeout per test (ms)
  timeout: 30_000,

  // Run tests in parallel
  fullyParallel: true,

  // Fail on CI if test.only() left in code
  forbidOnly: !!process.env.CI,

  // Retry failed tests (on CI only)
  retries: process.env.CI ? 2 : 0,

  // Number of worker processes
  workers: process.env.CI ? 1 : undefined,

  // Global setup/teardown scripts
  globalSetup: './globals/global-setup.ts',
  globalTeardown: './globals/global-teardown.ts',

  // Test reporters (output formats)
  reporter: [
    ['html'], // HTML report
    ['list'], // Console output
    ['json', { outputFile: 'test-results/results.json' }], // JSON results
  ],

  // Shared settings for all tests
  use: {
    baseURL: process.env.BASE_URL || 'https://example.com',
    actionTimeout: 5000, // Action timeout
    navigationTimeout: 15000, // Navigation timeout
    storageState: 'storage-state/storageState.json', // Reuse login state
    screenshot: 'only-on-failure', // Screenshot on failure
    video: 'retain-on-failure', // Record video on failure
    trace: 'on-first-retry', // Trace on retry
  },

  // Browser configurations
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
});
```

## 8.2 TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "jsx": "react",

    // Strict type checking
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,

    // Module resolution
    "moduleResolution": "node",
    "esModuleInterop": true,
    "resolveJsonModule": true,

    // Output
    "outDir": "./dist",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,

    // Other
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*", "tests/**/*", "globals/**/*"],
  "exclude": ["node_modules"]
}
```

## 8.3 Global Setup

Runs **once** before all tests (login, seed data, etc.).

```typescript
// globals/global-setup.ts
import { chromium, request } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function globalSetup() {
  const baseUrl = process.env.BASE_URL || 'https://example.com';
  const storageDir = path.resolve(process.cwd(), 'storage-state');
  const storageFile = path.join(storageDir, 'storageState.json');

  // Create directory if not exists
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }

  // Skip if storage state already exists
  if (fs.existsSync(storageFile)) {
    console.log('Using existing storage state:', storageFile);
    return;
  }

  // Otherwise, create authenticated state
  console.log('Creating new storage state...');
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Navigate and perform login
  await page.goto(baseUrl);

  // TODO: Perform actual login steps
  // await page.fill('#username', process.env.USERNAME || '');
  // await page.fill('#password', process.env.PASSWORD || '');
  // await page.click('button:has-text("Login")');
  // await page.waitForNavigation();

  // Save authenticated state
  await page.context().storageState({ path: storageFile });
  await browser.close();

  console.log('Storage state saved to:', storageFile);
}

export default globalSetup;
```

## 8.4 Global Teardown

Runs **once** after all tests (cleanup, reporting, etc.).

```typescript
// globals/global-teardown.ts
async function globalTeardown() {
  console.log('Global teardown started...');

  // Clean up example:
  // - Delete temporary users created during tests
  // - Reset database state
  // - Send reports
  // - Close connections

  console.log('Global teardown completed');
}

export default globalTeardown;
```

---

# Part 9: Running & Debugging Tests

## 9.1 NPM Scripts

```json
{
  "scripts": {
    "test": "playwright test", // Run all tests
    "test:headed": "playwright test --headed", // Run with visible browser
    "test:debug": "playwright test --debug", // Interactive debug mode
    "test:ui": "playwright test --ui", // UI Mode (visual test runner)
    "lint": "eslint . --ext .ts", // Check code style
    "lint:fix": "eslint . --ext .ts --fix", // Fix code style
    "typecheck": "tsc --noEmit", // Check TypeScript types
    "format": "prettier --write ." // Format code
  }
}
```

## 9.2 Individual Test Commands

```bash
# Run specific test file
npm test -- tests/01-fundamentals/login.spec.ts

# Run specific test within file
npm test -- -g "Login with valid credentials"

# Run tests from specific folder
npm test -- tests/05-page-object-model

# Run tests matching pattern
npm test -- -g "API"

# Run single browser
npm test -- --project=chromium

# Run with headed browser (see what's happening)
npm test:headed -- tests/01-fundamentals/login.spec.ts

# Run in debug mode (step through code)
npm test:debug -- tests/01-fundamentals/login.spec.ts

# Run in UI Mode (visual test runner)
npm test:ui
```

## 9.3 View Test Reports

```bash
# After tests run:
npx playwright show-report

# Or open directly
open playwright-report/index.html  # macOS
start playwright-report/index.html # Windows
xdg-open playwright-report/index.html # Linux
```

## 9.4 Debug Mode

**Three ways to debug:**

### Method 1: Using `page.pause()`

```typescript
test('Login with pause for debugging', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  page.pause(); // ⏸️ Pauses here - you can inspect in browser console

  await loginPage.login('user@example.com', 'password123');
});
```

Then run: `npm test:debug`

### Method 2: Using VS Code Debugger

```typescript
// Add this in your test
await page.waitForLoadState();
debugger; // ⏸️ Breakpoint
```

Then run tests with debugger attached.

### Method 3: Using `--debug` flag

```bash
npm test:debug -- tests/01-fundamentals/login.spec.ts
```

This opens **Inspector** where you can:

- Step through code
- Inspect elements
- See console logs
- Track network requests

## 9.5 Useful Debugging Techniques

```typescript
test('Debug example', async ({ page }) => {
  // 1️⃣ Log to console
  console.log('Current URL:', page.url());
  console.log('Page title:', await page.title());

  // 2️⃣ Take screenshot
  await page.screenshot({ path: 'screenshot.png' });

  // 3️⃣ Pause execution
  await page.pause();

  // 4️⃣ Check element visibility
  const element = page.locator('#username');
  const isVisible = await element.isVisible();
  console.log('Username field visible:', isVisible);

  // 5️⃣ Get element text
  const text = await element.textContent();
  console.log('Element text:', text);

  // 6️⃣ Get all matching elements
  const buttons = page.locator('button');
  const count = await buttons.count();
  console.log('Number of buttons:', count);

  // 7️⃣ Trace network requests
  const response = await page.request.get('https://api.example.com/users');
  console.log('API Status:', response.status());
  const data = await response.json();
  console.log('API Response:', data);
});
```

---

# Part 10: Best Practices & Patterns

## 10.1 Writing Maintainable Tests

### ✅ DO: Use Page Objects

```typescript
// ✅ GOOD
const loginPage = new LoginPage(page);
await loginPage.login('user@example.com', 'password');
await loginPage.assertLoginSuccess();
```

### ❌ DON'T: Hardcode selectors in tests

```typescript
// ❌ BAD
await page.fill('input[type="email"]', 'user@example.com');
await page.fill('input[type="password"]', 'password');
await page.click('button[data-id="login"]');
```

### ✅ DO: Use meaningful test names

```typescript
// ✅ GOOD: Describes what is being tested and expected outcome
test('User can login with valid credentials and see dashboard', async ({ page }) => {

// ❌ BAD: Vague test name
test('test1', async ({ page }) => {
```

### ✅ DO: Separate Arrange-Act-Assert

```typescript
// ✅ GOOD
test('Login success', async ({ page }) => {
  // Arrange: Set up
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  // Act: Perform action
  await loginPage.login('user@example.com', 'password');

  // Assert: Verify result
  await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
});
```

### ✅ DO: One assertion per test

```typescript
// ✅ GOOD: Each test does ONE thing
test('Login with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password');
  await loginPage.assertLoginSuccess();
});

// ❌ BAD: Testing multiple things in one test
test('User workflow', async ({ page }) => {
  // Login
  // Update profile
  // Search for products
  // Add to cart
  // Checkout
  // Too much!
});
```

## 10.2 Resilient Selectors

### Selector Priority

```typescript
// 1️⃣ BEST: data-testid (explicit, won't break on styling changes)
await btn.getByTestId('login-button').click();

// 2️⃣ GOOD: Role-based (accessible, semantic)
await page.getByRole('button', { name: /login/i }).click();

// 3️⃣ OKAY: Placeholder text
await page.getByPlaceholder('Enter email').fill('user@example.com');

// 4️⃣ OKAY: Text content
await page.getByText('Save Changes').click();

// 5️⃣ LAST RESORT: CSS selectors (brittle!)
await page.locator('#login-btn').click();
```

### RegEx Matching

```typescript
// Using regex for flexible matching
await page.getByRole('button', { name: /login|sign in/i }).click();
await page.getByText(/welcome|hello/i);
```

## 10.3 Async/Await Patterns

```typescript
// ✅ DO: Always use await
test('Login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();          // Wait for navigation
  await loginPage.login(...);       // Wait for login
  await expect(...).toBeVisible();  // Wait for assertion
});

// ❌ DON'T: Forget await (causes flakiness)
test('Login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  loginPage.goto();        // ❌ Not waiting!
  loginPage.login(...);    // ❌ Not waiting!
});
```

## 10.4 Error Handling

```typescript
// Test error scenarios
test('Handle login error', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('wrong@example.com', 'badpass');

  // Assert error message appears
  await expect(page.locator('.error-message')).toBeVisible();
  await expect(page.locator('.error-message')).toContainText('Invalid credentials');
});

// Test with try-catch for unexpected errors
test('Graceful error handling', async ({ page }) => {
  try {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
  } catch (error) {
    console.error('Navigation failed:', error);
    throw error; // Re-throw to fail test
  }
});
```

## 10.5 Code Organization

### Logical Test Grouping

```typescript
test.describe('Authentication', () => {
  test.describe('Login', () => {
    test('User can login with valid credentials', async ({ page }) => {
      // Test code
    });

    test('User sees error with invalid credentials', async ({ page }) => {
      // Test code
    });
  });

  test.describe('Logout', () => {
    test('User can logout', async ({ page }) => {
      // Test code
    });

    test('User is redirected to login after logout', async ({ page }) => {
      // Test code
    });
  });

  test.describe('Password Reset', () => {
    test('User can request password reset', async ({ page }) => {
      // Test code
    });
  });
});
```

### File Organization

```
tests/
├── 01-fundamentals/
│   ├── login.spec.ts
│   └── navigation.spec.ts
│
├── 05-page-object-model/
│   ├── authentication.spec.ts
│   ├── dashboard.spec.ts
│   │   └── contains Dashboard tests
│   └── profile.spec.ts
│       └── contains Profile tests
│
└── 06-api-testing/
    └── user-api.spec.ts
        └── contains API tests
```

## 10.6 Working with Dynamic Content

```typescript
// ✅ Wait for element to appear
await expect(dynamicElement).toBeVisible();

// ✅ Wait for loading spinner to disappear
await page.waitForSelector('.loading-spinner', { state: 'hidden' });

// ✅ Wait for element count to match
await expect(page.locator('li')).toHaveCount(5);

// ✅ Wait for condition
await page.waitForFunction(() => {
  return document.querySelectorAll('li').length > 0;
});
```

## 10.7 Reusable Test Fixtures

```typescript
// Custom fixture for authenticated user
test('Dashboard for authenticated user', async ({ page, context }) => {
  // Create authenticated context
  await context.addCookies([
    {
      name: 'authToken',
      value: 'token123',
      url: process.env.BASE_URL,
    },
  ]);

  const dashboardPage = new DashboardPage(page);
  await dashboardPage.goto();
  await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
});
```

---

## Summary: Complete Framework Overview

Your framework provides:

```
✅ BasePage abstraction      → Shared methods for all pages
✅ Page Objects             → One class per page (LoginPage, DashboardPage, etc.)
✅ TypeScript Interfaces    → Type-safe contracts (ILoginPage, etc.)
✅ Selectors Strategy       → Resilient selector priority
✅ Centralized Selectors    → Easy to maintain, single point of change
✅ API Helper               → Type-safe API calls
✅ Schema Validation        → Ensure API responses are correct
✅ Test Data Separation     → External JSON files for test data
✅ Global Setup/Teardown    → Pre/post test configuration
✅ Multi-browser Support    → Run tests on Chrome, Firefox, Safari
✅ Reporting               → HTML, JSON, screenshots, videos
✅ Code Quality            → ESLint, Prettier, TypeScript strict
✅ CI/CD Integration       → GitHub Actions automation
```

---

## Next Steps

1. **Review existing page objects** in `src/pages/`
2. **Read existing tests** in `tests/01-fundamentals/`
3. **Create a new page object** for a new page in your app
4. **Write a data-driven test** using test data from JSON
5. **Write an API test** with schema validation
6. **Run tests** locally and view the HTML report
7. **Debug a flaky test** using UI Mode or debug mode

---

This is your **complete learning resource**. Use it as a reference guide whenever you have questions!
