# Contributing to the Playwright Automation Framework

Thank you for contributing to this project! This document outlines guidelines for development, test authoring, code quality, and submitting pull requests.

---

## 🚀 Getting Started

### 1. Fork and Clone

```bash
git clone https://github.com/your-username/playwright-framework.git
cd playwright-framework
```

### 2. Branching Strategy

Create a feature branch from `develop` (or `main` depending on release flow):

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 3. Install Dependencies & Browsers

```bash
npm install
npx playwright install --with-deps chromium
```

### 4. Setup Environment

Copy `.env.example` to `.env` and configure local credentials:

```bash
cp .env.example .env
```

---

## 📋 Architecture & Development Workflow

The framework is a **multi-application** test automation architecture supporting SauceDemo, CURA Healthcare, OrangeHRM, and shared API services.

### Core Architectural Layers

1. **Page Objects (`src/pages/apps/{app}/pages/`)**:
   - Every page object extends `BasePage` from `src/pages/base/BasePage.ts`.
   - Never hardcode element selectors in test files.
   - Follow locator priority: `getByTestId` > `getByRole` > `getByPlaceholder` > `getByText` > `locator('css')`.
2. **App Facades (`src/apps/{app}/{App}App.ts`)**:
   - Each app provides a facade (`SauceDemoApp`, `CuraApp`, `OrangeHrmApp`) that encapsulates page objects and provides high-level composite workflows (e.g. `login()`, `bookAppointment()`).
3. **Fixtures (`src/core/fixtures/`)**:
   - **`test.fixture.ts`**: Use for tests requiring an unauthenticated browser context (e.g., negative login validation, public landing page checks).
   - **`auth.fixture.ts`**: Use for tests requiring an authenticated session. Reuses saved session cookies from `storage-state/{app}.json` or logs in automatically.
4. **Test Suites (`tests/{app}/{suite-type}/`)**:
   - Tests are strictly organized by application and suite type:
     - `01-auth/`: Credential boundary and error validation tests.
     - `smoke/`: Fast happy-path confidence checks.
     - `regression/`: Complete end-to-end workflows.
     - `04-accessibility-testing/`: Axe-core accessibility audits.
     - `05-performance-testing/`: Navigation timing and performance benchmarks.
     - `06-visual-regression/`: Pixel-diff screenshot comparisons.
   - Shared cross-app tests live under `tests/shared/auth` and `tests/shared/api`.
   - Reusable reference templates live under `tests/templates/` with `*.template.ts` extensions.

---

## 🧪 Testing Guidelines

### Running Tests

#### NPM Scripts (`package.json`)

```bash
# Run all active tests across all projects
npm test

# Run tests matching smoke tag
npm run test:smoke

# Interactive UI mode (Playwright Test Runner)
npm run test:ui

# Interactive debug mode (Playwright Inspector)
npm run test:debug

# Run tests in headed browser
npm run test:headed

# Run with specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# View HTML report
npm run test:report
```

#### Granular App-Suite Runner (`scripts/run-app-suite.cjs`)

When working on a specific application, use the custom runner to target that suite with dedicated reports:

```bash
# Syntax: node scripts/run-app-suite.cjs --app=<app> --suite=<suite> [--project=<browser>]

# SauceDemo suites
node scripts/run-app-suite.cjs --app=saucedemo --suite=smoke
node scripts/run-app-suite.cjs --app=saucedemo --suite=auth
node scripts/run-app-suite.cjs --app=saucedemo --suite=regression

# CURA suites
node scripts/run-app-suite.cjs --app=cura --suite=smoke
node scripts/run-app-suite.cjs --app=cura --suite=regression

# OrangeHRM suites
node scripts/run-app-suite.cjs --app=orangehrm --suite=smoke
node scripts/run-app-suite.cjs --app=orangehrm --suite=regression

# Shared API suites
node scripts/run-app-suite.cjs --app=local --suite=shared-api
```

#### Updating Visual Baselines

```bash
# Update visual snapshots for a specific app
node scripts/run-app-suite.cjs --app=saucedemo --suite=visual -u
node scripts/run-app-suite.cjs --app=cura --suite=visual -u
node scripts/run-app-suite.cjs --app=orangehrm --suite=visual -u
```

---

