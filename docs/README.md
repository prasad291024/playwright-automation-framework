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


[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev/)
[![CI](https://github.com/prasad291024/playwright-automation-framework/actions/workflows/ci.yml/badge.svg)](https://github.com/prasad291024/playwright-automation-framework/actions/workflows/ci.yml)
[![CodeQL](https://github.com/prasad291024/playwright-automation-framework/actions/workflows/codeql.yml/badge.svg)](https://github.com/prasad291024/playwright-automation-framework/actions/workflows/codeql.yml)


## 📚 Contents

- [What This Project Demonstrates](#-what-this-project-demonstrates)
- [Why This Framework](#-why-this-framework)
- [Framework Architecture](#-framework-architecture)
- [Framework Capabilities](#-framework-capabilities)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [CI/CD & Execution](#-cicd--execution)
- [Test Strategy & Suite Organization](#-test-strategy--suite-organization)
- [Quality & Reliability](#-quality--reliability)
- [Technology Stack](#️-technology-stack)



## 📌 Project Status

**Active engineering portfolio project**

This repository is continuously refined to demonstrate practical approaches to:

- Playwright-based test automation
- Framework architecture and maintainability
- Authentication and session management
- Cross-browser and parallel execution
- Test reliability and failure diagnostics
- Visual, accessibility, and performance testing
- CI/CD execution with GitHub Actions and Jenkins
- Containerized test execution

> The framework is intended as a public engineering demonstration and learning/reference project. It does not represent the internal automation framework or proprietary implementation of any employer.





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

A Playwright test suite can start as a collection of automated scenarios and gradually become difficult to maintain as applications, browsers, environments, and test coverage grow.

This project demonstrates an approach to managing that complexity through clear separation of responsibilities and reusable framework components.

### Engineering Goals

- **Maintainability** — keep test intent separate from UI implementation and framework infrastructure.
- **Reliability** — make failures easier to reproduce, diagnose, and resolve.
- **Scalability** — support multiple applications, test suites, browsers, and configurable execution.
- **Fast Feedback** — use appropriate execution strategies, reporting, and CI integration to shorten the feedback loop.
- **Reusability** — centralize authentication, session management, common utilities, and test-data handling.
- **Continuous Testing** — integrate automated execution into GitHub Actions and Jenkins workflows.

The project is intentionally structured as a **public engineering demonstration** rather than representing a production system from a specific organization.






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
### Architectural Principles

- **Tests** describe business scenarios and assertions rather than low-level UI implementation.
- **Page Objects** encapsulate locators and reusable UI interactions.
- **Fixtures** provide reusable authentication, browser context, and test setup.
- **Helpers** contain reusable operations that do not belong to a specific page.
- **Environment configuration** keeps environment-specific values separate from test logic.
- **Playwright configuration** controls browsers, workers, retries, timeouts, reporters, and execution behavior.
- **CI/CD** provides repeatable automated execution and preserves useful test artifacts for investigation.



## 🚀 Framework Capabilities

| Engineering Area | Implementation |
|---|---|
| **UI Automation** | Playwright with reusable Page Objects and configurable browser projects |
| **Test Architecture** | Page Object Model, fixtures, shared helpers, test-data separation, and application-specific suites |
| **Authentication & Sessions** | Reusable authentication setup and storage-state based session reuse |
| **Execution Engineering** | Configurable workers, retries, timeouts, browser projects, and execution scopes |
| **Cross-Browser Testing** | Chromium, Firefox, and WebKit support |
| **API Validation** | Shared API utilities and API health-check coverage |
| **Visual Testing** | Screenshot-based visual regression with baseline management |
| **Accessibility Testing** | Dedicated accessibility-oriented test suites |
| **Performance Testing** | Dedicated performance-oriented test suites |
| **Failure Diagnostics** | Screenshots, traces, videos, logs, and structured test reports |
| **Test Reporting** | HTML, JSON, and JUnit reports |
| **Containerized Execution** | Docker-based test execution |
| **CI/CD Integration** | GitHub Actions and Jenkins execution |
| **Multi-Application Architecture** | SauceDemo, CURA Healthcare, and OrangeHRM test suites |


## 📁 Project Structure

The repository is organized around framework components, execution infrastructure, and application-specific test suites.

```text
playwright-automation-framework/
│
├── .github/                  # GitHub Actions workflows
├── .husky/                   # Git hooks
│
├── config/                   # Environment and execution configuration
├── docs/                     # Framework and testing documentation
├── globals/                  # Shared global definitions
├── helpers/                  # Reusable helper utilities
├── jenkins/                 # Jenkins configuration
├── schemas/                 # Data and schema definitions
├── scripts/                 # Test execution and utility scripts
├── selectors/               # Shared selectors
│
├── src/
│   ├── pages/               # Page Object implementations
│   ├── fixtures/            # Reusable Playwright fixtures
│   ├── helpers/             # Framework-level helpers
│   ├── environment/         # Environment-specific configuration
│   └── tests/               # Application test suites
│
├── test-data/               # Test data
├── tests/                   # Executable suites and template/reference tests
│
├── Dockerfile               # Containerized execution
├── docker-compose.yml       # Docker orchestration
├── Jenkinsfile.docker      # Jenkins pipeline definition
├── playwright.config.ts     # Playwright execution configuration
├── package.json             # Project dependencies and scripts
└── README.md
```

### Test Organization

The test suite is organized by **shared capabilities, application-specific coverage, and reusable reference templates**.

```text
tests/
│
├── shared/
│   ├── auth/                         # Shared authentication coverage
│   └── api/                          # Shared API coverage and health checks
│
├── saucedemo/
│   ├── 01-auth/                      # Authentication edge cases
│   ├── smoke/                        # Fast happy-path coverage
│   ├── regression/                   # Broader functional coverage
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
├── orangehrm/
│   ├── 01-auth/
│   ├── smoke/
│   ├── regression/
│   ├── 04-accessibility-testing/
│   ├── 05-performance-testing/
│   └── 06-visual-regression/
│
└── templates/
    ├── fundamentals/
    ├── interactions/
    ├── test-organization/
    ├── advanced-features/
    ├── page-object-model/
    ├── api-testing/
    ├── smoke-testing/
    ├── performance-testing/
    ├── accessibility-testing/
    └── visual-regression/

```



## 🚀 Getting Started

### Prerequisites

Install the following before running the framework:

- Node.js
- npm
- Git
- Playwright browser dependencies
- Docker *(optional, for containerized execution)*

### 1. Clone the Repository

```bash
git clone https://github.com/prasad291024/playwright-automation-framework.git
cd playwright-automation-framework
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Playwright Browsers

```bash
npx playwright install
```

### 4. Configure the Environment

Create the local environment configuration from the provided example:

```bash
cp .env.example .env
```

Update the required environment-specific values.

> ⚠️ Never commit credentials, tokens, or other secrets to the repository.

### 5. Run Tests

Run the default Playwright test suite:

```bash
npx playwright test
```

Run tests using Playwright UI mode:

```bash
npx playwright test --ui
```

Run a specific browser project:

```bash
npx playwright test --project=chromium
```

Run with a specific number of workers:

```bash
npx playwright test --workers=1
```

### 6. Run an Application-Specific Suite

Use the repository's suite runner:

```bash
node scripts/run-app-suite.cjs --app=saucedemo --suite=smoke
```

Replace the application and suite values according to the supported test suites.

### 7. View the HTML Report

```bash
npx playwright show-report
```

### Execution Examples

| Use Case | Command |
|---|---|
| Full/default suite | `npx playwright test` |
| Interactive debugging | `npx playwright test --ui` |
| Chromium | `npx playwright test --project=chromium` |
| Controlled parallelism | `npx playwright test --workers=1` |
| Application smoke suite | `node scripts/run-app-suite.cjs --app=saucedemo --suite=smoke` |
| HTML report | `npx playwright show-report` |


## 🔄 CI/CD & Execution

The framework is designed for repeatable automated execution through **GitHub Actions** and **Jenkins**, with configurable test scopes, browser projects, reporting, and execution parameters.

### GitHub Actions

The repository includes workflows for automated validation and test execution.

The CI workflow can include:

- Dependency installation
- Code quality checks
- Type checking
- Test execution
- Configurable test scopes
- Test reporting
- Artifact collection

Pull-request and push workflows can use different execution scopes, allowing faster feedback during development while broader suites can be executed when required.

### Jenkins

Jenkins execution is supported through the repository's Jenkins configuration and Docker-based execution flow.

The pipeline supports configurable parameters such as:

| Parameter | Purpose |
|---|---|
| **Application** | Select the application under test |
| **Browser** | Select the Playwright browser project |
| **Test Scope** | Control which test suite or scope is executed |
| **Execution Timeout** | Control pipeline execution limits |
| **Reports & Artifacts** | Preserve execution results for investigation |

### Execution Strategy

The framework supports configurable parallel execution through Playwright workers.

Parallel execution can reduce feedback time, but the optimal worker count depends on:

- Test-data isolation
- Shared application state
- Environment capacity
- API and database contention
- CI runner resources

The goal is therefore not simply to maximize the number of workers, but to balance **execution speed with test reliability**.

### Execution Model

```text
Developer Change
       │
       ▼
Pull Request / Push
       │
       ▼
CI Validation
       │
       ├── Code Quality
       ├── Type Checking
       └── Automated Tests
                    │
                    ▼
          Reports & Artifacts
                    │
                    ▼
             Failure Analysis
```

> **Engineering principle:** Faster test execution is valuable only when the resulting feedback remains reliable and actionable.





## 🧪 Test Strategy & Suite Organization

The framework organizes tests by **application, test intent, and execution purpose**, while keeping shared capabilities and reusable reference material separate.

See `docs/TEST_STRATEGY.md` for additional details on CI scope, suite ownership, and execution guidance.

### Test Layers

| Test Layer | Purpose |
|---|---|
| **Shared** | Reusable authentication and API-oriented coverage |
| **Smoke** | Fast happy-path checks for rapid feedback |
| **Regression** | Broader application workflow coverage |
| **Accessibility** | Accessibility-oriented validation |
| **Performance** | Performance-oriented test scenarios |
| **Visual Regression** | Screenshot-based UI consistency checks |
| **Templates** | Reusable learning and reference examples |

### Suite Organization

Each supported application owns its runnable suites under:

```text
tests/<application>/
```

Current application coverage includes:

- **SauceDemo**
- **CURA Healthcare**
- **OrangeHRM**

Each application follows a consistent organization around authentication, smoke, regression, and specialized testing where applicable.

### Suite Intent

- `01-auth` suites focus on negative-path and authentication validation scenarios.
- `smoke` suites focus on fast happy-path checks used for quick confidence.
- `regression` suites contain broader application workflows.
- Specialized suites address accessibility, performance, and visual validation.

### Template & Learning Suites

Reusable examples and reference material are maintained separately under:

```text
tests/templates/
```

These templates cover areas such as:

- Test fundamentals
- UI interactions
- Test organization
- Page Object Model
- API testing
- Smoke testing
- Performance testing
- Accessibility testing
- Visual regression

Template files use the `*.template.ts` convention so Playwright does not execute them as active test coverage.

### Reporting & Artifact Conventions

Application-specific suite execution should use the repository's suite runner:

```bash
node scripts/run-app-suite.cjs --app=<application> --suite=<suite>
```

Execution artifacts are organized by application and suite:

| Artifact | Location |
|---|---|
| **HTML Reports** | `playwright-report/<app>/<suite>` |
| **JSON Reports** | `test-results/json/<app>-<suite>.json` |
| **JUnit Reports** | `test-results/junit/<app>-<suite>.xml` |
| **Playwright Attachments** | `test-results/artifacts/<app>/<suite>` |
| **Visual Snapshots** | `*-snapshots/` alongside the owning visual suite |

Visual baselines can be refreshed using the application-specific suite runner when required.






## 🔍 Quality & Reliability

The framework treats test reliability as an engineering concern rather than simply a test-execution problem.

### Failure Diagnostics

When tests fail, execution can preserve artifacts that help reproduce and investigate the failure:

- Screenshots
- Playwright traces
- Videos
- HTML reports
- JSON reports
- JUnit reports
- Execution logs

These artifacts provide additional context for both local and CI failures.

### Flaky Test Investigation

Flaky failures should be investigated rather than hidden through repeated retries.

Common investigation areas include:

- **Locator stability**
- **Synchronization and dynamic application state**
- **Timeout configuration**
- **Authentication and session state**
- **Test-data dependencies**
- **Shared application state**
- **API and database dependencies**
- **CI and environment resource constraints**

Retries can provide temporary resilience, but persistent or reproducible failures should be investigated at their source.

### Parallel Execution & Isolation

Parallel execution can improve feedback time, but reliable parallelism requires appropriate isolation.

Potential sources of instability include:

- Shared test data
- Race conditions
- Environment contention
- API or database limits
- CI runner resource constraints

The framework therefore treats parallelism as a balance between:

```text
                 Fast Feedback
                      ▲
                      │
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        │     Execution Strategy    │
        │             │             │
        ▼             │             ▼
   More Workers   ─────┼─────   More Isolation
        │             │             │
        └─────────────┼─────────────┘
                      │
                      ▼
                Reliable Results
```

> **Reliability principle:** Increasing execution speed is useful only when test results remain trustworthy and actionable.



## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| **Language** | TypeScript / JavaScript |
| **UI Automation** | Playwright |
| **Test Architecture** | Page Object Model, Fixtures |
| **API Testing** | Playwright API utilities |
| **Test Execution** | Playwright Test |
| **Browsers** | Chromium, Firefox, WebKit |
| **Test Data** | Environment-driven and reusable test data |
| **Reporting** | HTML, JSON, JUnit |
| **Containerization** | Docker, Docker Compose |
| **CI/CD** | GitHub Actions, Jenkins |
| **Version Control** | Git, GitHub |
| **Code Quality** | ESLint, TypeScript checks, Git hooks |


