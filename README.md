# Playwright Automation Framework

<div align="center">

🎭 **A Production-Grade End-to-End Testing Framework**

Built with **Playwright**, **TypeScript**, and **Industrial-Quality Automation**

![Playwright](https://img.shields.io/badge/Playwright-v1.56+-0DB7ED?style=flat-square&logo=microsoftedge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-3178C6?style=flat-square&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js)

[Features](#-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [Quality Gates](#-industrial-grade-quality-gates) • [CI/CD](#-cicd-pipeline)

</div>

---

## 🚀 Features

<table>
<tr>
<td>

### Core Framework

- ✅ **Page Object Model (POM)** with TypeScript interfaces
- ✅ **Multi-browser support** (Chromium, Firefox, WebKit)
- ✅ **Accessible selectors** (role-based, test IDs)
- ✅ **Global setup/teardown** and auth fixtures
- ✅ **API testing** with JSON schema validation
- ✅ **Data-driven testing** with external data files
- ✅ **Comprehensive reporting** (HTML, JSON, videos, screenshots)

</td>
<td>

### Quality & Reliability

- ✅ **TypeScript strict mode** for type safety
- ✅ **ESLint + Prettier** code quality enforcement
- ✅ **Husky + lint-staged** pre-commit automation
- ✅ **GitHub Actions CI/CD** multi-browser testing
- ✅ **Flaky test protection** (retries, diagnostics)
- ✅ **Test tagging strategy** (@smoke, @regression, @critical)
- ✅ **Production diagnostics** (trace, video, screenshots)

</td>
<td>

### Developer Experience

- ✅ **Docker & Docker Compose** support
- ✅ **Visual Studio Code integration**
- ✅ **Automated test execution**
- ✅ **Branch protection rules**
- ✅ **Environment-specific configs**
- ✅ **Real-time test reporting**
- ✅ **Comprehensive documentation**

</td>
</tr>
</table>

---

## 📁 Project Structure

```
.
├── 🔧 Configuration & Setup
│   ├── playwright.config.ts      # Playwright configuration (browsers, timeouts, retries)
│   ├── tsconfig.json             # TypeScript strict mode configuration
│   ├── .eslintrc.cjs             # ESLint rules and plugins
│   ├── .prettierrc                # Prettier formatting rules
│   └── .env.example              # Environment variables template
│
├── 🤖 CI/CD & Automation
│   ├── .github/workflows/
│   │   ├── ci.yml                # Staged CI pipeline (install, lint, typecheck, test, publish)
│   │   └── codeql.yml            # Security scanning
│   ├── .husky/                   # Git hooks
│   │   ├── pre-commit            # Pre-commit validation (lint-staged)
│   │   ├── pre-push              # Pre-push quality checks
│   │   ├── pre-merge             # Pre-merge validation
│   │   └── post-merge            # Post-merge smoke tests
│   ├── scripts/
│   │   ├── git-hooks/
│   │   │   ├── pre-commit.ps1    # PowerShell pre-commit script
│   │   │   └── pre-commit.sh     # Bash pre-commit script
│   │   ├── post-pull-checks.ps1  # Environment verification script
│   │   └── post-pull-checks.sh   # Bash environment check
│   └── Dockerfile & docker-compose.yml
│
├── 📝 Source Code
│   ├── src/
│   │   ├── pages/                # Page Object classes
│   │   │   ├── BasePage.ts       # Abstract base with common methods
│   │   │   ├── LoginPage.ts      # Example page objects
│   │   │   ├── DashboardPage.ts
│   │   │   └── infrastructure/
│   │   │       ├── PageFactory.ts # Dynamic page object factory
│   │   │       └── index.ts
│   │   │
│   │   ├── interface/            # TypeScript contracts
│   │   │   ├── pages.interface.ts # ILoginPage, IDashboardPage, etc.
│   │   │   └── api.interface.ts  # API request/response types
│   │   │
│   │   ├── utils/                # Utility functions
│   │   │   ├── apiHelper.ts      # Type-safe API client
│   │   │   ├── schemaValidator.ts # JSON schema validation (AJV)
│   │   │   ├── selectors.ts      # Centralized selector definitions
│   │   │   ├── assertions.ts     # Custom assertions
│   │   │   ├── logger.ts         # Logging utilities
│   │   │   └── [other utilities]
│   │   │
│   │   ├── core/                 # Core framework
│   │   │   ├── base/BasePage.ts  # Base page object class
│   │   │   ├── fixtures/         # Playwright fixtures
│   │   │   └── utils/            # Core utilities
│   │   │
│   │   ├── fixture/              # Test data & fixtures
│   │   │   ├── auth.fixture.ts   # Authentication fixture
│   │   │   └── README.md
│   │   │
│   │   └── config/               # Application configurations
│   │       ├── app.config.ts     # App registry and settings
│   │       └── [app-specific configs]
│   │
│   ├── tests/                    # Test suites
│   │   ├── cura/                 # CURA suites (auth, smoke, regression, a11y, performance)
│   │   ├── orangehrm/            # OrangeHRM suites
│   │   ├── saucedemo/            # SauceDemo suites
│   │   ├── shared/               # Shared auth and API coverage
│   │   └── templates/            # Numbered template track (01-10)
│   │
│   ├── test-data/                # Test data files
│   │   ├── fixtures/             # Shared test data (JSON)
│   │   ├── dev/                  # Development environment data
│   │   └── qa/                   # QA environment data
│   │
│   ├── schemas/                  # JSON Schema definitions
│   │   ├── user.schema.json      # User response schema
│   │   ├── error.schema.json     # Error response schema
│   │   └── createUser.request.schema.json
│   │
│   ├── globals/                  # Global test setup/teardown
│   │   ├── global-setup.ts       # Global authentication setup
│   │   └── global-teardown.ts    # Cleanup operations
│   │
│   └── storage-state/            # Saved browser authentication state
│
├── 📊 Reports & Results
│   ├── playwright-report/        # HTML test report (interactive)
│   ├── test-results/             # JSON test results
│   └── screenshots/              # Failure screenshots
│
├── 📚 Documentation
│   ├── docs/
│   │   ├── FRAMEWORK_INDEX.md          # Current framework overview
│   │   ├── FRAMEWORK_IMPLEMENTATION.md # Implementation guide
│   │   ├── PRODUCTION_FRAMEWORK_SUMMARY.md
│   │   ├── STRUCTURE_REFACTORING.md    # Structure history and migration notes
│   │   ├── PRODUCTION_READINESS.md     # Production checklist
│   │   ├── CONTRIBUTING.md             # Development guidelines
│   │   └── SECURITY.md                 # Security guidelines
│
└── 📦 Dependencies & Configuration
    ├── package.json
    ├── package-lock.json
    ├── .gitignore
    └── README.md (this file)
```

---

## ⚡ Quick Start

### Prerequisites

- Node.js 20+
- npm 10+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/prasad291024/playwright-automation-framework.git
cd playwright-automation-framework

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Verify environment
npm run verify-env
```

### Environment Setup

Create a `.env` file in the project root:

```bash
# Application Configuration
BASE_URL=https://your-app-url.com
APP_NAME=local  # or: saucedemo, cura, orangehrm

# Authentication
USERNAME=your_username
PASSWORD=your_password

# Logging
LOG_LEVEL=info  # debug, info, warn, error

# Timeouts (milliseconds)
ACTION_TIMEOUT=5000
NAVIGATION_TIMEOUT=30000
```

### Running Tests

```bash
# Run all tests (headless)
npm test

# Run smoke tests only (@smoke tag)
npm run test:smoke

# Run with visible browser
npm run test:headed

# Run specific active test file
npx playwright test tests/saucedemo/smoke/login.spec.ts

# Run tests matching pattern
npx playwright test --grep "login"

# Debug a specific test
npx playwright test tests/auth.spec.ts --debug

# View HTML report
npx playwright show-report
```

---

## 🏗️ Architecture & Design Patterns

### Page Object Model with Interfaces

TypeScript interfaces enforce contracts for page objects:

```typescript
// Interface (contract)
export interface ILoginPage {
  navigate(): Promise<void>;
  fillUsername(username: string): Promise<void>;
  clickLoginButton(): Promise<void>;
  getErrorMessage(): Promise<string>;
}

// Implementation
export class LoginPage extends BasePage implements ILoginPage {
  async navigate(): Promise<void> {
    await this.goto('/login');
    await this.waitForPageLoad();
  }

  async fillUsername(username: string): Promise<void> {
    await this.getByTestId('username-input').fill(username);
  }

  async clickLoginButton(): Promise<void> {
    await this.getByRole('button', { name: /sign in/i }).click();
  }
}
```

### Selector Strategy (Priority Order)

1. **Test ID** — `data-testid` (explicit, maintainable)

   ```typescript
   await this.getByTestId('submit-button').click();
   ```

2. **Role-based** — `getByRole` (accessible, semantic)

   ```typescript
   await this.getByRole('button', { name: /login/i }).click();
   ```

3. **Text/Placeholder** — User-centric selectors

   ```typescript
   await this.getByText('Submit').click();
   ```

4. **CSS/XPath** — Last resort only (fragile, avoid when possible)

### BasePage Abstract Class

All page objects inherit from `BasePage` for unified locator strategies:

```typescript
export abstract class BasePage {
  constructor(protected page: Page) {}

  // Role-based selectors (preferred for accessibility)
  protected getByRole(role: AriaRole, options?: GetByRoleOptions) {
    return this.page.getByRole(role, options);
  }

  // Test ID selectors (explicit, maintainable)
  protected getByTestId(testId: string) {
    return this.page.getByTestId(testId);
  }

  // Navigation helpers
  async goto(path: string) { ... }
  async navigateTo(url: string) { ... }
  async waitForPageLoad() { ... }

  // Common assertions
  async waitForElement(selector: string) { ... }
  async isElementVisible(locator: Locator) { ... }
}
```

---

## 🔌 API Testing with Schema Validation

### Type-Safe API Client

```typescript
import { apiHelper } from '../src/utils/apiHelper';

// Automatically validates response against user.schema.json
const user = await apiHelper.getUser(1);
console.log(user.id, user.name, user.email);

// Create user with automatic validation
const newUser = await apiHelper.createUser({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '555-1234',
});

// Validation error handling
try {
  const response = await apiHelper.getUser(999);
} catch (error) {
  console.error('API Error or validation failed:', error.message);
}
```

### JSON Schema Validation with AJV

```typescript
import { schemaValidator } from '../src/utils/schemaValidator';

// Validate data against schema
const result = schemaValidator.validate(userData, 'user.schema.json');
if (!result.isValid) {
  console.error('Validation errors:', result.errors);
}

// Validate or throw
schemaValidator.validateOrThrow(response, 'user.schema.json');

// Get human-readable errors
const messages = schemaValidator.getErrorMessages('user.schema.json', data);
messages.forEach((msg) => console.log(msg));
```

---

## 🛡️ Industrial-Grade Quality Gates

This framework implements **four control points** in the development lifecycle to ensure production-ready automation code.

### 1️⃣ Pre-Commit Checks (Local Developer Guard)

**Purpose:** Prevent bad code from entering the repository

**Trigger:** Automatic on `git commit`

**Technology:** Husky + lint-staged

**Checks:**

- ✅ ESLint validation with auto-fix
- ✅ Prettier formatting with auto-fix
- ✅ TypeScript compilation (manual: `npm run typecheck`)

```bash
# Automatic on every commit
git commit -m "feat: my changes"
# → Husky runs ESLint + Prettier automatically
# → Commit succeeds if all checks pass
# → Commit fails if checks cannot be auto-fixed
```

**Files Modified:**

- `.husky/pre-commit` — Runs `npx lint-staged`
- `scripts/git-hooks/pre-commit.ps1` & `.sh` — Alternative implementation

### 2️⃣ Post-Pull Checks (Environment Health Verification)

**Purpose:** Verify developer environment consistency after repository updates

**Trigger:** Manual execution after `git pull`

**Command:** `npm run verify-env`

**Checks:**

- ✅ Dependencies installation
- ✅ Browser installation
- ✅ Code quality validation
- ✅ Smoke test execution (@smoke)

```bash
# After pulling new changes
git pull
npm run verify-env
# → Installs dependencies
# → Installs browsers
# → Runs linting and type checking
# → Executes smoke test suite
```

**Implementation:**

- `scripts/post-pull-checks.ps1` — PowerShell version
- `scripts/post-pull-checks.sh` — Bash version
- Package.json script: `"verify-env"`

### 3️⃣ Pre-Merge Checks (Pull Request Quality Gate)

**Purpose:** Validate code meets standards before merge to main

**Trigger:** Pull Request to `main` branch

**Technology:** GitHub Actions

**Workflow:** `.github/workflows/ci.yml`

**Checks:**

- ✅ **Install Dependencies** — workspace/bootstrap stage
- ✅ **Lint** — ESLint + Prettier validation
- ✅ **Type check** — TypeScript compilation
- ✅ **Code Quality Checks** — staged quality gate summary
- ✅ **Test** — smoke scope on PR, broader suite coverage on push/manual runs
- ✅ **Publish Report** — artifact and report summary stage

**Each job appears as individual status check:**

- `Install Dependencies` ✅
- `Lint` ✅
- `Type check` ✅
- `Code Quality Checks` ✅
- `Test` ✅
- `Publish Report` ✅

```yaml
# Jobs run in stages after dependency installation
jobs:
  install:
    runs-on: ubuntu-latest
  lint:
    runs-on: ubuntu-latest
    needs: install
  typecheck:
    runs-on: ubuntu-latest
    needs: install
  code_quality:
    runs-on: ubuntu-latest
    needs: [lint, typecheck]
  test:
    runs-on: ubuntu-latest
    needs: [install, code_quality]
  publish_report:
    runs-on: ubuntu-latest
    needs: [install, test]
```

### 4️⃣ Post-Merge Checks (Main Branch Protection)

**Purpose:** Ensure main branch remains production-ready

**Trigger:** Push to `main` branch after merge

**Workflow:** `.github/workflows/ci.yml`

**Checks:**

- ✅ Staged CI execution on `main`
- ✅ Smoke/full scope selection based on event type
- ✅ HTML, JSON, JUnit, and raw artifact upload
- ✅ Published CI run summary

---

## 🏷️ Test Tagging Strategy

Tests are tagged for selective execution across the pipeline:

| Tag              | Purpose                            | When to Use                         |
| ---------------- | ---------------------------------- | ----------------------------------- |
| `@smoke`         | Core health checks, fast execution | PR validation, smoke testing        |
| `@regression`    | Full feature coverage              | Post-merge validation, nightly runs |
| `@critical`      | High-risk business flows           | Production-critical tests           |
| `@performance`   | Performance benchmarks             | Performance testing pipeline        |
| `@accessibility` | A11y compliance checks             | Accessibility testing               |
| `@visual`        | Visual regression tests            | Visual regression pipeline          |

### Usage Example

```typescript
// Smoke test (runs in PR validation)
test('@smoke - user can login', async ({ page }) => {
  // Test implementation
});

// Regression test (runs on main branch)
test('@regression - user can update profile', async ({ page }) => {
  // Test implementation
});

// Critical path test
test('@critical - payment processing', async ({ page }) => {
  // Test implementation
});
```

### Running Tests by Tag

```bash
# Run only smoke tests
npx playwright test --grep @smoke

# Run regression tests
npx playwright test --grep @regression

# Run critical tests
npx playwright test --grep @critical

# Run all except smoke
npx playwright test --grep --invert @smoke
```

---

## 🔄 Flaky Test Protection

The framework includes built-in strategies to reduce flakiness:

### Automatic Retries

```typescript
// playwright.config.ts
export default defineConfig({
  // Retry failed tests in CI, not locally
  retries: process.env.CI ? 2 : 0,

  // Detailed diagnostics on first retry
  trace: 'on-first-retry',
  video: 'retain-on-failure',
  screenshot: 'only-on-failure',
});
```

### Wait Strategies

```typescript
// Always wait for ready state
await page.goto(url, { waitUntil: 'networkidle' });

// Use Playwright's built-in waits
await page.waitForLoadState('networkidle');
await page.waitForSelector('.loaded', { timeout: 10000 });
```

### Smart Assertions

```typescript
// Playwright auto-waits for assertions
await expect(element).toBeVisible(); // Waits up to 5s
await expect(element).toHaveText('Expected text'); // Auto-waits
```

---

## 📊 Test Reports & Diagnostics

### HTML Report (Interactive)

```bash
npx playwright show-report
```

Location: `playwright-report/index.html`

Shows:

- ✅ Test execution timeline
- ✅ Pass/fail breakdown
- ✅ Screenshots of failures
- ✅ Video playback
- ✅ Execution traces for debugging

### JSON Report (Machine Readable)

Location: `test-results/results.json`

Use for:

- CI/CD integration
- Dashboards
- Custom analytics

### Failure Diagnostics

Automatically captured for failed tests:

- 📸 Screenshots
- 🎥 Video recordings
- 📍 Execution traces
- 🔍 Network logs

---

## 🔐 Branch Protection Rules

Configure the following in GitHub repository settings to protect the `main` branch:

### Required Settings

✅ **Require status checks to pass before merging**

- `Lint`
- `Type check`
- `Unit / smoke tests`

✅ **Require branches to be up to date before merging**

✅ **Require pull request reviews before merging**

- Minimum: 1 approval

✅ **Require conversation resolution before merging**

✅ **Require linear history**

### Additional Protections

✅ **Block force pushes**

✅ **Restrict who can push to matching branches**

### Configuration Steps

1. Go to: Settings → Branches
2. Click "Add rule"
3. Branch name pattern: `main`
4. Enable protections above
5. Click "Create"

See [Framework Index](./docs/FRAMEWORK_INDEX.md) and [Contributing](./docs/CONTRIBUTING.md) for current workflow guidance.

---

## 🔧 NPM Scripts

| Command                | Purpose                   |
| ---------------------- | ------------------------- |
| `npm test`             | Run all tests (headless)  |
| `npm run test:headed`  | Run with visible browser  |
| `npm run test:debug`   | Debug mode with inspector |
| `npm run test:ui`      | Interactive UI mode       |
| `npm run test:smoke`   | Run @smoke tests only     |
| `npm run lint`         | Check code style          |
| `npm run lint:fix`     | Auto-fix linting issues   |
| `npm run format`       | Format code               |
| `npm run format:check` | Check formatting          |
| `npm run typecheck`    | Validate TypeScript       |
| `npm run verify-env`   | Verify environment health |
| `npm run pre-pull`     | Pre-pull checks           |
| `npm run pre-merge`    | Pre-merge checks          |
| `npm run pre-push`     | Pre-push checks           |

---

## 🐳 Docker Support

### Docker Compose

```bash
# Run tests in Docker
docker-compose up test

# Run specific browser
docker-compose up test -- --project=firefox

# Run with headed browser
docker-compose run --build test-headed

# Build image
docker-compose build
```

### Manual Docker

```bash
# Build image
docker build -t playwright-tests .

# Run tests
docker run --rm \
  -v $(pwd)/test-results:/app/test-results \
  -v $(pwd)/playwright-report:/app/playwright-report \
  playwright-tests
```

---

## 💡 Complete Test Example

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { DashboardPage } from '../src/pages/DashboardPage';

test.describe('User Authentication @smoke', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
  });

  test('should login with valid credentials', async () => {
    // Arrange
    const testUser = {
      username: 'test@example.com',
      password: 'SecurePassword123',
    };

    // Act
    await loginPage.navigate();
    await loginPage.fillUsername(testUser.username);
    await loginPage.fillPassword(testUser.password);
    await loginPage.clickLoginButton();

    // Assert
    await expect(dashboardPage.getWelcomeMessage()).toContainText(`Welcome, ${testUser.username}`);
  });

  test('should display error with invalid credentials', async () => {
    // Act
    await loginPage.navigate();
    await loginPage.fillUsername('invalid@example.com');
    await loginPage.fillPassword('wrong');
    await loginPage.clickLoginButton();

    // Assert
    await expect(loginPage.getErrorMessage()).toBeVisible();
  });

  test('should require username and password', async () => {
    // Act
    await loginPage.navigate();
    await loginPage.clickLoginButton();

    // Assert
    await expect(loginPage.getUsernameError()).toContainText('Username is required');
  });
});
```

---

## 📚 Documentation

Comprehensive guides available in `docs/`:

| Document                                                                  | Purpose                               |
| ------------------------------------------------------------------------- | ------------------------------------- |
| [FRAMEWORK_INDEX.md](./docs/FRAMEWORK_INDEX.md)                           | Current framework overview            |
| [FRAMEWORK_IMPLEMENTATION.md](./docs/FRAMEWORK_IMPLEMENTATION.md)         | Implementation details                |
| [PRODUCTION_FRAMEWORK_SUMMARY.md](./docs/PRODUCTION_FRAMEWORK_SUMMARY.md) | Architecture summary                  |
| [STRUCTURE_REFACTORING.md](./docs/STRUCTURE_REFACTORING.md)               | Structure changes and migration notes |
| [PRODUCTION_READINESS.md](./docs/PRODUCTION_READINESS.md)                 | Production checklist                  |
| [CONTRIBUTING.md](./docs/CONTRIBUTING.md)                                 | Development guidelines                |
| [SECURITY.md](./docs/SECURITY.md)                                         | Security guidance                     |
| [tests/README.md](./tests/README.md)                                      | Current active and template suites    |

---

## 🤝 Contributing

We follow strict quality and contribution guidelines.

### Development Workflow

1. **Sync and verify environment**

   ```bash
   git pull
   npm run verify-env
   ```

2. **Create feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Develop and test**

   ```bash
   npm test  # Run tests locally
   ```

4. **Commit with pre-commit hooks**

   ```bash
   git add .
   git commit -m "feat: your feature"
   # → Pre-commit hooks run automatically
   ```

5. **Push feature branch**

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - PR validation runs automatically
   - Must pass all checks: Lint, Type check, Smoke tests

7. **Merge to main**
   - Requires 1 approval
   - All status checks must pass
   - Post-merge regression suite runs

See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for detailed guidelines.

---

## 🌐 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Page Object Model](https://playwright.dev/docs/pom)
- [TypeScript Handbook](https://www.typescriptlang.org/)
- [AJV JSON Schema Validator](https://ajv.js.org/)
- [ESLint Rules](https://eslint.org/)
- [Prettier Code Formatter](https://prettier.io/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com/)

---

## 🎯 Next Steps

- ✅ Review [FRAMEWORK_INDEX.md](./docs/FRAMEWORK_INDEX.md) for the current framework map
- ✅ Check [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for development guidelines
- ✅ Explore [tests/README.md](./tests/README.md) for active suite organization
- ✅ Read [PRODUCTION_READINESS.md](./docs/PRODUCTION_READINESS.md) before production deployment

---

## 📄 License

ISC

---

<div align="center">

Made with ❤️ by **Prasad** — Test Automation Engineer

**[⭐ Star on GitHub](https://github.com/prasad291024/playwright-automation-framework)** if you find this useful!

</div>

Create a `.env` file in the project root:

```bash
BASE_URL=https://your-app-url.com
USERNAME=your_username
PASSWORD=your_password
LOG_LEVEL=info
```

### Running Tests

```bash
# Run all tests (headless)
npm test

# Run tests with visible browser
npm run test:headed

# Run specific test file
npx playwright test tests/auth.api.spec.ts

# Run tests matching pattern
npx playwright test --grep "login"

# View HTML report
npx playwright show-report
```

---

## 🏗️ Architecture

### Page Object Model with Interfaces

This framework uses a modern POM pattern with TypeScript interfaces:

```typescript
// Interface contract
export interface ILoginPage {
  navigate(): Promise<void>;
  fillUsername(username: string): Promise<void>;
  fillPassword(password: string): Promise<void>;
  clickLoginButton(): Promise<void>;
}

// Implementation extending BasePage
export class LoginPage extends BasePage implements ILoginPage {
  async navigate(): Promise<void> {
    await this.goto('/login');
    await this.waitForPageLoad();
  }

  async fillUsername(username: string): Promise<void> {
    // Prefer testId over CSS selectors
    await this.getByTestId(SELECTORS_BY_TESTID.login.usernameInput).fill(username);
  }

  // ... more methods
}
```

### BasePage Class

All page objects inherit from `BasePage`, providing unified locator strategies:

```typescript
export abstract class BasePage {
  // Preferred: Role-based selectors (accessible, resilient)
  protected getByRole(role: AriaRole, options?: GetByRoleOptions) {}

  // Preferred: Test ID selectors (explicit data-testid attributes)
  protected getByTestId(testId: string) {}

  // Navigation helpers
  async goto(path: string) {}
  async navigateTo(url: string) {}
  async waitForPageLoad() {}
}
```

### Selector Strategy (Priority Order)

1. **Test ID** — `data-testid` attributes (explicit, maintainable)
2. **Role-based** — `getByRole('button', { name: /label/i })` (accessible)
3. **Text/Placeholder** — `getByText()`, `getByPlaceholder()` (user-centric)
4. **CSS/XPath** — Last resort only (brittle, avoid)

---

## 🔌 API Testing with Schema Validation

### Type-Safe API Helper

```typescript
import { apiHelper } from '../src/utils/apiHelper';

// Automatically validates response against user.schema.json
const user = await apiHelper.getUser(1);

// Create user with type validation
const newUser = await apiHelper.createUser({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '555-1234',
});

// Error handling with schema validation
try {
  const response = await apiHelper.getUser(999);
} catch (error) {
  console.error('Validation failed:', error.message);
}
```

### Schema Validation with AJV

```typescript
import { schemaValidator } from '../src/utils/schemaValidator';

// Validate against schema
const result = schemaValidator.validate(userData, 'user.schema.json');
if (!result.valid) {
  console.error('Validation errors:', result.errors);
}

// Throw on validation failure
schemaValidator.validateOrThrow(response, 'user.schema.json');

// Get human-readable error messages
const messages = schemaValidator.getErrorMessages('user.schema.json', data);
```

---

## 🔒 Code Quality & Pre-commit Hooks

### Quality Checks

```bash
# Check code style
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code
npm run format

# Validate TypeScript
npm run typecheck
```

### Husky + lint-staged

Automatically runs on every `git commit`:

1. **ESLint** checks and fixes `*.ts` files
2. **Prettier** formats code
3. **Commit rejected** if checks fail

No manual intervention needed—hooks run automatically.

---

## 🤖 GitHub Actions CI/CD

### Multi-Browser Testing

Runs on every push and pull request:

- **Browsers:** Chromium, Firefox, WebKit
- **Platforms:** Ubuntu, Windows, macOS
- **Quality:** ESLint, Prettier, TypeScript checks
- **Reports:** HTML + JSON artifacts

```bash
# View workflows
.github/workflows/ci.yml        # Main staged CI pipeline
.github/workflows/codeql.yml    # Security scanning
```

---

## 🐳 Docker Support

### Docker Compose

```bash
# Run tests in Docker
docker-compose up test

# Run with headed browser
docker-compose --profile headed up test-headed

# Build image
docker-compose build
```

### Manual Docker Commands

```bash
# Build image
docker build -t playwright-tests .

# Run tests
docker run --rm \
  -v $(pwd)/test-results:/app/test-results \
  -v $(pwd)/playwright-report:/app/playwright-report \
  playwright-tests

# Run specific browser
docker run --rm playwright-tests npm test -- --project=firefox
```

---

## 📦 NPM Scripts

| Script                | Purpose                        |
| --------------------- | ------------------------------ |
| `npm test`            | Run all tests (headless)       |
| `npm run test:headed` | Run tests with visible browser |
| `npm run lint`        | Check code style               |
| `npm run lint:fix`    | Auto-fix linting errors        |
| `npm run format`      | Format code with Prettier      |
| `npm run typecheck`   | Validate TypeScript            |

---

## 📊 Test Reports

- **HTML Report:** `playwright-report/index.html` — Interactive test results
- **JSON Report:** `test-results/results.json` — Machine-readable results
- **Screenshots:** `screenshots/` — Failure screenshots
- **Videos:** Captured for failed tests (configurable)

```bash
# View HTML report
npx playwright show-report
```

---

## 🧱 Example: Complete Test with Modern Patterns

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { DashboardPage } from '../src/pages/DashboardPage';

test.describe('User Authentication Flow', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
  });

  test('should login with valid credentials', async () => {
    // Arrange
    const testUser = {
      username: 'user@example.com',
      password: 'SecurePassword123',
    };

    // Act
    await loginPage.fillUsername(testUser.username);
    await loginPage.fillPassword(testUser.password);
    await loginPage.clickLoginButton();

    // Assert
    await expect(dashboardPage.getWelcomeMessage()).toContainText('Welcome');
  });

  test('should reject invalid credentials', async () => {
    // Act
    await loginPage.fillUsername('invalid@example.com');
    await loginPage.fillPassword('wrong');
    await loginPage.clickLoginButton();

    // Assert
    await expect(loginPage.getErrorMessage()).toBeVisible();
  });
});
```

---

## 🔗 Contributing

See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for:

- Development setup
- Git workflow and commit conventions
- Testing guidelines
- Code style requirements
- Pull request process

---

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Page Object Model Best Practices](https://playwright.dev/docs/pom)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [AJV JSON Schema Validator](https://ajv.js.org/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Formatting](https://prettier.io/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

## 👤 Author

Developed by **Prasad** — Software Test Engineer, passionate about test automation, framework design, and engineering excellence.

---

## 📄 License

ISC

---

**Ready to contribute?** See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for guidelines!
