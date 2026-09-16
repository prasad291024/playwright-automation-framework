# 📖 Quick Reference Guide

Your **cheat sheet** for common tasks and patterns in the framework.

---

## 🏃 Quick Start Commands

```bash
# Install dependencies
npm install
npx playwright install

# Run all tests
npm test

# Run with visible browser
npm test:headed

# Run specific test file
npm test -- tests/01-fundamentals/login.spec.ts

# Run tests matching pattern
npm test -- -g "Login"

# Debug mode (interactive)
npm test:debug -- tests/01-fundamentals/login.spec.ts

# UI Mode (visual test runner)
npm test:ui

# View HTML report
npx playwright show-report

# Check code style
npm run lint
npm run lint:fix

# Check TypeScript types
npm run typecheck

# Format code
npm run format
```

---

## 📝 Writing a Simple Test - Complete Example

```typescript
// tests/example.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { assertLoginSuccess } from '../src/utils/assertions';

test('User can login with valid credentials', async ({ page }) => {
  // ARRANGE: Setup
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  // ACT: Perform action
  await loginPage.login('user@example.com', 'password123');

  // ASSERT: Verify result
  await assertLoginSuccess(page);
});
```

---

## 📄 Creating a New Page Object - Step-by-Step

### Step 1: Create the class file

```typescript
// src/pages/YourPage.ts
import { BasePage } from './BasePage';
import { IYourPage } from '../interface/pages.interface';
import { SELECTORS_BY_TESTID } from '../utils/selectors';

export class YourPage extends BasePage implements IYourPage {
  // Your code here
}
```

### Step 2: Implement goto() method

```typescript
async goto(): Promise<void> {
  await this.navigateTo('/your-page-path');
  await this.waitForPageLoad();
}
```

### Step 3: Add action methods

```typescript
async fillNameField(name: string): Promise<void> {
  await this.getByTestId(SELECTORS_BY_TESTID.yourPage.nameInput).fill(name);
}

async clickSaveButton(): Promise<void> {
  await this.getByRole('button', { name: /save/i }).click();
}

async updateName(name: string): Promise<void> {
  await this.fillNameField(name);
  await this.clickSaveButton();
  await this.page.waitForLoadState('networkidle');
}
```

### Step 4: Add assertion methods

```typescript
async assertNameUpdated(name: string): Promise<void> {
  await expect(
    this.getByTestId(SELECTORS_BY_TESTID.yourPage.nameDisplay)
  ).toContainText(name);
}

async assertSaveSuccess(): Promise<void> {
  await expect(
    this.getByText(/success|changes saved/i)
  ).toBeVisible();
}
```

### Step 5: Export from index.ts

```typescript
// src/pages/index.ts - Add this line
export { YourPage } from './YourPage';
```

### Step 6: Create interface

```typescript
// src/interface/pages.interface.ts - Add this
export interface IYourPage extends IBasePage {
  goto(): Promise<void>;
  fillNameField(name: string): Promise<void>;
  clickSaveButton(): Promise<void>;
  updateName(name: string): Promise<void>;
  assertNameUpdated(name: string): Promise<void>;
  assertSaveSuccess(): Promise<void>;
}
```

---

## 🧪 Writing Data-Driven Tests - Pattern

### Step 1: Create test data JSON

```json
{
  "validUsers": [
    { "username": "user1@example.com", "password": "pass123" },
    { "username": "admin@example.com", "password": "adminpass" }
  ],
  "invalidUsers": [{ "username": "wrong@example.com", "password": "badpass" }]
}
```

### Step 2: Use in test

```typescript
import testUsers from '../../test-data/fixtures/login.testUsers.json';

// Data-driven for valid users
for (const user of testUsers.validUsers) {
  test(`Login succeeds for ${user.username}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(user.username, user.password);
    await assertLoginSuccess(page);
  });
}

