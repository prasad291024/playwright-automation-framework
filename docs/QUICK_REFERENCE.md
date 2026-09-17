# Playwright Framework - Quick Reference & Cheat Sheet

Your rapid copy-paste reference guide for commands, patterns, assertions, and utilities across the multi-app framework.

---

## 1. Quick Start Commands

### General NPM Scripts (`package.json`)

```bash
npm test                  # Run all active tests across all configured projects
npm run test:smoke        # Run tests tagged with @smoke
npm run test:ui           # Launch interactive UI mode with time-travel debugging
npm run test:debug        # Run with Playwright Inspector attached
npm run test:headed       # Run tests with visible browser windows
npm run test:report       # Open the HTML test report
npm run test:chromium     # Run only Chromium browser project
npm run test:firefox      # Run only Firefox browser project
npm run test:webkit       # Run only WebKit (Safari) browser project
```

### Granular App-Suite Runner (`scripts/run-app-suite.cjs`)

```bash
# Syntax: node scripts/run-app-suite.cjs --app=<app> --suite=<suite> [--project=<browser>]

# SauceDemo suites
node scripts/run-app-suite.cjs --app=saucedemo --suite=smoke
node scripts/run-app-suite.cjs --app=saucedemo --suite=auth
node scripts/run-app-suite.cjs --app=saucedemo --suite=regression
node scripts/run-app-suite.cjs --app=saucedemo --suite=accessibility
node scripts/run-app-suite.cjs --app=saucedemo --suite=performance
node scripts/run-app-suite.cjs --app=saucedemo --suite=visual

# CURA Healthcare suites
node scripts/run-app-suite.cjs --app=cura --suite=smoke
node scripts/run-app-suite.cjs --app=cura --suite=regression

# OrangeHRM suites
node scripts/run-app-suite.cjs --app=orangehrm --suite=smoke
node scripts/run-app-suite.cjs --app=orangehrm --suite=regression

# Shared API suites
node scripts/run-app-suite.cjs --app=local --suite=shared-api
```

### Snapshot Baseline Updates

```bash
node scripts/run-app-suite.cjs --app=saucedemo --suite=visual -u
node scripts/run-app-suite.cjs --app=cura --suite=visual -u
node scripts/run-app-suite.cjs --app=orangehrm --suite=visual -u
```

### Code Quality & Git Hooks

```bash
npm run typecheck         # TypeScript strict compilation check (tsc --noEmit)
npm run lint              # ESLint inspection
npm run lint:fix          # ESLint auto-fix
npm run format:check      # Prettier formatting verification
npm run format            # Prettier auto-formatting
npm run pre-push          # Combined pre-push quality check
```

---

## 2. Test Authoring Patterns

### Pattern A: Smoke Test with App Facade (`test.fixture.ts`)

```typescript
// tests/saucedemo/smoke/app-smoke.spec.ts
import { test, expect } from '../../../src/core/fixtures/test.fixture';

test('@smoke @saucedemo - login shell renders correctly', async ({ saucedemoApp }) => {
  await saucedemoApp.goto();

  await expect(saucedemoApp.loginPage.getPage()).toHaveTitle(/swag labs/i);
  await expect(
    saucedemoApp.loginPage.getPage().getByText(/accepted usernames are:/i),
  ).toBeVisible();
});
```

### Pattern B: Authenticated Test with Session Reuse (`auth.fixture.ts`)

```typescript
// tests/saucedemo/smoke/login.spec.ts
import { test } from '../../../src/core/fixtures/auth.fixture';

test('@smoke @saucedemo - user can login successfully', async ({
  authenticatedPage,
  saucedemoApp,
  appName,
}) => {
  if (appName !== 'saucedemo' || !saucedemoApp) {
    test.skip();
    return;
  }

  await authenticatedPage.waitForURL(/.*inventory.*/);
  await saucedemoApp.inventoryPage.verifyInventoryLoaded();
});
```

### Pattern C: Data-Driven Login Validation (`01-auth`)

```typescript
// tests/saucedemo/01-auth/login-data-driven.spec.ts
import { test } from '../../../src/core/fixtures/test.fixture';
import { users } from '../../../src/apps/saucedemo/test-data/users';

test.use({ storageState: { cookies: [], origins: [] } }); // Isolate from stored cookies

const scenarios = [
  { name: 'invalid password', username: users.standard_user.username, password: 'wrong_password' },
  {
    name: 'locked out user',
    username: users.locked_out_user.username,
    password: users.locked_out_user.password,
  },
];

test.describe('Login Validation', () => {
  for (const scenario of scenarios) {
    test(`fails for ${scenario.name}`, async ({ saucedemoApp }) => {
      await saucedemoApp.loginPage.goto();
      await saucedemoApp.loginPage.login(scenario.username, scenario.password);
      await saucedemoApp.loginPage.assertLoginFailure();
    });
  }
});
```

### Pattern D: API Contract Testing with JSON Schema Validation

```typescript
// tests/shared/api/user-api.spec.ts
import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../../src/utils/apiHelper';
import { schemaValidator } from '../../../src/utils/schemaValidator';

test('GET /api/users/2 validates schema', async ({ request }) => {
  const api = new ApiHelper(request, 'https://reqres.in');
  const response = await api.get('/api/users/2', 'user.schema.json');

  expect(response.status).toBe(200);
  schemaValidator.validateOrThrow(response.data, 'user.schema.json');
});
```

---

## 3. Creating Page Objects & App Facades

