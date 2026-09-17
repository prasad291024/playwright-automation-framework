# Developer Onboarding & Framework Learning Guide

Welcome to the Playwright UI Automation Framework! This guide is designed to take you from a fresh clone to authoring production-grade automated tests across multiple applications.

---

## Table of Contents

1. [Choose Your Onboarding Track](#1-choose-your-onboarding-track)
2. [Local Environment Setup](#2-local-environment-setup)
3. [Architecture & Design Principles](#3-architecture--design-principles)
4. [Step-by-Step Hands-On Tutorials](#4-step-by-step-hands-on-tutorials)
   - [Tutorial 1: Running Your First Test Suite](#tutorial-1-running-your-first-test-suite)
   - [Tutorial 2: Authoring a Smoke Test with an App Facade](#tutorial-2-authoring-a-smoke-test-with-an-app-facade)
   - [Tutorial 3: Creating an App Page Object](#tutorial-3-creating-an-app-page-object)
   - [Tutorial 4: Writing an API Test with JSON Schema Validation](#tutorial-4-writing-an-api-test-with-json-schema-validation)
5. [Interactive Learning Checklist (Progress Tracker)](#5-interactive-learning-checklist-progress-tracker)
6. [Essential Commands Reference](#6-essential-commands-reference)
7. [Troubleshooting & Common FAQs](#7-troubleshooting--common-faqs)

---

## 1. Choose Your Onboarding Track

Depending on your role and immediate objective, pick one of three pathways:

### 🟢 Track A: Quick Start (First Test in 10 Minutes)

_Goal: Get the repo running, execute existing tests, and view reports._

1. Complete [Section 2: Local Environment Setup](#2-local-environment-setup).
2. Follow [Tutorial 1: Running Your First Test Suite](#tutorial-1-running-your-first-test-suite).
3. Review [Section 6: Essential Commands Reference](#6-essential-commands-reference).

### 🔵 Track B: Test Automation Engineer (Writing & Maintaining Tests)

_Goal: Author new tests, add page objects, and master fixtures._

1. Complete Track A.
2. Read [Section 3: Architecture & Design Principles](#3-architecture--design-principles).
3. Work through [Tutorials 2, 3, and 4](#4-step-by-step-hands-on-tutorials).
4. Track your progress with [Section 5: Interactive Learning Checklist](#5-interactive-learning-checklist-progress-tracker).
5. Read [`docs/CONTRIBUTING.md`](CONTRIBUTING.md) and [`docs/CODE_REVIEW.md`](CODE_REVIEW.md).

### 🟣 Track C: Senior SDET / DevOps (Pipelines, Infrastructure & Scalability)

_Goal: Understand CI matrix execution, Docker, session management, and quality gates._

1. Complete Track B.
2. Review [`docs/FRAMEWORK_GUIDE.md`](FRAMEWORK_GUIDE.md) and [`docs/TEST_STRATEGY.md`](TEST_STRATEGY.md).
3. Review [`docs/DEPLOYMENT.md`](DEPLOYMENT.md) and [`docs/PRODUCTION_READINESS.md`](PRODUCTION_READINESS.md).
4. Inspect [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) and [`Jenkinsfile.docker`](../Jenkinsfile.docker).

---

## 2. Local Environment Setup

### Prerequisites

- **Node.js**: 20.x or higher
- **npm**: 10.x or higher
- **Git**: 2.30+

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/playwright-framework.git
cd playwright-framework
```

### 2. Install Project Dependencies

```bash
npm ci
```

### 3. Install Playwright Browsers & OS Dependencies

```bash
npx playwright install --with-deps chromium
```

### 4. Create Local Environment Configuration

```bash
cp .env.example .env
```

_(The default credentials in `.env.example` are preconfigured for the public demo apps: SauceDemo, CURA Healthcare, and OrangeHRM)._

### 5. Verify Tooling & Quality Gates

```bash
# Verify TypeScript strict compilation
npm run typecheck

# Verify ESLint rules
npm run lint

# Verify Prettier formatting
npm run format:check
```

If all three commands exit with code 0, your environment is ready!

---

## 3. Architecture & Design Principles

### The Multi-App Strategy

The framework supports independent applications within a single repository:

- **SauceDemo**: E-commerce catalog, shopping cart, item checkout.
- **CURA Healthcare**: Appointment scheduling, healthcare facility workflows.
- **OrangeHRM**: HRMS administration and employee directory.
- **Shared**: Common API contracts and cross-application session verification.

### Core Architectural Layers

```
┌─────────────────────────────────────────────────────────┐
│                    Test Specifications                  │
│       tests/saucedemo/   tests/cura/   tests/orangehrm/ │
└────────────────────────────┬────────────────────────────┘
                             │ imports
┌────────────────────────────▼────────────────────────────┐
│                    Dual Fixture System                  │
│  test.fixture.ts (clean)     auth.fixture.ts (session)  │
└────────────────────────────┬────────────────────────────┘
                             │ provides
┌────────────────────────────▼────────────────────────────┐
│                     App Facades                         │
│   src/apps/saucedemo/        src/apps/cura/             │
│   SauceDemoApp.ts            CuraApp.ts                 │
└────────────────────────────┬────────────────────────────┘
                             │ coordinates
┌────────────────────────────▼────────────────────────────┐
│                App-Specific Page Objects                │
│             src/pages/apps/{app}/pages/                 │
└────────────────────────────┬────────────────────────────┘
                             │ extends
┌────────────────────────────▼────────────────────────────┐
│                        BasePage                         │
│               src/pages/base/BasePage.ts                │
│    (AppRegistry, timeouts, anti-flake stabilization)   │
└─────────────────────────────────────────────────────────┘
```

### Key Framework Patterns

1. **App Facades (`src/apps/{app}/`)**: High-level application classes (e.g. `SauceDemoApp`, `CuraApp`, `OrangeHrmApp`) unify page objects so tests remain concise and readable.
2. **App-Specific Page Objects (`src/pages/apps/{app}/pages/`)**: Isolated page models extending `BasePage`.
3. **Resilient Locator Priority**:
   `data-testid` > ARIA Roles (`getByRole`) > Placeholder (`getByPlaceholder`) > Text (`getByText`) > CSS fallback.
4. **Dual Fixture System**:
   - `test.fixture.ts`: Clean unauthenticated contexts for negative login checks and public page validation.
   - `auth.fixture.ts`: Session-reused contexts leveraging cached storage states in `storage-state/{app}.json`.
5. **Suite Runner (`scripts/run-app-suite.cjs`)**: Orchestrates granular suite execution with partitioned reporting.

---

## 4. Step-by-Step Hands-On Tutorials

### Tutorial 1: Running Your First Test Suite

#### 1. Run the SauceDemo Smoke Suite

Execute the dedicated app-suite runner:

```bash
node scripts/run-app-suite.cjs --app=saucedemo --suite=smoke
```

You will see console output summarizing the test path, JSON report, JUnit report, and HTML report location.

#### 2. Run with the Interactive UI Runner

Explore tests visually with time-travel debugging:

```bash
npm run test:ui
```

#### 3. View the Generated HTML Report

```bash
npm run test:report
```

---

### Tutorial 2: Authoring a Smoke Test with an App Facade

Create a test using the unauthenticated `test.fixture.ts`:

```typescript
// tests/saucedemo/smoke/example-smoke.spec.ts
import { test, expect } from '../../../src/core/fixtures/test.fixture';

test('@smoke @saucedemo - login shell renders correctly', async ({ saucedemoApp }) => {
  // 1. Navigate via App Facade
  await saucedemoApp.goto();

  // 2. Assert page properties using web-first matchers
  await expect(saucedemoApp.loginPage.getPage()).toHaveTitle(/swag labs/i);
  await expect(
    saucedemoApp.loginPage.getPage().getByText(/accepted usernames are:/i),
  ).toBeVisible();
});
```

---

### Tutorial 3: Creating an App Page Object

When adding a new page, extend `BasePage` from `src/pages/base/BasePage.ts`:

```typescript
// src/pages/apps/saucedemo/pages/SauceDemoProductDetailsPage.ts
import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../../../base/BasePage';
import { AppName } from '../../../../config/app.config';

export class SauceDemoProductDetailsPage extends BasePage {
  private readonly backToProductsButton: Locator;
  private readonly addToCartButton: Locator;
  private readonly productName: Locator;

  constructor(page: Page) {
    super(page, 'saucedemo' as AppName);
    this.backToProductsButton = this.page.getByTestId('back-to-products');
    this.addToCartButton = this.page.getByRole('button', { name: /add to cart/i });
    this.productName = this.page.locator('.inventory_details_name');
  }

  async goto(): Promise<void> {
    await this.page.goto(`${this.appConfig.baseUrl}/inventory-item.html?id=4`);
    await this.waitForPageLoad();
  }

  async clickBack(): Promise<void> {
    await this.backToProductsButton.click();
  }

  async addProductToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async assertProductLoaded(expectedName: string): Promise<void> {
    await expect(this.productName).toContainText(expectedName);
  }
}
```

---

### Tutorial 4: Writing an API Test with JSON Schema Validation

The framework pairs Playwright API testing with AJV JSON Schema validation:

```typescript
// tests/shared/api/example-api.spec.ts
import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../../src/utils/apiHelper';
import { schemaValidator } from '../../../src/utils/schemaValidator';

test.describe('Users API Contract Validation', () => {
  let api: ApiHelper;

  test.beforeEach(async ({ request }) => {
    api = new ApiHelper(request, 'https://reqres.in');
  });

  test('@api - GET /api/users/2 complies with user schema', async () => {
    const response = await api.get('/api/users/2', 'user.schema.json');
    expect(response.status).toBe(200);

    // Validates response against schemas/user.schema.json
    const isValid = schemaValidator.validate(response.data, 'user.schema.json');
    expect(isValid).toBeTruthy();
  });
});
```

---

## 5. Interactive Learning Checklist (Progress Tracker)

Use this checklist to self-evaluate your mastery of the framework:

### Level 1: Foundations & Tooling

- [ ] Understand the role of Playwright, TypeScript strict mode, and Prettier.
- [ ] Successfully ran `npm run typecheck`, `npm run lint`, and `npm run format:check`.
- [ ] Can run tests in headless mode (`npm test`) and headed mode (`npm run test:headed`).
- [ ] Know how to launch the Playwright UI mode (`npm run test:ui`).

### Level 2: Project Layout & Navigation

- [ ] Understand the role of `src/apps/{app}/` vs `src/pages/apps/{app}/pages/`.
- [ ] Know the difference between `test.fixture.ts` and `auth.fixture.ts`.
- [ ] Understand where test credentials live (`src/apps/{app}/test-data/users.ts`).
- [ ] Understand how `config/apps.json` and `config/test-suites.json` map apps to paths.

### Level 3: Authoring UI Tests & Page Objects

- [ ] Can write a new page object extending `src/pages/base/BasePage.ts`.
- [ ] Apply locator priority (`data-testid` > role > placeholder > text > CSS).
- [ ] Know how to use web-first assertions (`await expect(locator).toBeVisible()`).
- [ ] Understand why hardcoded sleeps (`page.waitForTimeout`) are forbidden.

### Level 4: Session Reuse & Storage States

- [ ] Know where storage states are saved (`storage-state/{app}.json`).
- [ ] Can run authenticated tests with `auth.fixture.ts`.
- [ ] Can isolate negative login tests with `test.use({ storageState: { cookies: [], origins: [] } })`.
- [ ] Know how to run `scripts/prepare-storage-states.ts` to regenerate expired sessions.

### Level 5: API Contract Testing

- [ ] Can make typed REST calls using `ApiHelper`.
- [ ] Understand JSON schemas in `schemas/` directory.
- [ ] Know how to validate response contracts using `schemaValidator.validateOrThrow()`.

### Level 6: CI/CD, Containerization & Git Quality Gates

- [ ] Understand the PR smoke scope vs. Full push scope in `.github/workflows/ci.yml`.
- [ ] Understand how Jenkins runs containerized builds using `Jenkinsfile.docker`.
- [ ] Know how to run tests locally in Docker via `docker compose run test`.
- [ ] Comply with Husky pre-commit hooks and conventional commit messages.

---

## 6. Essential Commands Reference

### General Testing (`package.json`)

```bash
npm test                  # Run all active tests across all projects
npm run test:headed       # Run tests with visible browser window
npm run test:debug        # Run with Playwright Inspector attached
npm run test:ui           # Launch visual UI mode runner
npm run test:smoke        # Run tests tagged with @smoke
npm run test:report       # Open HTML report from last test run
npm run test:chromium     # Run only Chromium project
```

### Granular App-Suite Execution (`scripts/run-app-suite.cjs`)

```bash
# SauceDemo suites
node scripts/run-app-suite.cjs --app=saucedemo --suite=smoke
node scripts/run-app-suite.cjs --app=saucedemo --suite=auth
node scripts/run-app-suite.cjs --app=saucedemo --suite=regression
node scripts/run-app-suite.cjs --app=saucedemo --suite=accessibility

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

### Code Quality & Formatting

```bash
npm run typecheck         # Validate TypeScript types without emitting code
npm run lint              # Inspect code for ESLint errors
npm run lint:fix          # Auto-fix linting issues
npm run format            # Reformat all files with Prettier
npm run format:check      # Check Prettier formatting without modifying files
npm run pre-push          # Combined lint and typecheck check
```

---

## 7. Troubleshooting & Common FAQs

### Q1: My test fails because the storage state session expired or is invalid.

**Fix**: Delete the local session file or run the storage state generator:

```bash
# Delete and regenerate
rm storage-state/saucedemo.json
npx ts-node scripts/prepare-storage-states.ts
```

To run tests while completely bypassing the auth bootstrap layer:

```bash
# Unix:
SKIP_GLOBAL_AUTH_SETUP=1 node scripts/run-app-suite.cjs --app=cura --suite=smoke

# PowerShell:
$env:SKIP_GLOBAL_AUTH_SETUP='1'; node scripts/run-app-suite.cjs --app=cura --suite=smoke
```

### Q2: An element takes time to appear. Should I use `page.waitForTimeout()`?

**Fix**: No. `waitForTimeout()` creates brittle, slow tests. Instead:

- Use auto-retrying assertions: `await expect(locator).toBeVisible({ timeout: 10000 });`
- Use dynamic element wait: `await locator.waitFor({ state: 'visible' });`
- Use network stabilization: `await waitForNetworkStable(page);` from `src/core/utils/waitUtils.ts`.

### Q3: Why is my visual regression test failing in CI but passing locally?

**Fix**: Anti-aliasing and font-rendering vary between operating systems (Ubuntu in CI vs. Windows/macOS locally). To generate consistent baselines:

- Generate baselines inside the Docker container:
  ```bash
  docker compose run test node scripts/run-app-suite.cjs --app=saucedemo --suite=visual -u
  ```

---

## Further Reading

- [`docs/FRAMEWORK_GUIDE.md`](FRAMEWORK_GUIDE.md): Complete architecture manual.
- [`docs/TEST_STRATEGY.md`](TEST_STRATEGY.md): Suite ownership rules and CI execution policy.
- [`docs/CONTRIBUTING.md`](CONTRIBUTING.md): PR workflow and developer guidelines.
- [`docs/CODE_REVIEW.md`](CODE_REVIEW.md): Code review checklist.
- [`docs/DEPLOYMENT.md`](DEPLOYMENT.md): Deployment and pipeline setup.
