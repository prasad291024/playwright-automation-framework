# Playwright UI Automation Framework - Complete Guide

This document is the comprehensive, consolidated guide to the Playwright UI Automation Framework. It brings together framework architecture, design patterns, multi-app support, test execution, fixtures, utilities, and CI/CD integration into a single source of truth.

---

## Table of Contents

1. [Overview & Architecture](#1-overview--architecture)
2. [Documentation Map](#2-documentation-map)
3. [Project Structure & File Layout](#3-project-structure--file-layout)
4. [Configuration & Multi-App Registry](#4-configuration--multi-app-registry)
5. [Page Object Model & App Facades](#5-page-object-model--app-facades)
6. [Fixtures & Authentication Architecture](#6-fixtures--authentication-architecture)
7. [Core Utilities & Helpers](#7-core-utilities--helpers)
8. [Test Organization & Execution Guide](#8-test-organization--execution-guide)
9. [Real-World Test Implementation Examples](#9-real-world-test-implementation-examples)
10. [CI/CD & Containerization](#10-cicd--containerization)
11. [Best Practices, Flakiness Reduction & Quality Gates](#11-best-practices-flakiness-reduction--quality-gates)
12. [Extending the Framework (Adding Apps & Pages)](#12-extending-the-framework-adding-apps--pages)

---

## 1. Overview & Architecture

This repository contains an enterprise-grade, multi-application UI and API automation framework built on [Playwright](https://playwright.dev/) and TypeScript. It is designed to scale across multiple web properties with clean domain separation, high test resilience, and minimal flakiness.

### Key Capabilities

- **Multi-Application Support**: Native support for independent applications:
  - **SauceDemo**: E-commerce catalog, shopping cart, and login validation.
  - **CURA Healthcare**: Appointment scheduling, healthcare facility workflows, and authentication.
  - **OrangeHRM**: Enterprise HRMS dashboard navigation and user management.
  - **Local/Shared**: Shared API contract validation and session verification.
- **App Facade Pattern**: High-level application facade classes (`SauceDemoApp`, `CuraApp`, `OrangeHrmApp`) wrap individual page objects to provide simplified, expressive test workflows.
- **Resilient Page Object Model**: Base classes incorporate automatic network stabilization, retry logic, and strict locator priority (`data-testid` > ARIA roles > placeholders > visible text > CSS fallback).
- **Hybrid Authentication & Session Reuse**: Tests leverage storage states (`storage-state/{app}.json`) to bypass repetitive UI logins while maintaining isolated negative-path auth coverage.
- **API Testing with Schema Validation**: Integrated AJV-based JSON Schema validation for robust API contract testing alongside UI journeys.
- **Orchestrated Suite Execution**: A custom suite runner (`scripts/run-app-suite.cjs`) coordinates granular test execution across apps, environments, and suite types with app-segmented reporting.
- **Strict Code Quality Gates**: TypeScript in strict mode, ESLint (`@typescript-eslint`, `eslint-plugin-playwright`), Prettier, and Husky pre-commit hooks.

---

## 2. Documentation Map

All project documentation lives in the `docs/` directory:

| Document                                                                    | Purpose                                                                                          |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| [`docs/FRAMEWORK_GUIDE.md`](./FRAMEWORK_GUIDE.md)                           | **This document**: Comprehensive architectural reference, design patterns, and operational guide |
| [`docs/ONBOARDING.md`](./ONBOARDING.md)                                     | Developer onboarding guide, role pathways, tutorials, and interactive learning checklist         |
| [`docs/README.md`](./README.md)                                             | Test suite structure overview, active vs. template suite mapping, and reporting conventions      |
| [`docs/TEST_STRATEGY.md`](./TEST_STRATEGY.md)                               | Test strategy, CI matrix scope (smoke vs. full), suite ownership rules, and quality gates        |
| [`docs/ARCHITECTURE_VISUAL_GUIDE.md`](./ARCHITECTURE_VISUAL_GUIDE.md)       | High-level visual diagrams: execution flow, component relationships, and storage state flow      |
| [`docs/PRODUCTION_FRAMEWORK_SUMMARY.md`](./PRODUCTION_FRAMEWORK_SUMMARY.md) | Executive summary of implemented components, supported applications, and capabilities            |
| [`docs/STRUCTURE_REFACTORING.md`](./STRUCTURE_REFACTORING.md)               | Architectural refactoring completion report detailing multi-app folder migration                 |
| [`docs/PRODUCTION_READINESS.md`](./PRODUCTION_READINESS.md)                 | Readiness audit checklist for production execution                                               |
| [`docs/FLAKINESS_REDUCTION.md`](./FLAKINESS_REDUCTION.md)                   | Strategies, timing controls, and locator patterns to eliminate test flakiness                    |
| [`docs/playwright-best-practices.md`](./playwright-best-practices.md)       | Playwright-specific coding standards and patterns                                                |
| [`docs/QUALITY_GATES.md`](./QUALITY_GATES.md)                               | Pre-commit hooks, CI gates, and pull request verification rules                                  |
| [`docs/DEPLOYMENT.md`](./DEPLOYMENT.md)                                     | Pipeline deployment, containerized execution, and environment setup                              |
| [`docs/docker-desktop-guide.md`](./docker-desktop-guide.md)                 | Docker Desktop setup and container execution guide                                               |
| [`docs/jenkins-docker-setup.md`](./jenkins-docker-setup.md)                 | Jenkins declarative pipeline configuration with Docker agent                                     |
| [`docs/CODE_REVIEW.md`](./CODE_REVIEW.md)                                   | PR code review checklist and quality criteria                                                    |
| [`docs/CONTRIBUTING.md`](./CONTRIBUTING.md)                                 | Contribution guidelines, branching strategies, and workflow                                      |
| [`docs/SECURITY.md`](./SECURITY.md)                                         | Security policies and secret management                                                          |
| [`docs/FRAMEWORK_TODO.md`](./FRAMEWORK_TODO.md)                             | Framework enhancement roadmap and tracked improvements                                           |

---

## 3. Project Structure & File Layout

The workspace enforces strict separation between application facades, page objects, fixtures, configuration, and test suites:

```
UI_Automation_Framework/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # GitHub Actions staged CI pipeline (smoke on PR, full on push)
│       └── codeql.yml             # CodeQL security analysis workflow
├── config/
│   ├── apps.json                  # Multi-app registry config (baseURL, authType, timeouts, storageState)
│   └── test-suites.json           # Suite definitions and path mappings for runner script
├── docs/                          # Framework documentation
├── globals/
│   ├── global-setup.ts            # Global bootstrap hook
│   └── global-teardown.ts         # Global teardown hook
├── schemas/                       # JSON schemas for AJV API response validation
│   ├── createUser.request.schema.json
│   ├── error.schema.json
│   └── user.schema.json
├── scripts/
│   ├── prepare-storage-states.ts  # Script to pre-generate app auth storage states
│   └── run-app-suite.cjs          # Custom CLI runner for app-specific and suite-specific execution
├── src/
│   ├── apps/                      # App Facades and app test data
│   │   ├── cura/
│   │   │   ├── CuraApp.ts         # CURA Application Facade
│   │   │   ├── index.ts           # App export entrypoint
│   │   │   └── test-data/users.ts # App user credentials and datasets
│   │   ├── orangehrm/
│   │   │   ├── OrangeHrmApp.ts    # OrangeHRM Application Facade
│   │   │   ├── index.ts
│   │   │   └── test-data/users.ts
│   │   └── saucedemo/
│   │       ├── SauceDemoApp.ts    # SauceDemo Application Facade
│   │       ├── index.ts
│   │       └── test-data/users.ts
│   ├── config/                    # Strongly-typed configuration interfaces and registry
│   │   ├── app.config.ts          # AppRegistry, AppConfig types, AppName union
│   │   ├── cura.config.ts         # CURA static configuration
│   │   ├── env.config.ts          # Environment resolution helper
│   │   ├── orangehrm.config.ts    # OrangeHRM static configuration
│   │   └── saucedemo.config.ts    # SauceDemo static configuration
│   ├── core/                      # Shared core framework capabilities
│   │   ├── auth/
│   │   │   ├── auth-session.ts    # Session management and storage-state resolution
│   │   │   └── index.ts
│   │   ├── fixtures/
│   │   │   ├── auth.fixture.ts    # Authenticated page & facade fixtures
│   │   │   ├── test.fixture.ts    # Standard test fixtures (unauthenticated pages + logger)
│   │   │   └── README.md
│   │   └── utils/
│   │       ├── logger.ts          # Structured console logger with emojis and timestamps
│   │       ├── randomUtils.ts     # Test data generator (names, emails, dates, phones)
│   │       └── waitUtils.ts       # Stability wait utilities (network idle, DOM stabilization)
│   ├── interface/
│   │   ├── api.interface.ts       # API contract types
│   │   └── pages.interface.ts     # Page object interfaces
│   ├── pages/                     # Page Object Model implementations
│   │   ├── apps/                  # App-specific page objects
│   │   │   ├── cura/pages/        # CuraLoginPage, CuraAppointmentPage, CuraConfirmationPage
│   │   │   ├── orangehrm/pages/   # OrangeHrmLoginPage, OrangeHrmDashboardPage
│   │   │   ├── saucedemo/pages/   # SauceDemoLoginPage, SauceDemoInventoryPage, SauceDemoCartPage
│   │   │   └── vwo/pages/         # VwoLoginPage (archived reference)
│   │   ├── base/
│   │   │   └── BasePage.ts        # Primary BasePage with AppRegistry integration
│   │   ├── infrastructure/
│   │   │   ├── PageFactory.ts     # Dynamic page object factory
│   │   │   └── index.ts
│   │   └── BasePage.ts            # Root BasePage with flakiness helper methods
│   └── utils/                     # Framework helper utilities
│       ├── apiHelper.ts           # Axios/Playwright API client with schema validation
│       ├── assertions.ts          # Common domain assertions
│       ├── envHelper.ts           # Process env accessor with fallbacks
│       ├── envUtils.ts            # Environment utilities
│       ├── flakeHelper.ts         # Advanced anti-flakiness retry and wait helpers
│       ├── formatDate.ts          # Date formatting utilities
│       ├── realtimeHelper.ts      # WebSocket and SSE helpers
│       ├── schemaValidator.ts     # AJV JSON schema validator
│       ├── selectors.ts           # Central selector strategies and dictionaries
│       ├── vwoAuth.ts             # VWO authentication helper
│       └── waitForElement.ts      # Element wait wrapper
├── storage-state/                 # Saved browser session state files (gitignored in CI)
│   ├── cura.json
│   ├── orangehrm.json
│   └── saucedemo.json
├── test-data/                     # Global fixture datasets
├── tests/                         # Playwright test specifications
│   ├── cura/                      # CURA Healthcare test suites
│   │   ├── 01-auth/               # Negative path and validation tests
│   │   ├── smoke/                 # Fast happy-path confidence tests
│   │   ├── regression/            # End-to-end appointment workflows
│   │   ├── 04-accessibility-testing/
│   │   ├── 05-performance-testing/
│   │   └── 06-visual-regression/
│   ├── orangehrm/                 # OrangeHRM test suites (same 6-suite layout)
│   ├── saucedemo/                 # SauceDemo test suites (same 6-suite layout)
│   ├── shared/                    # Cross-cutting framework tests
│   │   ├── api/                   # Shared API contracts (user-api, api-health)
│   │   └── auth/                  # Shared auth fixture tests
│   └── templates/                 # Reusable reference templates (*.template.ts)
├── Dockerfile                     # Container definition based on mcr.microsoft.com/playwright
├── docker-compose.yml             # Docker compose configuration for headless and headed runs
├── Jenkinsfile.docker             # Declarative Jenkins pipeline running in Docker container
├── package.json                   # Dependencies, scripts, and lint-staged configuration
├── playwright.config.ts           # Playwright runner configuration
└── tsconfig.json                  # TypeScript compiler settings (strict mode enabled)
```

---

## 4. Configuration & Multi-App Registry

The framework centralizes multi-app configuration using a registry pattern.

### `config/apps.json`

App metadata, base URLs, timeouts, and storage state locations are configured declaratively:

```json
{
  "saucedemo": {
    "baseUrl": "https://www.saucedemo.com",
    "authType": "cookie",
    "storageState": "storage-state/saucedemo.json",
    "timeouts": { "action": 10000, "navigation": 30000 },
    "retryStrategy": "standard"
  },
  "cura": {
    "baseUrl": "https://katalon-demo-cura.herokuapp.com",
    "authType": "session",
    "storageState": "storage-state/cura.json",
    "timeouts": { "action": 10000, "navigation": 30000 },
    "retryStrategy": "standard"
  },
  "orangehrm": {
    "baseUrl": "https://opensource-demo.orangehrmlive.com",
    "authType": "session",
    "storageState": "storage-state/orangehrm.json",
    "timeouts": { "action": 15000, "navigation": 35000 },
    "retryStrategy": "exponential"
  },
  "local": {
    "baseUrl": "http://localhost:3000",
    "authType": "none",
    "timeouts": { "action": 5000, "navigation": 15000 },
    "retryStrategy": "none"
  }
}
```

### `src/config/app.config.ts`

The `AppRegistry` singleton exposes typed configurations to page objects, fixtures, and `playwright.config.ts`:

```typescript
export type AppName = 'saucedemo' | 'cura' | 'orangehrm' | 'vwo' | 'local';

export interface AppConfig {
  baseUrl: string;
  authType: 'cookie' | 'session' | 'token' | 'none';
  timeouts: { action: number; navigation: number };
  retryStrategy?: 'none' | 'standard' | 'exponential';
  storageState?: string;
}

export class AppRegistry {
  private static apps: Map<AppName, AppConfig> = new Map();

  static register(name: AppName, config: AppConfig): void {
    this.apps.set(name, config);
  }

  static get(name: AppName): AppConfig {
    const config = this.apps.get(name);
    if (!config) throw new Error(`App configuration not found for: ${name}`);
    return config;
  }
}
```

### Environment Variables (`.env`)

Copy `.env.example` to `.env` to customize settings locally:

| Variable                                    | Description                                                    | Default                           |
| ------------------------------------------- | -------------------------------------------------------------- | --------------------------------- |
| `APP` / `APP_NAME`                          | Active application (`saucedemo`, `cura`, `orangehrm`, `local`) | `local`                           |
| `TEST_SUITE`                                | Active suite name (`smoke`, `regression`, `auth`, `all`)       | `all`                             |
| `CI`                                        | Flags CI environment (adjusts retries, workers, timeouts)      | `undefined`                       |
| `HEADLESS`                                  | Controls browser visibility (`true` / `false`)                 | `true`                            |
| `PLAYWRIGHT_WORKERS`                        | Overrides parallel worker count                                | `undefined` (1 in CI)             |
| `PLAYWRIGHT_RETRIES`                        | Overrides test retry count                                     | `undefined` (2 in CI, 0 in debug) |
| `CURA_USERNAME` / `CURA_PASSWORD`           | Credentials for CURA                                           | `John Doe` / `ThisIsNotAPassword` |
| `ORANGEHRM_USERNAME` / `ORANGEHRM_PASSWORD` | Credentials for OrangeHRM                                      | `Admin` / `admin123`              |
| `SAUCEDEMO_USERNAME` / `SAUCEDEMO_PASSWORD` | Credentials for SauceDemo                                      | `standard_user` / `secret_sauce`  |

---

## 5. Page Object Model & App Facades

### Architectural Hierarchy

```
┌────────────────────────────────────────────────────────┐
│                   Test Specification                   │
│          tests/saucedemo/smoke/app-smoke.spec.ts       │
└───────────────────────────┬────────────────────────────┘
                            │ uses
┌───────────────────────────▼────────────────────────────┐
│                   App Facade Class                     │
│         src/apps/saucedemo/SauceDemoApp.ts             │
│   (Encapsulates pages, coordinates multi-page flows)   │
└─────────────┬────────────────────────────┬─────────────┘
              │ contains                   │ contains
┌─────────────▼───────────────┐ ┌──────────▼───────────────┐
│     SauceDemoLoginPage      │ │   SauceDemoInventoryPage  │
│  src/pages/apps/saucedemo/  │ │ src/pages/apps/saucedemo/ │
└─────────────┬───────────────┘ └──────────┬───────────────┘
              │ extends                    │ extends
┌─────────────▼────────────────────────────▼─────────────┐
│                       BasePage                         │
│               src/pages/base/BasePage.ts               │
│     (AppRegistry, flakeHelper, resilient locators)     │
└────────────────────────────────────────────────────────┘
```

### BasePage Implementation (`src/pages/base/BasePage.ts`)

Every app-specific page extends `BasePage`, gaining access to app-aware base URLs, navigation timeouts, and anti-flake interactions:

```typescript
export abstract class BasePage {
  protected appName: AppName;
  protected appConfig: AppConfig;

  constructor(
    protected page: Page,
    appName?: AppName,
  ) {
    this.appName = appName || (process.env.APP_NAME as AppName) || 'local';
    this.appConfig = AppRegistry.get(this.appName);
  }

  abstract goto(): Promise<void>;

  async waitForPageLoad(): Promise<void> {
    await waitForNetworkStable(this.page);
  }

  getPage(): Page {
    return this.page;
  }
}
```

### App Facade Pattern

Instead of instantiating individual page objects in every test, tests use the App Facade:

```typescript
// src/apps/saucedemo/SauceDemoApp.ts
export class SauceDemoApp {
  readonly loginPage: SauceDemoLoginPage;
  readonly inventoryPage: SauceDemoInventoryPage;
  readonly cartPage: SauceDemoCartPage;

  constructor(private readonly page: Page) {
    this.loginPage = new SauceDemoLoginPage(page);
    this.inventoryPage = new SauceDemoInventoryPage(page);
    this.cartPage = new SauceDemoCartPage(page);
  }

  async goto(): Promise<void> {
    await this.loginPage.goto();
  }

  async login(username: string, password: string): Promise<void> {
    await this.loginPage.goto();
    await this.loginPage.login(username, password);
    await this.loginPage.assertLoginSuccess();
  }
}
```

### Selector Priority Strategy

When writing page objects, follow this strict priority order:

1. `page.getByTestId('...')` — Most resilient, immune to DOM restyling.
2. `page.getByRole('button', { name: /login/i })` — Accessible, reflects user intent.
3. `page.getByPlaceholder('...')` — Highly readable for text inputs.
4. `page.getByText('...')` — Semantic for labels, headings, and alert text.
5. `page.locator('css-selector')` — Fallback when no semantic or test identifier exists.

---

## 6. Fixtures & Authentication Architecture

The framework provides two primary test fixtures located under `src/core/fixtures/`:

### 1. `test.fixture.ts` (Unauthenticated Tests & Shell Checks)

Use `test` from `src/core/fixtures/test.fixture.ts` for tests that do not need pre-authenticated storage states (e.g., negative login validation, public landing pages, or tests managing their own session lifecycle):

```typescript
import { test, expect } from '../../../src/core/fixtures/test.fixture';

test('@smoke @saucedemo - login page renders', async ({ saucedemoApp }) => {
  await saucedemoApp.goto();
  await expect(saucedemoApp.loginPage.getPage()).toHaveTitle(/swag labs/i);
});
```

Available fixtures in `test.fixture.ts`:

- **Facades**: `saucedemoApp`, `curaApp`, `orangeHrmApp`
- **Page Objects**: `saucedemoLoginPage`, `inventoryPage`, `cartPage`, `curaLoginPage`, `appointmentPage`, `confirmationPage`, `orangeHrmLoginPage`, `orangeHrmDashboardPage`
- **Utilities**: `logger`

### 2. `auth.fixture.ts` (Pre-Authenticated Tests & Session Reuse)

Use `test` from `src/core/fixtures/auth.fixture.ts` for tests that require a logged-in session. It checks for a valid session file in `storage-state/{app}.json` or logs in automatically before handing control to the test:

```typescript
import { test } from '../../../src/core/fixtures/auth.fixture';

test('@smoke @saucedemo - user sees inventory', async ({
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

Available fixtures in `auth.fixture.ts`:

- `authenticatedPage`: Browser `Page` with loaded storage state.
- `authSession`: Contains context and page reference.
- `appName`: Resolved active application name.
- `pageFactory`: Dynamic factory for reflective page object creation.
- `saucedemoApp`, `curaApp`, `orangeHrmApp`: Facades bound to the authenticated page.

---

## 7. Core Utilities & Helpers

### Logger (`src/core/utils/logger.ts`)

Provides structured, timestamped logs with visual indicators:

```typescript
import { logger } from '../../src/core/utils/logger';

logger.info('Navigating to checkout');
logger.pass('Payment verified');
logger.warn('Slow network response detected');
logger.error('Failed to find element');
logger.debug('Resolved selector: #checkout');
```

### Wait Utilities (`src/core/utils/waitUtils.ts`)

Eliminates arbitrary `page.waitForTimeout()` sleeps:

```typescript
import { waitForNetworkIdle, waitForStable } from '../../src/core/utils/waitUtils';

await waitForNetworkIdle(page);
await waitForStable(page.locator('.dynamic-table'));
```

### Anti-Flakiness Helper (`src/utils/flakeHelper.ts`)

Supplies advanced retry loops and stable interaction methods:

```typescript
import { stableClick, stableFill, expectWithRetry } from '../../src/utils/flakeHelper';

await stableClick(page.locator('button#submit'));
await stableFill(page.locator('input#email'), 'user@test.com');
await expectWithRetry(
  async () => {
    await expect(page.locator('.toast')).toBeVisible();
  },
  { maxAttempts: 3, delayMs: 500 },
);
```

### API Helper & JSON Schema Validation (`src/utils/apiHelper.ts` & `src/utils/schemaValidator.ts`)

Enforces type safety and JSON Schema compliance on API calls:

```typescript
import { ApiHelper } from '../../src/utils/apiHelper';
import { schemaValidator } from '../../src/utils/schemaValidator';

const api = new ApiHelper(request, 'https://reqres.in');
const response = await api.get('/api/users/2', 'user.schema.json');
schemaValidator.validateOrThrow(response.data, 'user.schema.json');
```

---

## 8. Test Organization & Execution Guide

### Suite Structure

Each application in `tests/<app>/` implements 6 dedicated suite types:

| Suite Folder                | Purpose                                                          | Example File                                      |
| --------------------------- | ---------------------------------------------------------------- | ------------------------------------------------- |
| `01-auth/`                  | Negative login validation and credential boundary checks         | `login-data-driven.spec.ts`                       |
| `smoke/`                    | Fast happy-path confidence checks (public shell & authenticated) | `app-smoke.spec.ts`, `login.spec.ts`              |
| `regression/`               | Comprehensive end-to-end workflows                               | `add-to-cart.spec.ts`, `book-appointment.spec.ts` |
| `04-accessibility-testing/` | Axe-core accessibility compliance checks                         | `a11y.spec.ts`                                    |
| `05-performance-testing/`   | Navigation timing and Core Web Vitals checks                     | `performance.spec.ts`                             |
| `06-visual-regression/`     | Pixel-perfect screenshot comparisons (`*-snapshots/`)            | `visual-regression.spec.ts`                       |

Shared coverage:

- `tests/shared/auth`: Tests for storage state generation and session fixtures.
- `tests/shared/api`: Health checks (`api-health.spec.ts`) and contract tests (`user-api.spec.ts`).

Templates:

- `tests/templates/`: Reusable patterns named `*.template.ts` (excluded from active test runs).

---

### Executing Tests

#### Standard NPM Scripts (`package.json`)

```bash
# Run all active tests across all configured projects
npm test

# Run tests in headed browser
npm run test:headed

# Interactive debug mode with Playwright Inspector
npm run test:debug

# Interactive UI Mode (Visual runner)
npm run test:ui

# Run tests matching the @smoke tag
npm run test:smoke

# Run with specific browser projects
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Show HTML report from last execution
npm run test:report

# Code quality validation
npm run typecheck       # tsc --noEmit
npm run lint            # ESLint inspection
npm run lint:fix        # ESLint auto-fix
npm run format          # Prettier formatting
npm run format:check    # Prettier verification
```

#### Granular App-Suite Runner (`scripts/run-app-suite.cjs`)

The framework provides a dedicated CLI runner that configures environment variables, test paths, and report directories based on `config/test-suites.json`:

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

# Run with specific browser project (e.g. chromium)
node scripts/run-app-suite.cjs --app=saucedemo --suite=smoke --project=chromium
```

#### Updating Visual Baselines

To regenerate visual comparison snapshots:

```bash
# SauceDemo visual update
node scripts/run-app-suite.cjs --app=saucedemo --suite=visual -u

# CURA visual update
node scripts/run-app-suite.cjs --app=cura --suite=visual -u

# OrangeHRM visual update
node scripts/run-app-suite.cjs --app=orangehrm --suite=visual -u
```

#### Reports and Artifacts

Reports are partitioned by application and suite:

- **HTML Report**: `playwright-report/<app>/<suite>/index.html`
- **JSON Report**: `test-results/json/<app>-<suite>.json`
- **JUnit Report**: `test-results/junit/<app>-<suite>.xml`
- **Artifacts (Traces, Videos, Screenshots)**: `test-results/artifacts/<app>/<suite>/`

---

## 9. Real-World Test Implementation Examples

### Example 1: Unauthenticated Page Shell Verification (`test.fixture.ts`)

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

### Example 2: Data-Driven Login Validation (`01-auth`)

```typescript
// tests/saucedemo/01-auth/login-data-driven.spec.ts
import { test } from '../../../src/core/fixtures/test.fixture';
import { resolveAppNameFromEnv } from '../../../src/core/auth/auth-session';
import { users } from '../../../src/apps/saucedemo/test-data/users';

// Clear cookies to guarantee an unauthenticated state
test.use({ storageState: { cookies: [], origins: [] } });

const invalidScenarios = [
  {
    name: 'standard user with invalid password',
    username: users.standard_user.username,
    password: `${users.standard_user.password}__invalid`,
  },
  {
    name: 'locked out user',
    username: users.locked_out_user.username,
    password: users.locked_out_user.password,
  },
];

test.describe('SauceDemo Login Validation', () => {
  for (const scenario of invalidScenarios) {
    test(`@auth @saucedemo - login fails for ${scenario.name}`, async ({ saucedemoApp }) => {
      const appName = resolveAppNameFromEnv();
      if (appName !== 'saucedemo' || !saucedemoApp) {
        test.skip();
        return;
      }

      await saucedemoApp.loginPage.goto();
      await saucedemoApp.loginPage.login(scenario.username, scenario.password);
      await saucedemoApp.loginPage.assertLoginFailure();
    });
  }
});
```

### Example 3: Authenticated Journey with App Facade (`auth.fixture.ts`)

```typescript
// tests/cura/regression/book-appointment.spec.ts
import { test } from '../../../src/core/fixtures/auth.fixture';

test('@regression @cura - user can book healthcare appointment', async ({ curaApp, appName }) => {
  if (appName !== 'cura' || !curaApp) {
    test.skip();
    return;
  }

  await curaApp.appointmentPage.goto();
  await curaApp.appointmentPage.selectFacility('Seoul CURA Healthcare Center');
  await curaApp.appointmentPage.applyHospitalReadmission(true);
  await curaApp.appointmentPage.selectMedicaidProgram();
  await curaApp.appointmentPage.setVisitDate('30/11/2026');
  await curaApp.appointmentPage.setComment('Annual health checkup');
  await curaApp.appointmentPage.clickBookAppointment();

  await curaApp.confirmationPage.assertAppointmentConfirmed();
});
```

### Example 4: API Contract Testing with JSON Schema Validation

```typescript
// tests/shared/api/user-api.spec.ts
import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../../src/utils/apiHelper';
import { schemaValidator } from '../../../src/utils/schemaValidator';

test.describe('Users API - Schema & Contract Validation', () => {
  let api: ApiHelper;

  test.beforeEach(async ({ request }) => {
    api = new ApiHelper(request, 'https://reqres.in');
  });

  test('@api - GET /api/users/2 validates against user schema', async () => {
    const response = await api.get('/api/users/2', 'user.schema.json');
    expect(response.status).toBe(200);

    const isValid = schemaValidator.validate(response.data, 'user.schema.json');
    expect(isValid).toBeTruthy();
  });
});
```

---

## 10. CI/CD & Containerization

### GitHub Actions Pipeline (`.github/workflows/ci.yml`)

The repository runs a phased CI workflow:

1. **Install Stage**: Sets up Node.js 20, resolves run metadata, and executes `npm ci`.
2. **Lint & Typecheck Stage**: Runs `npm run lint`, `npm run format:check`, and `npm run typecheck`.
3. **Execution Stage**:
   - **Pull Request Scope**: Fast feedback running smoke suites:
     - `saucedemo:smoke`
     - `cura:smoke`
     - `orangehrm:smoke`
     - `local:shared-api`
   - **Push / Manual Scope**: Full test suite:
     - `saucedemo:auth`, `saucedemo:smoke`, `saucedemo:regression`, `saucedemo:accessibility`, `saucedemo:shared-auth`
     - `cura:auth`, `cura:smoke`, `cura:regression`, `cura:shared-auth`
     - `orangehrm:auth`, `orangehrm:smoke`, `orangehrm:regression`, `orangehrm:accessibility`, `orangehrm:shared-auth`
     - `local:shared-api`
4. **Publish Stage**: Aggregates JUnit, JSON, and HTML reports and publishes a GitHub Run Summary.

_(Note: Visual and performance testing suites are run on-demand rather than as blocking CI gates to prevent flakiness across varied rendering agents)._

### Jenkins Pipeline (`Jenkinsfile.docker`)

The Jenkinsfile provides a reproducible, containerized pipeline:

- Pulls `mcr.microsoft.com/playwright:v1.56.1-noble`.
- Mounts the workspace to `/workspace`.
- Supports parameter choices: `TEST_SCOPE` (`smoke` vs. `full`), `PLAYWRIGHT_PROJECT` (`chromium`, `firefox`, `webkit`, `saucedemo`, `cura`), and `APP`.
- Publishes HTML reports and archives artifacts automatically.

### Docker & Docker Compose

```bash
# Build and run tests headlessly via Docker Compose
docker compose run test

# Run tests in headed container with display passthrough
docker compose run test-headed
```

---

## 11. Best Practices, Flakiness Reduction & Quality Gates

### Anti-Flakiness Rules

1. **Never use fixed sleeps**: Avoid `page.waitForTimeout()`. Instead, use `page.waitForURL()`, `locator.waitFor()`, or `waitForNetworkStable()`.
2. **Prefer web-first assertions**: Always use `await expect(locator).toBeVisible()` over checking `await locator.isVisible()`. Web-first assertions automatically retry until the timeout.
3. **Scope locators tightly**: Avoid overly generic locators like `page.locator('button')`. Use `page.getByRole('button', { name: 'Submit' })`.
4. **Isolate tests**: Each test must be completely independent. Clean up cookies or mock state if testing login failure.

### Quality Gates

- **Pre-commit**: Husky executes `lint-staged` on staged `.ts`, `.json`, and `.md` files to run ESLint and Prettier.
- **Pre-push**: Recommended check via `npm run pre-push` (`npm run lint && npm run typecheck`).
- **Continuous Integration**: The CI pipeline blocks merge requests on lint, typecheck, or test failure.

---

## 12. Extending the Framework (Adding Apps & Pages)

To onboard a new application (e.g. `ecommerce`):

1. **Add App Registry Entry** in `config/apps.json`:
   ```json
   "ecommerce": {
     "baseUrl": "https://ecommerce.example.com",
     "authType": "cookie",
     "storageState": "storage-state/ecommerce.json",
     "timeouts": { "action": 10000, "navigation": 30000 }
   }
   ```
2. **Define App Config** in `src/config/ecommerce.config.ts` and register in `src/config/app.config.ts`.
3. **Create Page Objects** extending `BasePage`:
   - Directory: `src/pages/apps/ecommerce/pages/`
   - Example: `EcommerceHomePage.ts`, `EcommerceCheckoutPage.ts`.
4. **Create App Facade**:
   - Directory: `src/apps/ecommerce/EcommerceApp.ts`.
   - Export through `src/apps/ecommerce/index.ts`.
5. **Add Fixtures** in `src/core/fixtures/test.fixture.ts` and `src/core/fixtures/auth.fixture.ts`.
6. **Configure Suites** in `config/test-suites.json`.
7. **Write Tests** in `tests/ecommerce/` under `smoke/`, `regression/`, and `01-auth/`.
