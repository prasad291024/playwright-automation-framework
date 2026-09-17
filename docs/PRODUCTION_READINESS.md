# Production Readiness Checklist

This checklist defines the operational, architectural, and quality standards required to certify the Playwright UI Automation Framework for production-grade CI/CD and regression execution.

---

## 1. Code Quality & Static Analysis Gates

All core framework and test code must satisfy automated quality checks:

- [ ] **TypeScript Strict Compilation**: `npm run typecheck` (`tsc --noEmit`) passes with zero compiler errors.
- [ ] **ESLint Static Analysis**: `npm run lint` passes with no errors or unhandled warnings.
- [ ] **Code Formatting**: `npm run format:check` verifies that all TypeScript, JSON, and Markdown files comply with Prettier rules.
- [ ] **Pre-Commit Enforcement**: Husky (v9.1.7) and `lint-staged` are active and prevent unformatted or lint-failing commits.
- [ ] **Pre-Push Validation**: `npm run pre-push` (`npm run lint && npm run typecheck`) executes cleanly.
- [ ] **Code Cleanliness**: Zero temporary `console.log`, `page.pause()`, or `.only` test filters exist in the codebase.

---

## 2. Multi-App Architecture & Suite Verification

Active application suites must be verified across their designated test scopes:

### SauceDemo E-Commerce

- [ ] `01-auth` suite passes: `node scripts/run-app-suite.cjs --app=saucedemo --suite=auth`
- [ ] `smoke` suite passes: `node scripts/run-app-suite.cjs --app=saucedemo --suite=smoke`
- [ ] `regression` suite passes: `node scripts/run-app-suite.cjs --app=saucedemo --suite=regression`
- [ ] `04-accessibility-testing` suite verified: `node scripts/run-app-suite.cjs --app=saucedemo --suite=accessibility`
- [ ] `05-performance-testing` suite verified: `node scripts/run-app-suite.cjs --app=saucedemo --suite=performance`
- [ ] `06-visual-regression` baselines established: `node scripts/run-app-suite.cjs --app=saucedemo --suite=visual`

### CURA Healthcare Service

- [ ] `01-auth` suite passes: `node scripts/run-app-suite.cjs --app=cura --suite=auth`
- [ ] `smoke` suite passes: `node scripts/run-app-suite.cjs --app=cura --suite=smoke`
- [ ] `regression` suite passes: `node scripts/run-app-suite.cjs --app=cura --suite=regression`
- [ ] `04-accessibility-testing` suite verified: `node scripts/run-app-suite.cjs --app=cura --suite=accessibility`
- [ ] `05-performance-testing` suite verified: `node scripts/run-app-suite.cjs --app=cura --suite=performance`
- [ ] `06-visual-regression` baselines established: `node scripts/run-app-suite.cjs --app=cura --suite=visual`

### OrangeHRM Enterprise HRMS

- [ ] `01-auth` suite passes: `node scripts/run-app-suite.cjs --app=orangehrm --suite=auth`
- [ ] `smoke` suite passes: `node scripts/run-app-suite.cjs --app=orangehrm --suite=smoke`
- [ ] `regression` suite passes: `node scripts/run-app-suite.cjs --app=orangehrm --suite=regression`
- [ ] `04-accessibility-testing` suite verified: `node scripts/run-app-suite.cjs --app=orangehrm --suite=accessibility`
- [ ] `05-performance-testing` suite verified: `node scripts/run-app-suite.cjs --app=orangehrm --suite=performance`
- [ ] `06-visual-regression` baselines established: `node scripts/run-app-suite.cjs --app=orangehrm --suite=visual`

### Shared Framework Services

- [ ] Shared auth session tests pass: `node scripts/run-app-suite.cjs --app=saucedemo --suite=shared-auth`
- [ ] Shared API contract tests pass: `node scripts/run-app-suite.cjs --app=local --suite=shared-api`
- [ ] JSON schema validation passes against all schemas in `schemas/`

---

## 3. Anti-Flakiness & Reliability Verification

- [ ] **No Hardcoded Delays**: The entire test suite contains zero instances of `page.waitForTimeout()`.
- [ ] **Web-First Matchers**: All assertions use auto-retrying matchers (`await expect(...).toBeVisible()`).
- [ ] **Locator Resilience**: All page objects prioritize `data-testid` and ARIA roles over fragile CSS classes or XPath.
- [ ] **Network Synchronization**: Dynamic network wait strategies (`waitForNetworkStable`, `waitForLoadState('networkidle')`) are used for asynchronous transitions.
- [ ] **Test Idempotency**: Tests can be re-run indefinitely without manual state cleanup.

