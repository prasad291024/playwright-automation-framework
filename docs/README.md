# 🎭 Playwright Automation Framework

A **TypeScript-based Playwright automation framework** demonstrating how end-to-end test automation can be structured for **maintainability, reliability, scalability, and fast feedback**.

The framework brings together:

- **Page Object Model** for maintainable UI interactions
- **Fixtures & authentication** for reusable test setup and session management
- **Cross-browser & parallel execution** for scalable test execution
- **Test data & environment configuration** for repeatable automation
- **Visual, accessibility & performance testing** for broader quality coverage
- **Failure diagnostics & reporting** for faster investigation
- **Docker, GitHub Actions & Jenkins** for CI/CD execution

> **Portfolio note:** This repository is an engineering demonstration of automation architecture and quality practices. It is not a representation of any specific employer's production test framework.



## 🎯 What This Project Demonstrates

This framework focuses on the engineering practices required to build maintainable and reliable test automation systems.

| Area | What It Demonstrates |
|---|---|
| 🧩 **Framework Architecture** | Separation of tests, Page Objects, fixtures, helpers, configuration, and test data |
| 🔐 **Authentication & Sessions** | Reusable authentication setup and storage-state based session management |
| 🌐 **Cross-Browser Execution** | Configurable execution across Chromium, Firefox, and WebKit |
| ⚡ **Parallel Execution** | Configurable workers with attention to isolation, shared state, and environment capacity |
| 🧪 **Test Strategy** | Smoke, regression, authentication, accessibility, performance, and visual testing |
| 📊 **Diagnostics & Reporting** | HTML, JSON, JUnit, screenshots, traces, videos, logs, and other artifacts |
| 🐳 **Containerization** | Docker-based test execution |
| 🔄 **CI/CD** | GitHub Actions and Jenkins integration |
| 🔍 **Reliability Engineering** | Failure investigation, synchronization, test-data, environment, and flaky-test considerations |



## 💡 Why This Framework?

The goal of this project is to demonstrate how a Playwright test suite can evolve into a maintainable automation framework with clear separation of responsibilities.

The framework focuses on:

- **Maintainability** — reusable components and clear ownership between tests, pages, fixtures, helpers, and configuration
- **Reliability** — predictable synchronization, controlled test data, isolated browser contexts, and failure diagnostics
- **Scalability** — support for multiple applications, suites, browsers, and configurable execution
- **Developer Feedback** — useful reports and artifacts that make failures easier to investigate
- **Continuous Testing** — integration with CI/CD pipelines for repeatable automated execution

The project is intentionally structured as a portfolio and engineering demonstration rather than representing a production system from a specific organization.



## 🏗️ Framework Architecture

The framework separates **business-level test scenarios** from **UI interaction, reusable setup, supporting utilities, and execution infrastructure**.

```text
                         TEST LAYER
        ┌─────────────────────────────────────────┐
        │ Test Suites                             │
        │ Business Scenarios + Assertions         │
        └────────────────────┬────────────────────┘
                             │
                             ▼
                    FIXTURE / SETUP LAYER
        ┌─────────────────────────────────────────┐
        │ Authentication · Context · Test Setup   │
        │ Storage State · Reusable Fixtures       │
        └────────────────────┬────────────────────┘
                             │
                             ▼
                       PAGE OBJECT LAYER
        ┌─────────────────────────────────────────┐
        │ Page Objects                            │
        │ Locators + UI Interactions              │
        └────────────────────┬────────────────────┘
                             │
                             ▼
                     SUPPORTING LAYER
        ┌─────────────────────────────────────────┐
        │ Helpers · API Utilities · Test Data     │
        │ Common Operations · Environment Values  │
        └────────────────────┬────────────────────┘
                             │
                             ▼
                      EXECUTION LAYER
        ┌─────────────────────────────────────────┐
        │ Playwright Config                       │
        │ Browsers · Workers · Retries · Reports  │
        │ Docker · GitHub Actions · Jenkins       │
        └─────────────────────────────────────────┘


```

Then leave a blank line and continue with:

```markdown
### Architectural Principles

- **Tests** describe business scenarios and assertions rather than low-level UI implementation.
- **Page Objects** encapsulate locators and reusable UI interactions.
- **Fixtures** provide reusable authentication, browser context, and test setup.
- **Helpers** contain reusable operations that do not belong to a specific page.
- **Environment configuration** keeps environment-specific values separate from test logic.
- **Playwright configuration** controls browsers, workers, retries, timeouts, reporters, and execution behavior.
- **CI/CD** provides repeatable automated execution and preserves useful test artifacts for investigation.



## 🚀 Framework Capabilities

| Capability | Implementation |
|---|---|
| **Browser Automation** | Playwright with configurable browser projects |
| **Page Object Model** | Dedicated page classes for reusable UI interactions |
| **Test Fixtures** | Reusable authentication, browser context, and test setup |
| **Session Management** | Storage-state based authentication and session reuse |
| **Parallel Execution** | Configurable Playwright workers |
| **Cross-Browser Testing** | Chromium, Firefox, and WebKit support |
| **Test Data Management** | Environment-aware and reusable test data |
| **API Validation** | Shared API utilities and API health checks |
| **Visual Regression** | Screenshot-based visual validation with baselines |
| **Accessibility Testing** | Dedicated accessibility test suites |
| **Performance Testing** | Dedicated performance-oriented test suites |
| **Failure Diagnostics** | Screenshots, traces, videos/logs and test reports |
| **Reporting** | HTML, JSON and JUnit reporting |
| **Containerization** | Docker-based execution |
| **CI/CD** | GitHub Actions and Jenkins integration |
| **Multi-Application Support** | SauceDemo, CURA Healthcare and OrangeHRM suites |


## 📁 Project Structure

```text
playwright-automation-framework/
│
├── .github/                  # GitHub Actions workflows
├── .husky/                   # Git hooks
├── config/                   # Environment and execution configuration
├── docs/                     # Framework and testing documentation
├── globals/                  # Shared global definitions
├── helpers/                  # Reusable helper utilities
├── jenkins/                  # Jenkins-related configuration
├── schemas/                  # Data/schema definitions
├── scripts/                  # Test execution and utility scripts
├── selectors/                # Shared selectors
├── src/
│   ├── pages/                # Page Object implementations
│   ├── fixtures/             # Reusable Playwright fixtures
│   ├── helpers/              # Framework-level helpers
│   ├── environment/          # Environment-specific configuration
│   └── tests/                # Application test suites
│
├── test-data/                # Test data
├── tests/                    # Executable test suites and templates
│
├── Dockerfile
├── docker-compose.yml
├── Jenkinsfile.docker
├── playwright.config.ts
├── package.json
└── README.md
```

### Test Organization

Application-specific tests are organized by application and test intent, with shared authentication and API coverage separated from application-specific suites.

```text
tests/
├── shared/
│   ├── auth/
│   └── api/
│
├── saucedemo/
│   ├── 01-auth/
│   ├── smoke/
│   ├── regression/
│   ├── 04-accessibility-testing/
│   ├── 05-performance-testing/
│   └── 06-visual-regression/
│
├── cura/
│   ├── 01-auth/
│   ├── smoke/
│   ├── regression/
│   ├── 04-accessibility-testing/
│   ├── 05-performance-testing/
│   └── 06-visual-regression/
│
└── orangehrm/
    ├── 01-auth/
    ├── smoke/
    ├── regression/
    ├── 04-accessibility-testing/
    ├── 05-performance-testing/
    └── 06-visual-regression/
```

Template and learning/reference examples are maintained separately under:

```text
tests/templates/
```

Template files use the `*.template.ts` convention so they are not executed as active test coverage.


## 🚀 Getting Started

### Prerequisites

- Node.js
- npm
- Git
- Playwright browser dependencies

For containerized execution:

- Docker

### Installation

Clone the repository:

```bash
git clone https://github.com/prasad291024/playwright-automation-framework.git

