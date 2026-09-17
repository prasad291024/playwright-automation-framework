# Code Review Checklist & Standards

This checklist establishes code quality, architectural consistency, and Playwright best practices across the UI Automation Framework.

---

## 1. Pre-Merge Quality Gates (Author Checklist)

### Automated Verification

Before submitting or requesting review on a pull request, the author must confirm that all automated checks pass locally:

- [ ] **Typecheck**: `npm run typecheck` (`tsc --noEmit`) passes with zero errors.
- [ ] **Lint**: `npm run lint` (`eslint . --ext .ts`) passes with zero warnings or errors.
- [ ] **Format**: `npm run format:check` (`prettier --check .`) confirms all files follow Prettier formatting.
- [ ] **Test Execution**: Targeted app suites pass using `node scripts/run-app-suite.cjs --app=<app> --suite=<suite>`.
- [ ] **Clean Commits**: No `console.log`, `test.only`, or temporary debugging pauses left in committed code.

---

## 2. Multi-App Architecture & Organization

Verify that the code complies with the multi-application framework design:

### Folder Structure & Naming

- [ ] **Page Objects**: App-specific page objects are placed in `src/pages/apps/{app}/pages/` (e.g. `src/pages/apps/saucedemo/pages/SauceDemoLoginPage.ts`).
- [ ] **App Facades**: High-level workflows are exposed through the app facade in `src/apps/{app}/{App}App.ts` (e.g. `SauceDemoApp`, `CuraApp`, `OrangeHrmApp`).
- [ ] **Test Suites**: Tests are categorized under `tests/{app}/{suite-type}/` matching one of the standard 6 suite types:
  - `01-auth/`: Negative-path authentication and credential boundary validation.
  - `smoke/`: Fast happy-path login and shell checks.
  - `regression/`: Complete end-to-end workflows.
  - `04-accessibility-testing/`: Accessibility audits.
  - `05-performance-testing/`: Timing and performance audits.
  - `06-visual-regression/`: Pixel-diff screenshot comparisons.
- [ ] **Shared Suites**: Cross-application tests live under `tests/shared/auth` or `tests/shared/api`.
- [ ] **Templates**: Educational or reference examples live in `tests/templates/` and use the `*.template.ts` naming convention so Playwright ignores them during active runs.
- [ ] **Suite Registry**: If adding a new suite or app, `config/apps.json` and `config/test-suites.json` are properly updated.

---

## 3. Page Object Model & Locator Standards

### BasePage Inheritance

- [ ] Page objects extend `BasePage` from `src/pages/base/BasePage.ts` and pass the typed `AppName`.
- [ ] Page classes implement relevant contracts from `src/interface/pages.interface.ts` where applicable.
- [ ] Navigation methods implement `goto()` or `waitForPageLoad()`.

### Locator Priority Strategy

- [ ] Selectors adhere to the resilient locator hierarchy:
  1. `getByTestId('...')` (Preferred for custom UI components)
  2. `getByRole('...', { name: ... })` (Preferred for accessible semantic elements)
  3. `getByPlaceholder('...')` (For text input fields)
  4. `getByText('...')` (For static labels and alerts)
  5. `locator('css')` (Fallback only when semantic locators are impossible)
- [ ] No fragile XPath locators (e.g. `/html/body/div[2]/div[1]/button`).
- [ ] No hardcoded selectors inside test files; all locators are encapsulated inside page objects or `src/utils/selectors.ts`.

---

## 4. Playwright Anti-Flakiness & Reliability

### Assertions

- [ ] **Web-First Assertions**: All UI assertions use Playwright's retrying matchers:

  ```typescript
  // ✅ GOOD: Automatically retries until timeout
  await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();

  // ❌ BAD: Evaluates once and fails immediately
  expect(await page.getByRole('button', { name: 'Submit' }).isVisible()).toBeTruthy();
  ```

- [ ] Negative assertions use retrying matchers: `await expect(locator).toBeHidden()` or `await expect(locator).not.toBeVisible()`.

### Timing & Synchronization

- [ ] **No Hardcoded Sleeps**: `page.waitForTimeout()` is strictly prohibited in production tests.
- [ ] Dynamic wait strategies are used instead:
  - `page.waitForURL(...)`
  - `locator.waitFor({ state: 'visible' })`
  - `waitForNetworkStable(page)` from `src/core/utils/waitUtils.ts`
  - `expectWithRetry` or `stableClick` from `src/utils/flakeHelper.ts` for flaky third-party components.

---

## 5. Fixtures, Auth & Session Reuse

- [ ] **Correct Fixture Selection**:
  - Unauthenticated tests (login error validation, shell checks) import `test` from `src/core/fixtures/test.fixture.ts`.
  - Authenticated tests (regression, smoke, dashboards) import `test` from `src/core/fixtures/auth.fixture.ts` and leverage `authenticatedPage` or authenticated App Facades.
- [ ] **Storage State Handling**:
  - Tests do not hardcode authentication credentials in tests.
  - Storage states are referenced via `storage-state/{app}.json` and managed through `src/core/auth/auth-session.ts`.
  - Negative auth tests override storage state with clean cookies:
    ```typescript
    test.use({ storageState: { cookies: [], origins: [] } });
    ```

---

## 6. API Testing & Schema Validation

- [ ] API requests use `ApiHelper` (`src/utils/apiHelper.ts`).
- [ ] Response payloads are validated against JSON Schemas in `schemas/` using `schemaValidator.validateOrThrow(...)`.
- [ ] TypeScript interfaces in `src/interface/api.interface.ts` match the JSON schemas.
- [ ] Negative API status codes (400, 401, 404, 500) are explicitly asserted.

---

## 7. Reviewer Checklist

When reviewing a pull request, evaluate:

### Code Maintainability

- [ ] Does this PR add unnecessary technical debt or code duplication?
- [ ] Could existing utilities (`randomUtils`, `waitUtils`, `flakeHelper`) be used instead of new custom functions?
- [ ] Are variable names and test descriptions clear and self-documenting?

### Test Independence

- [ ] Can the new tests run in isolation?
- [ ] Do tests clean up any created state or operate idempotently?
- [ ] Will tests pass if executed in parallel workers?

### Security & Secrets

- [ ] Are any passwords, API tokens, or real user emails committed in code?
- [ ] Are all credentials sourced from environment variables or `test-data/users.ts`?

---

## 8. Approval & Merge Policy

| Change Type                       | Required Approvals                      | Required CI Checks                        |
| --------------------------------- | --------------------------------------- | ----------------------------------------- |
| **Documentation Only**            | 1 Reviewer                              | Lint & Format checks                      |
| **Test Addition / Modification**  | 1 Reviewer (QA / SDET)                  | Lint, Typecheck, PR Smoke Suites          |
| **Framework Core / Architecture** | 2 Reviewers (including Lead/Maintainer) | Full CI Suite Matrix                      |
| **CI / Docker / Infrastructure**  | 1 Maintainer Approval                   | Full CI Pipeline + Container verification |