// Data-driven for invalid users
for (const user of testUsers.invalidUsers) {
  test(`Login fails for ${user.username}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(user.username, user.password);
    await assertLoginFailure(page);
  });
}
```

---

## 🔗 Writing API Tests - Pattern

### Basic GET with validation

```typescript
import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../src/utils/apiHelper';
import type { User } from '../../src/interface/api.interface';

test('GET user by ID with schema validation', async ({ request }) => {
  const apiHelper = new ApiHelper(request, 'https://api.example.com');

  // GET and validate
  const { data, status } = await apiHelper.get<User>('/users/1', 'user.schema.json');

  // Assertions
  expect(status).toBe(200);
  expect(data.id).toBe(1);
  expect(data.email).toContain('@');
});
```

### POST with payload and validation

```typescript
test('POST create user', async ({ request }) => {
  const apiHelper = new ApiHelper(request, 'https://api.example.com');

  const newUser = {
    name: 'John Doe',
    email: 'john@example.com',
    username: 'johndoe',
  };

  const { data, status } = await apiHelper.post<User>('/users', newUser, 'user.schema.json');

  expect(status).toBe(201);
  expect(data.id).toBeDefined();
});
```

---

## 🔍 Selector Priority Cheat Sheet

```typescript
// 1️⃣ PREFERRED: data-testid
await this.getByTestId('username-field').fill('john@example.com');

// 2️⃣ GOOD: Role-based (accessible)
await this.getByRole('button', { name: /login/i }).click();
await this.getByRole('textbox', { name: /password/i }).fill('password');

// 3️⃣ OKAY: Placeholder text
await this.getByPlaceholder('Enter email').fill('john@example.com');

// 4️⃣ OKAY: Visible text
await this.getByText('Login').click();
await this.getByText(/welcome|dashboard/i).first();

// 5️⃣ LAST RESORT: CSS selector (brittle)
await this.locator('#username').fill('john@example.com');
await this.locator('.button-primary').click();
```

---

## ✅ Common Assertions Cheat Sheet

```typescript
// Visibility
await expect(element).toBeVisible();
await expect(element).not.toBeVisible();

// Text content
await expect(element).toContainText('Login successful');
await expect(element).toHaveText('Exact text');

// Attributes
await expect(element).toHaveAttribute('href', '/dashboard');
await expect(element).toHaveAttribute('disabled');

// State
await expect(element).toBeEnabled();
await expect(element).toBeDisabled();
await expect(element).toBeChecked();
await expect(element).toHaveFocus();

// Count
await expect(page.locator('button')).toHaveCount(5);
await expect(page.locator('li')).toHaveCount(10);

// URL & Title
await expect(page).toHaveURL('/dashboard');
await expect(page).toHaveURL(/\/dashboard/);
await expect(page).toHaveTitle('Dashboard');

// Forms
await expect(input).toHaveValue('john@example.com');

// Classes
await expect(element).toHaveClass('active');
await expect(element).toHaveClass(/btn-/);
```

---

## 🎯 Debugging Patterns

### Pattern 1: Pause Execution

```typescript
test('Debug with pause', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  await page.pause(); // ⏸️ Pauses here - inspect with console

  await loginPage.login('user@example.com', 'password');
});

// Run: npm test:debug
```

### Pattern 2: Add Logs

```typescript
test('Debug with logs', async ({ page }) => {
  console.log('Current URL:', page.url());
  console.log('Page title:', await page.title());

  const loginPage = new LoginPage(page);
  await loginPage.goto();

  const element = page.locator('h1');
  console.log('Header text:', await element.textContent());

  await loginPage.login('user@example.com', 'password');
});
```

### Pattern 3: Screenshots

```typescript
test('Debug with screenshot', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  // Take screenshot for inspection
  await page.screenshot({ path: 'screenshot.png' });

  await loginPage.login('user@example.com', 'password');
});
```

### Pattern 4: Check Element State

```typescript
test('Check element state', async ({ page }) => {
  const button = page.locator('button');

  const isVisible = await button.isVisible();
  const isEnabled = await button.isEnabled();
  const text = await button.textContent();
  const html = await button.innerHTML();
  const classes = await button.getAttribute('class');

  console.log({ isVisible, isEnabled, text, html, classes });
});
```

---

## 🔧 Environment Variables

### Setup .env file

```bash
# .env file in project root
BASE_URL=https://localhost:3000
USERNAME=test@example.com
PASSWORD=testpassword123
API_BASE_URL=https://api.example.com
TEST_ENV=qa
```

### Access in code

```typescript
import { getEnv } from '../src/utils/envHelper';

const baseUrl = getEnv('BASE_URL', 'https://example.com');
const username = getEnv('USERNAME') || 'default@example.com';
const password = getEnv('PASSWORD');

// Or direct access
const env = process.env.BASE_URL || 'https://example.com';
```

---

## 📊 JSON Schema Quick Pattern

### Create a simple schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "User",
  "type": "object",
  "required": ["id", "name", "email"],
  "properties": {
    "id": {
      "type": "integer",
      "description": "User ID"
    },
    "name": {
      "type": "string",
      "minLength": 1
    },
    "email": {
      "type": "string",
      "format": "email"
    },
    "phone": {
      "type": "string",
      "description": "Optional phone"
    }
  }
}
```

### Use in test

```typescript
import { schemaValidator } from '../../src/utils/schemaValidator';

test('Validate user schema', async ({ request }) => {
  const response = await request.get('https://api.example.com/users/1');
  const user = await response.json();

  // This throws error if invalid
  schemaValidator.validateOrThrow(user, 'user.schema.json');

  // Or get result without throwing
  const result = schemaValidator.validate(user, 'user.schema.json');
  expect(result.isValid).toBe(true);
});
```

---

## 🗂️ File Organization Best Practices

### Proper structure

```
src/
├── pages/
│   ├── BasePage.ts                    ← Base
│   ├── LoginPage.ts                   ← Feature pages
│   ├── DashboardPage.ts
│   ├── ProfilePage.ts
│   └── index.ts                       ← Exports
│
├── interface/
│   ├── pages.interface.ts              ← Page contracts
│   ├── api.interface.ts                ← API types
│   └── common.interface.ts             ← Shared types
│
└── utils/
    ├── selectors.ts            ← Centralized selectors
    ├── apiHelper.ts            ← API client
    ├── schemaValidator.ts      ← Schema validation
    ├── assertions.ts           ← Common assertions
    ├── logger.ts               ← Logging
    ├── envHelper.ts            ← Env variables
    ├── formatDate.ts           ← Utilities
    └── waitForElement.ts       ← Custom wait conditions
```

---

## 🏃 Common Test Patterns

### Pattern 1: Simple Test

```typescript
test('Feature works', async ({ page }) => {
  // Arrange
  const page = new MyPage(page);
  await page.goto();

  // Act
  await page.doSomething();

  // Assert
  await page.assertSuccess();
});
```

### Pattern 2: Error Testing

```typescript
test('Error is handled', async ({ page }) => {
  const page = new MyPage(page);
  await page.goto();

  await page.doInvalidAction();

  await expect(page.locator('.error')).toBeVisible();
  await expect(page.locator('.error')).toContainText('Invalid');
});
```

### Pattern 3: Conditional Testing

```typescript
test('Conditional flow', async ({ page }) => {
  const page = new MyPage(page);
  await page.goto();

  const result = await page.locator('.message').textContent();

  if (result?.includes('success')) {
    await expect(page.locator('.dashboard')).toBeVisible();
  } else {
    await expect(page.locator('.error')).toBeVisible();
  }
});
```

### Pattern 4: Looped Testing

```typescript
test('Test multiple items', async ({ page }) => {
  const page = new MyPage(page);
  await page.goto();

  const items = await page.locator('li').all();

  for (const item of items) {
    const text = await item.textContent();
    expect(text).toHaveLength(text!.length > 0);
  }
});
```

---

## 🚀 Page Object Methods Cheat Sheet

```typescript
// Navigation
page.goto(url, options);
page.navigateTo(path);
page.goBack();
page.goForward();
page.reload();

// Waiting
page.waitForLoadState('networkidle' | 'domcontentloaded' | 'load');
page.waitForSelector(selector, options);
page.waitForFunction(() => boolean);

// Finding elements
page.locator(selector);
page.getByTestId(id);
page.getByRole(role, options);
page.getByPlaceholder(text);
page.getByText(text);
page.getByLabel(text);

// Interactions
locator.click(options);
locator.fill(value);
locator.type(text);
locator.select(value);
locator.check();
locator.uncheck();
locator.focus();
locator.hover();
locator.dragTo(target);

// Assertions (with await)
expect(locator).toBeVisible();
expect(locator).toHaveText(text);
expect(locator).toHaveValue(value);
expect(page).toHaveURL(url);
expect(page).toHaveTitle(title);

// Getting info
locator.textContent();
locator.inputValue();
locator.getAttribute(name);
locator.innerHTML();
locator.isVisible();
locator.isEnabled();
locator.count();

// Screenshots & Videos
page.screenshot(options);
page.video()?.path();
```

---

## 📋 File Naming Conventions

```
✅ GOOD:
- login.spec.ts        (test file)
- LoginPage.ts         (page object)
- ILoginPage.ts        (interface)
- user.schema.json     (schema)
- login.testUsers.json (test data)

❌ BAD:
- test.ts             (vague)
- LP.ts               (abbreviated)
- test_login.spec.ts  (underscores)
- LOGIN_SPEC.TS       (uppercase)
```

---

## 🔑 Key Takeaways

| Concept         | Key Point                                 |
| --------------- | ----------------------------------------- |
| **BasePage**    | Share common methods, extend don't repeat |
| **Interfaces**  | Define contracts, ensure consistency      |
| **Selectors**   | Prefer data-testid, then role, avoid CSS  |
| **Assertions**  | Use expect(), be specific                 |
| **Data**        | Keep external, JSON files not code        |
| **Async/Await** | Never forget, causes all flakiness        |
| **AAA**         | Every test: Arrange, Act, Assert          |
| **DRY**         | Don't Repeat Yourself, reuse code         |
| **Focus**       | One thing per test                        |
| **Names**       | Describe what and expected result         |

---

## 🆘 Troubleshooting

### Test is failing randomly (flaky test)

**Cause**: Timing issues or improper waits

**Solution**:

```typescript
// ❌ Wrong
const text = element.textContent(); // No await!

// ✅ Correct - wait for element first
await expect(element).toBeVisible();
const text = await element.textContent();
```

### Selector not found

**Cause**: Wrong selector or element not rendered yet

**Solution**:

```typescript
// ✅ Use more resilient selector
await page.getByTestId('user-name').fill('john'); // Instead of CSS

// ✅ Wait for it first
await expect(page.locator('input')).toBeVisible();
await page.locator('input').fill('john');
```

### Test hangs/times out

**Cause**: Infinite wait or wrong wait condition

**Solution**:

```typescript
// ✅ Set timeout
await page.waitForSelector('.modal', { timeout: 5000 });

// ✅ Wait for right condition
await page.waitForLoadState('networkidle'); // Not 'load'
```

### Type error in test

**Cause**: Missing type annotation or wrong type

**Solution**:

```typescript
// ✅ Use type from interface
const { data: user } = await apiHelper.get<User>('/users/1');

// ✅ Add types to variables
const username: string = 'john@example.com';
const userId: number = 123;
```

---

## 📚 When in Doubt

1. **Check existing patterns** - Look for similar tests
2. **Read the code** - Open LoginPage, DashboardPage, etc.
3. **Read the docs** - Reference guides in project
4. **Run debug mode** - `npm test:debug`
5. **Add console.log** - Log what you're testing
6. **Take screenshot** - Visual inspection
7. **Ask a team member** - Pair programming or code review

---

Good luck! 🎯