### Step 1: Create Page Object

Extend `BasePage` from `src/pages/base/BasePage.ts`:

```typescript
// src/pages/apps/saucedemo/pages/SauceDemoInventoryPage.ts
import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../../../base/BasePage';
import { AppName } from '../../../../config/app.config';

export class SauceDemoInventoryPage extends BasePage {
  private readonly inventoryList: Locator;
  private readonly firstAddToCartBtn: Locator;

  constructor(page: Page) {
    super(page, 'saucedemo' as AppName);
    this.inventoryList = this.page.locator('.inventory_list');
    this.firstAddToCartBtn = this.page.locator('.inventory_item button').first();
  }

  async goto(): Promise<void> {
    await this.page.goto(`${this.appConfig.baseUrl}/inventory.html`);
    await this.waitForPageLoad();
  }

  async addFirstProductToCart(): Promise<void> {
    await this.firstAddToCartBtn.click();
  }

  async verifyInventoryLoaded(): Promise<void> {
    await expect(this.inventoryList).toBeVisible();
  }
}
```

### Step 2: Wire Page into App Facade

```typescript
// src/apps/saucedemo/SauceDemoApp.ts
import { Page } from '@playwright/test';
import { SauceDemoLoginPage } from '../../pages/apps/saucedemo/pages/SauceDemoLoginPage';
import { SauceDemoInventoryPage } from '../../pages/apps/saucedemo/pages/SauceDemoInventoryPage';

export class SauceDemoApp {
  readonly loginPage: SauceDemoLoginPage;
  readonly inventoryPage: SauceDemoInventoryPage;

  constructor(private readonly page: Page) {
    this.loginPage = new SauceDemoLoginPage(page);
    this.inventoryPage = new SauceDemoInventoryPage(page);
  }

  async goto(): Promise<void> {
    await this.loginPage.goto();
  }
}
```

---

## 4. Selector Priority Cheat Sheet

```typescript
// 1️⃣ BEST: data-testid (resilient, immune to redesigns)
await page.getByTestId('submit-order').click();

// 2️⃣ EXCELLENT: ARIA Role (accessible, reflects user intent)
await page.getByRole('button', { name: /checkout|submit/i }).click();
await page.getByRole('textbox', { name: /username/i }).fill('admin');

// 3️⃣ GOOD: Placeholder
await page.getByPlaceholder('Enter your password').fill('secret');

// 4️⃣ GOOD: Visible Text
await page.getByText('Thank you for your order!').click();

// 5️⃣ LAST RESORT: Scoped CSS (never use absolute XPath)
await page.locator('.cart_item .item_price').first();
```

---

## 5. Common Web-First Assertions

```typescript
// Visibility
await expect(locator).toBeVisible();
await expect(locator).toBeHidden();

// Text Content
await expect(locator).toHaveText('Exact String');
await expect(locator).toContainText(/substring|regex/i);

// State
await expect(locator).toBeEnabled();
await expect(locator).toBeDisabled();
await expect(locator).toBeChecked();

// Input Values
await expect(locator).toHaveValue('admin123');

// Element Counts
await expect(page.locator('.cart_item')).toHaveCount(3);

// Page Properties
await expect(page).toHaveURL(/.*inventory\.html/);
await expect(page).toHaveTitle(/Swag Labs/i);
```

---

## 6. Flakiness Reduction Helpers (`src/utils/flakeHelper.ts`)

```typescript
import {
  stableClick,
  stableFill,
  resilientType,
  findElement,
  expectWithRetry,
} from '../../src/utils/flakeHelper';

// Stable Click: Retries if element detaches during click
await stableClick(page.getByRole('button', { name: 'Submit' }));

// Stable Fill: Verifies input value after filling
await stableFill(page.getByPlaceholder('Email'), 'user@test.com');

// Resilient Type: Slower character-by-character typing for masked inputs
await resilientType(page.getByPlaceholder('Date'), '30/11/2026', { delayBetweenCharsMs: 50 });

// Multiple Selector Fallback: Returns first matching locator
const btn = await findElement(page, [
  page.getByTestId('login-btn'),
  page.getByRole('button', { name: 'Log In' }),
  '#login-button',
]);
await btn.click();

// Expect with Retry: Polling dynamic content
await expectWithRetry(
  async () => {
    await expect(page.locator('.badge')).toHaveText('1');
  },
  { maxAttempts: 4, delayMs: 500 },
);
```

---

## 7. File Organization Quick Map

```
src/
├── apps/{app}/                  # App Facades ({App}App.ts) & test-data/users.ts
├── pages/apps/{app}/pages/      # App Page Objects extending BasePage
├── pages/base/BasePage.ts       # Multi-app BasePage (AppRegistry + flakeHelper)
├── core/fixtures/               # test.fixture.ts (clean) & auth.fixture.ts (session)
├── core/auth/auth-session.ts    # Session token & storage state manager
├── core/utils/                  # logger.ts, randomUtils.ts, waitUtils.ts
├── utils/                       # flakeHelper.ts, apiHelper.ts, schemaValidator.ts
└── config/                      # app.config.ts (AppRegistry) & static configs

tests/
├── {app}/                       # 6 suites: 01-auth, smoke, regression, a11y, perf, visual
├── shared/                      # auth/, api/
└── templates/                   # *.template.ts (quarantined)

config/
├── apps.json                    # Declarative app URLs & timeouts
└── test-suites.json             # Suite runner path mappings

storage-state/
└── {app}.json                   # Saved session states
```
