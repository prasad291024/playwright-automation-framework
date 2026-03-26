# Test Suite Structure

## Shared Framework Suites

- `01-fundamentals`: Basic login and setup tests
- `02-interactions`: UI navigation and element visibility
- `03-test-organization`: Structure examples and naming patterns
- `04-advanced-features`: Search, realtime, and advanced UI behavior
- `05-page-object-model`: Shared POM and authenticated session examples
- `06-api-testing`: REST API validations
- `07-smoke-testing`: Cross-app smoke coverage
- `08-performance-testing`: Shared performance checks
- `09-accessibility-testing`: Shared accessibility checks
- `10-visual-regression`: Shared visual checks

## App-Specific Suites

- `tests/saucedemo/smoke`: Fast SauceDemo login and happy-path coverage
- `tests/saucedemo/regression`: Broader SauceDemo flows
- `tests/cura/01-auth`: CURA authentication-specific coverage
- `tests/cura/smoke`: Fast CURA smoke coverage
- `tests/cura/regression`: Broader CURA appointment flows
- `tests/cura/04-accessibility-testing`: CURA accessibility coverage
- `tests/cura/05-performance-testing`: CURA performance coverage
- `tests/orangehrm/smoke`: OrangeHRM smoke coverage
- `tests/vwo.com/01-auth`: VWO authentication coverage

## Reporting Conventions

- App-specific suite runs should use `scripts/run-app-suite.cjs`
- HTML reports are written to `playwright-report/<app>/<suite>`
- JSON reports are written to `test-results/json/<app>-<suite>.json`
- JUnit reports are written to `test-results/junit/<app>-<suite>.xml`
- Playwright attachments are written to `test-results/artifacts/<app>/<suite>`