cd playwright-automation-framework
```

Install dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

### Environment Configuration

Create the required environment configuration based on the provided example:

```bash
cp .env.example .env
```

Update the environment-specific values as required.

> Never commit credentials, tokens, or other secrets to the repository.

### Run Tests

Run the default test suite:

```bash
npx playwright test
```

Run tests with the Playwright UI:

```bash
npx playwright test --ui
```

Run a specific browser project:

```bash
npx playwright test --project=chromium
```

Run tests with a specific number of workers:

```bash
npx playwright test --workers=1
```

### View the HTML Report

```bash
npx playwright show-report
```

For application-specific execution, use the repository's suite runner:

```bash
node scripts/run-app-suite.cjs --app=saucedemo --suite=smoke
```

Replace the application and suite values according to the supported test suites.



## 🔄 CI/CD & Execution

The framework supports automated test execution through both **GitHub Actions** and **Jenkins**.

### GitHub Actions

The repository includes workflows for automated validation and test execution, including:

- Dependency installation
- Code quality checks
- Type checking
- Test execution
- Configurable test scopes
- Test reporting
- Artifact collection

Pull-request and push workflows can use different execution scopes so that faster feedback can be obtained during development while broader suites can be executed when required.



### Jenkins

Jenkins execution is supported through the repository's Jenkins configuration and Docker-based execution flow.

The pipeline supports configurable execution parameters such as:

- Application
- Browser
- Test scope
- Execution timeout
- Test reports and artifacts

### Execution Strategy

The framework supports configurable parallel execution through Playwright workers.

Parallel execution can reduce feedback time, but the optimal worker count depends on factors such as:

- Test-data isolation
- Shared application state
- Environment capacity
- API and database contention
- CI runner resources

The goal is therefore not simply to maximize the number of workers, but to balance **execution speed with test reliability**.



### Jenkins

Jenkins execution is supported through the repository's Jenkins configuration and Docker-based execution flow.

The pipeline supports configurable execution parameters such as:

- Application
- Browser
- Test scope
- Execution timeout
- Test reports and artifacts

### Execution Strategy

The framework supports configurable parallel execution through Playwright workers.

Parallel execution can reduce feedback time, but the optimal worker count depends on factors such as:

- Test-data isolation
- Shared application state
- Environment capacity
- API and database contention
- CI runner resources

The goal is therefore not simply to maximize the number of workers, but to balance **execution speed with test reliability**.




## 🧪 Test Strategy & Suite Organization

See `docs/TEST_STRATEGY.md` for CI scope, suite ownership rules, and rollout guidance.

### Shared Suites

- `tests/shared/auth`: Shared authentication fixture and storage-state coverage
- `tests/shared/api`: Shared API coverage and API health checks

### Application-Specific Suites

Each supported app owns its own runnable suites under `tests/<app>/...`:

**SauceDemo:**

- `tests/saucedemo/01-auth`: SauceDemo negative and edge-case authentication coverage
- `tests/saucedemo/smoke`: Fast SauceDemo happy-path login and shell coverage
- `tests/saucedemo/regression`: Broader SauceDemo flows
- `tests/saucedemo/04-accessibility-testing`: SauceDemo accessibility coverage
- `tests/saucedemo/05-performance-testing`: SauceDemo performance coverage
- `tests/saucedemo/06-visual-regression`: SauceDemo visual regression coverage

**CURA Healthcare:**

- `tests/cura/01-auth`: CURA negative and edge-case authentication coverage
- `tests/cura/smoke`: Fast CURA happy-path smoke coverage
- `tests/cura/regression`: Broader CURA appointment flows
- `tests/cura/04-accessibility-testing`: CURA accessibility coverage
- `tests/cura/05-performance-testing`: CURA performance coverage
- `tests/cura/06-visual-regression`: CURA visual regression coverage

**OrangeHRM:**

- `tests/orangehrm/01-auth`: OrangeHRM negative and edge-case authentication coverage
- `tests/orangehrm/smoke`: OrangeHRM happy-path smoke coverage
- `tests/orangehrm/regression`: Broader OrangeHRM flows
- `tests/orangehrm/04-accessibility-testing`: OrangeHRM accessibility coverage
- `tests/orangehrm/05-performance-testing`: OrangeHRM performance coverage
- `tests/orangehrm/06-visual-regression`: OrangeHRM visual regression coverage

### Template & Learning Suites

Reusable examples and learning/reference material are maintained separately under `tests/templates/`:

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
- `tests/templates/apps/vwo.com/01-auth`: Archived VWO auth template kept for future reactivation when valid org-owned credentials are available

Template files use `*.template.ts` so Playwright does not execute them as active coverage.

### Suite Intent

- `01-auth` suites focus on negative-path and validation coverage so they do not duplicate smoke login tests.
- `smoke` suites own the fast happy-path login and shell checks used for quick confidence.

### Reporting & Artifact Conventions

- App-specific suite runs should use `scripts/run-app-suite.cjs`
- HTML reports are written to `playwright-report/<app>/<suite>`
- JSON reports are written to `test-results/json/<app>-<suite>.json`
- JUnit reports are written to `test-results/junit/<app>-<suite>.xml`
- Playwright attachments are written to `test-results/artifacts/<app>/<suite>`
- Visual snapshot baselines live alongside the owning visual suite under `*-snapshots/`
- Use app-specific update commands to refresh visual baselines:
  - `node scripts/run-app-suite.cjs --app=saucedemo --suite=visual -u`
  - `node scripts/run-app-suite.cjs --app=cura --suite=visual -u`
  - `node scripts/run-app-suite.cjs --app=orangehrm --suite=visual -u`



## 🔍 Quality & Reliability

The framework is designed to make automation failures easier to reproduce, diagnose, and resolve.

### Failure Diagnostics

Test execution can preserve artifacts such as:

- Screenshots
- Playwright traces
- Videos
- HTML reports
- JSON reports
- JUnit reports
- Execution logs

These artifacts provide additional context when a test fails in local or CI execution.

### Flaky Test Investigation

Flaky failures should be investigated rather than hidden through repeated retries.

Common areas of investigation include:

- Locator stability
- Synchronization and dynamic application state
- Timeouts
- Authentication or session state
- Test-data dependencies
- Shared application state
- API or database dependencies
- CI/environment resource constraints

Retries can provide temporary resilience, but the underlying cause should be investigated when failures are reproducible or persistent.

### Parallel Execution Considerations

Parallel execution can improve feedback time, but tests need appropriate isolation.

Potential sources of instability include:

- Shared test data
- Race conditions
- Environment contention
- API/database limits
- Resource constraints on CI runners

The framework therefore treats parallelism as an execution strategy that must be balanced with reliability.





