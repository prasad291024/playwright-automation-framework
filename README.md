# Playwright Automation Framework

A comprehensive, production-ready end-to-end testing framework built with **Playwright** and **TypeScript**, featuring Page Object Model (POM) architecture, API testing with schema validation, and full CI/CD integration.

---

## 🚀 Features

- ✅ **Page Object Model (POM)** with TypeScript interfaces and `BasePage` abstraction
- ✅ **Role-based selectors** for accessible and maintainable tests
- ✅ **API testing** with JSON schema validation (AJV)
- ✅ **Type-safe API helpers** with automatic response validation
- ✅ **Multi-browser support** (Chromium, Firefox, WebKit)
- ✅ **Data-driven testing** with external JSON files
- ✅ **Code quality enforcement** (ESLint, Prettier, TypeScript strict)
- ✅ **Pre-commit hooks** (Husky + lint-staged)
- ✅ **GitHub Actions CI/CD** (multi-browser, multi-platform)
- ✅ **Docker & Docker Compose** support for consistent environments
- ✅ **Comprehensive reporting** (HTML, JSON, screenshots)
- ✅ **Global setup/teardown** and authentication fixtures

---

## 📁 Folder Structure

```
.
├── .github/
│   └── workflows/                # GitHub Actions CI/CD pipelines
│       ├── test.yml              # Multi-browser test workflow
│       └── codeql.yml            # Security scanning
├── .husky/
│   └── pre-commit                # Pre-commit hook (runs lint-staged)
├── src/
│   ├── pages/                    # Page Object classes (extend BasePage)
│   │   ├── BasePage.ts           # Abstract base with common methods
│   │   ├── LoginPage.ts          # Example page object
│   │   └── ...
│   ├── interface/                # TypeScript interfaces
│   │   ├── pages.interface.ts    # ILoginPage, IDashboardPage, etc.
│   │   └── api.interface.ts      # API request/response types
│   ├── utils/
│   │   ├── selectors.ts          # Centralized selector definitions
│   │   ├── apiHelper.ts          # Typed API client
│   │   ├── schemaValidator.ts    # JSON schema validation (AJV)
│   │   ├── logger.ts             # Logging utilities
│   │   └── ...
│   └── fixture/                  # Static test data & custom fixtures
├── tests/
│   ├── 01-fundamentals/          # Basic test examples
│   ├── 02-interactions/          # User interaction tests
│   ├── 03-test-organization/     # Grouped test examples
│   ├── 04-advanced-features/     # Advanced patterns
│   ├── 05-page-object-model/     # POM examples
│   ├── 06-api-testing/           # API tests with schema validation
│   └── config.ts                 # Test configuration
├── test-data/
│   ├── fixtures/                 # Test data files (JSON)
│   ├── dev/                      # Environment-specific data
│   ├── qa/
│   └── storage-state/            # Saved browser state
├── schemas/                      # JSON Schema definitions
│   ├── user.schema.json          # User response schema
│   ├── error.schema.json         # Error response schema
│   └── createUser.request.schema.json # Request schema
├── globals/
│   ├── global-setup.ts           # Global setup (auth state, etc.)
│   └── global-teardown.ts        # Cleanup
├── playwright-report/            # HTML test reports
├── test-results/                 # JSON test results
├── screenshots/                  # Failure screenshots
├── Dockerfile                    # Docker image configuration
├── docker-compose.yml            # Docker Compose orchestration
├── playwright.config.ts          # Playwright configuration
├── tsconfig.json                 # TypeScript configuration
├── .eslintrc.json                # ESLint rules
├── .prettierrc.json              # Prettier formatting
└── CONTRIBUTING.md               # Developer guidelines
```

---

## 🧪 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/prasad291024/playwright-automation-framework.git
cd playwright-automation-framework

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Environment Setup

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
.github/workflows/test.yml      # Main test pipeline
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

See [CONTRIBUTING.md](./CONTRIBUTING.md) for:

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

**Ready to contribute?** See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines!
