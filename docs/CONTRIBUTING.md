# Contributing to Playwright Automation Framework

Thank you for contributing to this project! This document provides guidelines for development, testing, and submitting changes.

---

## 🚀 Getting Started

1. **Fork and clone** the repository:

   ```bash
   git clone https://github.com/your-username/playwright-framework.git
   cd playwright-framework
   ```

2. **Create a feature branch**:

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

---

## 📋 Development Workflow

### Before writing code:

- Review existing page objects in `src/pages/`
- Check test examples in `tests/`
- Ensure your feature aligns with the Page Object Model architecture

### Writing tests:

1. Place new test files in `tests/` with `*.spec.ts` extension
2. Use descriptive test names: `test('should verify user can login with valid credentials')`
3. Follow the Page Object Model pattern:

   ```typescript
   import { test, expect } from '@playwright/test';
   import { LoginPage } from '../src/pages/LoginPage';

   test('User login flow', async ({ page }) => {
     const loginPage = new LoginPage(page);
     await loginPage.navigate();
     await loginPage.fillUsername('user@example.com');
     await loginPage.fillPassword('password123');
     await loginPage.clickLoginButton();
     // assertions...
   });
   ```

4. Use **role-based** and **testId** locators (in order of preference):

   ```typescript
   // ✅ GOOD: Role-based selector
   await page.getByRole('button', { name: /login/i }).click();

   // ✅ GOOD: Test ID selector
   await page.getByTestId('login-button').click();

   // ⚠️ AVOID: CSS selectors (brittle)
   await page.locator('.btn.btn-primary').click();
   ```

---

## 🧪 Testing Guidelines

### Running tests:

```bash
# Run all tests
npm test

# Run specific test file
npx playwright test tests/auth.spec.ts

# Run tests matching a pattern
npx playwright test --grep "login"

# Run with headed browser
npm run test:headed

# Run in debug mode
npx playwright test --debug
```

### Test structure:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Login Feature', () => {
  test.beforeEach(async ({ page }) => {
    // Setup before each test
  });

  test('should display login form', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);

    // Act
    await loginPage.navigate();

    // Assert
    await expect(loginPage.getUsernameInput()).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    // Cleanup after each test
  });
});
```

---

## 📝 Code Style & Quality

### Linting and Formatting:

All code must pass linting checks before committing:

```bash
# Check for issues
npm run lint

# Auto-fix issues
npm run lint:fix

# Format code
npm run format

# Type check
npm run typecheck
```

### Code style rules:

- **TypeScript:** Strict mode enabled (`tsconfig.json`)
- **Linter:** ESLint with TypeScript support
- **Formatter:** Prettier (2-space indentation)
- **Line endings:** LF (auto-fixed on commit)

### Naming conventions:

- **Page classes:** `LoginPage`, `DashboardPage` (PascalCase)
- **Test files:** `auth.spec.ts`, `users.api.spec.ts` (kebab-case)
- **Methods:** `login()`, `navigateTo()` (camelCase)
- **Constants:** `BASE_URL`, `TIMEOUT_MS` (UPPER_SNAKE_CASE)
- **Variables:** `username`, `isLoading` (camelCase)

---

## 🔀 Git Workflow

### Commit messages:

Follow conventional commits format:

```
<type>(<scope>): <description>

<optional-body>
<optional-footer>
```

**Types:**

- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code restructuring
- `test:` Test additions/changes
- `docs:` Documentation
- `ci:` CI/CD changes
- `chore:` Build, dependencies, etc.

**Examples:**

- `feat(login): add password recovery flow`
- `fix(selectors): update dashboard button locator`
- `test(api): add user schema validation tests`
- `docs(readme): update installation instructions`

### Pre-commit hooks:

**Husky** automatically runs:

1. ESLint (auto-fixes)
2. Prettier (formats)

If checks fail, the commit is rejected. Fix issues and try again.

### Before pushing:

```bash
# Ensure all checks pass
npm run lint
npm run format
npm run typecheck

# Run tests locally
npm test
```

---

## 🐳 Docker Development

Test in Docker to ensure consistency with CI:

```bash
# Build and run tests in Docker
docker-compose up test

# View test results
open test-results/  # or explore in your file system
```

---

## 📊 Page Object Model Architecture

### Creating a new page object:

```typescript
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { SELECTORS_BY_TESTID } from '../utils/selectors';

export interface IMyPage {
  navigate(): Promise<void>;
  fillField(value: string): Promise<void>;
  submitForm(): Promise<void>;
}

export class MyPage extends BasePage implements IMyPage {
  constructor(page: Page) {
    super(page);
  }

  async navigate(): Promise<void> {
    await this.goto('/my-page');
    await this.waitForPageLoad();
  }

  async fillField(value: string): Promise<void> {
    await this.getByTestId(SELECTORS_BY_TESTID.myPage.field).fill(value);
  }

  async submitForm(): Promise<void> {
    await this.getByRole('button', { name: /submit/i }).click();
  }
}
```

---

## 🔍 API Testing

API tests use **schema validation** with JSON schemas:

```typescript
import { test, expect } from '@playwright/test';
import { apiHelper } from '../src/utils/apiHelper';

test('Get user by ID', async () => {
  // Automatically validates response against user.schema.json
  const user = await apiHelper.getUser(1);

  expect(user).toHaveProperty('id');
  expect(user).toHaveProperty('name');
  expect(user).toHaveProperty('email');
});
```

---

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Page Object Model Best Practices](https://playwright.dev/docs/pom)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ESLint Configuration](https://eslint.org/docs/rules/)
- [Prettier Documentation](https://prettier.io/docs/)

---

## ❓ Questions or Issues?

- Check [GitHub Issues](https://github.com/your-org/playwright-framework/issues)
- Review existing test examples
- Refer to Playwright documentation

---

## 📋 Checklist before submitting PR

- [ ] Branch created from `main` or `develop`
- [ ] All tests pass locally: `npm test`
- [ ] Linting passes: `npm run lint`
- [ ] Code formatted: `npm run format`
- [ ] TypeScript compiles: `npm run typecheck`
- [ ] Commit messages follow conventional format
- [ ] PR description explains changes
- [ ] No debug code or console logs
- [ ] Related tests added/updated
- [ ] Documentation updated if needed

---

Thanks for contributing! 🎉