---

## 4. Authentication & Storage State Management

- [ ] **Storage State Generation**: `scripts/prepare-storage-states.ts` runs cleanly and generates valid session files:
  - `storage-state/saucedemo.json`
  - `storage-state/cura.json`
  - `storage-state/orangehrm.json`
- [ ] **Session Reuse**: Authenticated test suites successfully leverage cached storage states via `src/core/fixtures/auth.fixture.ts`.
- [ ] **Negative Auth Isolation**: Unauthenticated tests explicitly clear cookies/state (`test.use({ storageState: { cookies: [], origins: [] } })`).
- [ ] **Storage State Bypass**: Framework supports `SKIP_GLOBAL_AUTH_SETUP=1` for debugging.

---

## 5. CI/CD Pipeline & Containerization

### GitHub Actions (`.github/workflows/ci.yml`)

- [ ] Pipeline runs on Node.js 20.
- [ ] Pull Request matrix runs smoke scope in under 5 minutes.
- [ ] Full CI push matrix completes all functional suites with zero failures.
- [ ] Concurrency controls are active (`cancel-in-progress: true`).
- [ ] CI retries are configured (`PLAYWRIGHT_RETRIES=2` in CI).
- [ ] Artifacts (HTML report, JSON, JUnit XML) are retained for 30 days.

### Jenkins Pipeline (`Jenkinsfile.docker`)

- [ ] Pipeline passes using `mcr.microsoft.com/playwright:v1.56.1-noble`.
- [ ] Parameterized execution (`TEST_SCOPE`, `PLAYWRIGHT_PROJECT`, `APP`) verified.
- [ ] HTML reports and JUnit XML results are published.
- [ ] Slack notifications trigger on success and failure.

### Docker Environment

- [ ] `Dockerfile` builds successfully without warnings.
- [ ] `docker compose run test` executes tests headlessly in container.
- [ ] Output directories (`test-results/`, `playwright-report/`) mount correctly without permission errors.

---

## 6. Secrets & Security Configuration

- [ ] **Zero Hardcoded Secrets**: No passwords, API keys, or personal credentials committed in Git.
- [ ] **Git Exclusion**: `.env`, `.env.local`, and `storage-state/` are properly listed in `.gitignore`.
- [ ] **CI Secrets Configured**: GitHub Actions secrets configured:
  - `CURA_USERNAME`, `CURA_PASSWORD`
  - `ORANGEHRM_USERNAME`, `ORANGEHRM_PASSWORD`
  - `SAUCEDEMO_USERNAME`, `SAUCEDEMO_PASSWORD`
- [ ] **Dependency Audit**: `npm audit` shows zero critical or high vulnerabilities.

---

## 7. Reporting & Triage Capabilities

- [ ] **Segmented HTML Reports**: HTML reports are generated per app and suite under `playwright-report/<app>/<suite>/index.html`.
- [ ] **JUnit XML Generation**: Valid JUnit XML generated at `test-results/junit/<app>-<suite>.xml` for CI aggregation.
- [ ] **JSON Results Generation**: JSON reports generated at `test-results/json/<app>-<suite>.json`.
- [ ] **Artifact Capture on Failure**: Screenshots (`only-on-failure`), videos (`retain-on-failure`), and traces (`on-first-retry`) captured and archived.

---

## 8. Documentation Alignment

- [ ] [`docs/FRAMEWORK_GUIDE.md`](./FRAMEWORK_GUIDE.md) reflects current architecture, App Facades, and utilities.
- [ ] [`docs/TEST_STRATEGY.md`](./TEST_STRATEGY.md) accurately defines the PR and Full CI execution matrices.
- [ ] [`docs/CONTRIBUTING.md`](./CONTRIBUTING.md) reflects multi-app workflow, runner commands, and PR checklist.
- [ ] [`docs/DEPLOYMENT.md`](./DEPLOYMENT.md) accurately details GitHub Actions, Jenkins Docker, and container setups.
- [ ] [`docs/CODE_REVIEW.md`](./CODE_REVIEW.md) outlines mandatory reviewer checks and Playwright standards.
- [ ] [`docs/ONBOARDING.md`](./ONBOARDING.md) provides a clean entry point and learning track for new engineers.

---

## Production Certification Sign-Off

| Role                      | Name / Title | Date | Status       |
| ------------------------- | ------------ | ---- | ------------ |
| **QA / Automation Lead**  |              |      | [ ] APPROVED |
| **Tech Lead / Architect** |              |      | [ ] APPROVED |
| **DevOps / CI Engineer**  |              |      | [ ] APPROVED |
