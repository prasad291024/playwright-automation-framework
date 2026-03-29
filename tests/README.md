# Test Suite Structure

## Active Shared Suites

- `tests/shared/auth`: Shared authentication fixture and storage-state coverage
- `tests/shared/api`: Shared API coverage and API health checks

## App-Specific Suites

- `tests/saucedemo/01-auth`: SauceDemo authentication and login-data coverage
- `tests/saucedemo/smoke`: Fast SauceDemo login and happy-path coverage
- `tests/saucedemo/regression`: Broader SauceDemo flows
- `tests/cura/01-auth`: CURA authentication-specific coverage
- `tests/cura/smoke`: Fast CURA smoke coverage
- `tests/cura/regression`: Broader CURA appointment flows
- `tests/cura/04-accessibility-testing`: CURA accessibility coverage
- `tests/cura/05-performance-testing`: CURA performance coverage
- `tests/orangehrm/01-auth`: OrangeHRM authentication and login-data coverage
- `tests/orangehrm/smoke`: OrangeHRM smoke coverage
- `tests/vwo.com/01-auth`: VWO authentication coverage

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

## Reporting Conventions

- App-specific suite runs should use `scripts/run-app-suite.cjs`
- HTML reports are written to `playwright-report/<app>/<suite>`
- JSON reports are written to `test-results/json/<app>-<suite>.json`
- JUnit reports are written to `test-results/junit/<app>-<suite>.xml`
- Playwright attachments are written to `test-results/artifacts/<app>/<suite>`
- Template files are stored as `*.template.ts` so Playwright does not execute them
