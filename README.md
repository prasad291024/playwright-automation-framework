# Playwright Automation Framework

A hybrid end-to-end testing framework built with **Playwright** and **TypeScript**, combining Page Object Model (POM), Data-Driven Testing, and Modular Architecture.

---

## 🚀 Features

- ✅ Page Object Model for clean UI abstraction
- ✅ Data-driven test execution using external JSON files
- ✅ Modular folder structure for scalability
- ✅ Multi-browser support (Chromium, Firefox, WebKit)
- ✅ Environment-based configuration via `.env`
- ✅ Global setup and teardown for session management
- ✅ HTML, JSON, and list reporters
- ✅ CI-ready structure

---

## 📁 Folder Structure

```
├── src/
│   ├── pages/             # Page Object classes
│   ├── utils/             # Utility functions
│   ├── interface/         # TypeScript interfaces
│   └── fixture/           # Static test data
├── tests/                 # Organized test suites
├── test-data/             # External data files
├── selectors/             # Centralized selectors
├── globals/               # Global setup/teardown
├── storage-state/         # Saved login/session state
├── screenshots/           # Failure screenshots
├── helpers/               # Shared helper functions
├── playwright.config.ts   # Playwright configuration
├── tsconfig.json          # TypeScript configuration
├── .env                   # Environment variables
├── .gitignore             # Git exclusions
```

---

## 🧪 Getting Started

```bash
# Install dependencies
npm install

# Run tests
npx playwright test

# View HTML report
npx playwright show-report
```

---

## ⚙️ Environment Setup

Create a `.env` file in the project root:

```
BASE_URL=https://your-app-url.com
USERNAME=your_username
PASSWORD=your_password
```

---

## 🔒 Code Quality

This framework enforces code quality through **ESLint**, **Prettier**, and **Type Checking**:

```bash
# Check for linting issues
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code to style standards
npm run format

# Validate TypeScript types
npm run typecheck
```

### Pre-commit Hooks

**Husky** + **lint-staged** automatically run code quality checks before committing:

- ESLint fixes on `*.ts` files
- Prettier formats code and JSON/Markdown files
- Commits are rejected if checks fail

No configuration needed—hooks run automatically on `git commit`.

---

## 🤖 Continuous Integration

GitHub Actions runs automated tests on every push and PR:

- **Multi-browser testing:** Chromium, Firefox, WebKit
- **Multi-platform:** Ubuntu, Windows, macOS
- **Code quality gates:** ESLint, Prettier, TypeScript
- **Automated reports:** HTML test reports as artifacts

View workflow definitions in [`.github/workflows/`](.github/workflows/)

---

## 🐳 Docker Support

Run tests in a containerized environment for consistency across machines:

### Using Docker Compose

```bash
# Run tests in Docker
docker-compose up test

# Run tests with headed browser (requires X11/display support)
docker-compose --profile headed up test-headed

# Build Docker image only
docker-compose build
```

### Manual Docker Commands

```bash
# Build the image
docker build -t playwright-tests .

# Run tests
docker run --rm -v $(pwd)/test-results:/app/test-results playwright-tests

# Run with specific browser
docker run --rm playwright-tests npm test -- --project=chromium
```

### Dockerfile Features

- Playwright pre-installed with all browsers and dependencies
- Node.js 18 environment
- Automatic browser download disabled (`PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1`)
- Volume mounts for test results and reports
- CI mode environment variables pre-configured

---

## 📦 Scripts

```bash
# Testing
npm run test           # Run all tests (headless)
npm run test:headed    # Run tests with browser UI visible

# Code Quality
npm run lint           # Check code style with ESLint
npm run lint:fix       # Auto-fix linting issues
npm run format         # Format code with Prettier
npm run typecheck      # Validate TypeScript types
```

---

## 📸 Reporting

- **HTML report:** `playwright-report/`
- **JSON report:** `test-results/results.json`
- **Screenshots/videos:** captured automatically on failure

---

## 🧼 Git Hygiene

`.gitignore` excludes:

```
node_modules/
.env
test-results/
playwright-report/
storage-state/
screenshots/
```

---

## 🧱 Example Test

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';

test('Verify valid user login', async ({ page }) => {
  const login = new LoginPage(page);
  await login.navigate();
  await login.login('user@example.com', 'password123');
  await expect(page).toHaveURL(/dashboard/);
});
```

---

## 👤 Author

Developed by **Prasad**, Software Test Engineer, passionate about test automation and framework design.

```

---




```

---

## 🔗 Resources

- [Playwright Docs](https://playwright.dev/docs/intro)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Node.js](https://nodejs.org/en/docs/)

```

---


```