## ✍️ Authoring Page Objects & Tests

### Example: Writing a Page Object

```typescript
// src/pages/apps/saucedemo/pages/SauceDemoLoginPage.ts
import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../../../base/BasePage';
import { AppName } from '../../../../config/app.config';

export class SauceDemoLoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    super(page, 'saucedemo' as AppName);
    this.usernameInput = this.page.locator('#user-name');
    this.passwordInput = this.page.locator('#password');
    this.loginButton = this.page.locator('#login-button');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.appConfig.baseUrl);
    await this.waitForPageLoad();
    await expect(this.usernameInput).toBeVisible();
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

### Example: Writing a Smoke Test using App Facade

```typescript
// tests/saucedemo/smoke/app-smoke.spec.ts
import { test, expect } from '../../../src/core/fixtures/test.fixture';

test('@smoke @saucedemo - login page shell renders correctly', async ({ saucedemoApp }) => {
  await saucedemoApp.goto();

  await expect(saucedemoApp.loginPage.getPage()).toHaveTitle(/swag labs/i);
  await expect(
    saucedemoApp.loginPage.getPage().getByText(/accepted usernames are:/i),
  ).toBeVisible();
});
```

### Example: Writing an Authenticated Flow

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

---

## 📝 Code Style & Quality Gates

All contributions must strictly adhere to the project quality gates:

### Local Verification

```bash
# TypeScript type check (strict mode)
npm run typecheck

# ESLint inspection
npm run lint

# Auto-fix lint issues
npm run lint:fix

# Prettier format check
npm run format:check

# Auto-format files
npm run format

# Pre-push combined check
npm run pre-push
```

### Conventions

- **Naming**:
  - Page Classes: `SauceDemoLoginPage`, `CuraAppointmentPage` (PascalCase with app prefix).
  - Facades: `SauceDemoApp`, `CuraApp`, `OrangeHrmApp` (PascalCase).
  - Test specs: `login-data-driven.spec.ts`, `add-to-cart.spec.ts` (kebab-case).
  - Methods: `login()`, `bookAppointment()`, `verifyInventoryLoaded()` (camelCase).
- **TypeScript**: Strict mode enabled. Do not use `any` without documented necessity.
- **Flakiness Prevention**:
  - Never use hardcoded sleeps like `page.waitForTimeout()`.
  - Always use web-first assertions: `await expect(locator).toBeVisible()`.
  - Use `waitForNetworkStable()` or `flakeHelper` utilities for complex asynchronous transitions.

---

## 🔀 Git Workflow & Commit Guidelines

### Conventional Commits

Commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <short description>

[optional body]
[optional footer]
```

**Allowed Types:**

- `feat:` New test feature, page object, or utility
- `fix:` Bug fix in test logic, locator, or framework
- `refactor:` Code refactoring without behavioral change
- `test:` Test additions, adjustments, or baseline refreshes
- `docs:` Documentation updates
- `ci:` Pipeline, workflow, or Docker changes
- `chore:` Dependency or tooling updates

**Examples:**

- `feat(cura): add appointment confirmation verification`
- `fix(saucedemo): update cart item locator for responsive view`
- `docs(contributing): update multi-app contribution guidelines`

### Pre-Commit Hooks

Husky and `lint-staged` automatically run ESLint and Prettier on staged files. Commits will be rejected if checks fail.

---

## 📋 Pull Request Checklist

Before submitting your PR, verify the following:

- [ ] Branch created from latest `develop` or `main`.
- [ ] `npm run typecheck` passes with zero errors.
- [ ] `npm run lint` passes cleanly.
- [ ] `npm run format:check` passes.
- [ ] Targeted app suites pass via `node scripts/run-app-suite.cjs --app=<app> --suite=<suite>`.
- [ ] Page objects extend `src/pages/base/BasePage.ts`.
- [ ] Selectors follow resilient priority order (no fragile XPath/CSS locators).
- [ ] No hardcoded sleeps (`page.waitForTimeout`), credentials, or `.env` files committed.
- [ ] Commit messages follow conventional commit format.
- [ ] Documentation updated to reflect changes.

See [`docs/CODE_REVIEW.md`](https://github.com/prasad291024/playwright-automation-framework/blob/main/docs/CODE_REVIEW.md) for reviewer criteria.
