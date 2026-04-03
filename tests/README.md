# Test Suite Structure

## Active Shared Suites

- `tests/shared/auth`: Shared authentication fixture and storage-state coverage
- `tests/shared/api`: Shared API coverage and API health checks

## App-Specific Suites

- `tests/saucedemo/01-auth`: SauceDemo negative and edge-case authentication coverage
- `tests/saucedemo/smoke`: Fast SauceDemo happy-path login and shell coverage
- `tests/saucedemo/regression`: Broader SauceDemo flows
- `tests/saucedemo/04-accessibility-testing`: SauceDemo accessibility coverage
- `tests/saucedemo/05-performance-testing`: SauceDemo performance coverage
- `tests/saucedemo/06-visual-regression`: SauceDemo visual regression coverage
- `tests/cura/01-auth`: CURA negative and edge-case authentication coverage
- `tests/cura/smoke`: Fast CURA happy-path smoke coverage
- `tests/cura/regression`: Broader CURA appointment flows
- `tests/cura/04-accessibility-testing`: CURA accessibility coverage
- `tests/cura/05-performance-testing`: CURA performance coverage
- `tests/orangehrm/01-auth`: OrangeHRM negative and edge-case authentication coverage
- `tests/orangehrm/smoke`: OrangeHRM happy-path smoke coverage
- `tests/orangehrm/04-accessibility-testing`: OrangeHRM accessibility coverage
- `tests/orangehrm/05-performance-testing`: OrangeHRM performance coverage
- `tests/orangehrm/06-visual-regression`: OrangeHRM visual regression coverage

## Archived App Coverage

- `tests/templates/apps/vwo.com/01-auth`: Archived VWO auth template kept for future reactivation when valid org-owned credentials are available

## Numbered Templates

- `tests/templates/01-fundamentals`: Login and setup templates
- `tests/templates/02-interactions`: UI interaction templates
- `tests/templates/03-test-organization`: Naming and organization templates
- `tests/templates/04-advanced-features`: Search and realtime templates
- `tests/templates/05-page-object-model`: Generic POM templates
- `tests/templates/06-api-testing`: API testing templates
- `tests/templates/07-smoke-testing`: Smoke-testing templates
- `tests/templates/08-performance-testing`: Performance-testing templates
- `tests/templates/09-accessibility-testing`: Accessibility-testing templates
- `tests/templates/10-visual-regression`: Visual-regression templates

## Suite Intent

- `01-auth` suites focus on negative-path and validation coverage so they do not duplicate smoke login tests.
- `smoke` suites own the fast happy-path login and shell checks used for quick confidence.

## Reporting Conventions

- App-specific suite runs should use `scripts/run-app-suite.cjs`
- HTML reports are written to `playwright-report/<app>/<suite>`
- JSON reports are written to `test-results/json/<app>-<suite>.json`
- JUnit reports are written to `test-results/junit/<app>-<suite>.xml`
- Playwright attachments are written to `test-results/artifacts/<app>/<suite>`
- Visual snapshot baselines live alongside the owning visual suite under `*-snapshots/`
- Use `npm run test:visual:update` to refresh SauceDemo visual baselines on the current platform
- Template files are stored as `*.template.ts` so Playwright does not execute them
