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

## 📦 Scripts

```bash
npm run test       # Run all tests
npm run lint       # Lint code (if configured)
npm run format     # Format code (if configured)
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


