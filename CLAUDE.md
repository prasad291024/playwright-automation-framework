# Playwright UI Automation Framework

## Quick Reference

This file serves as a quick reference guide for AI assistants and engineers. For comprehensive documentation, please see the `docs/` folder.

## Documentation Structure

All detailed documentation is organized within the `docs/` folder:

### Core Documentation
- [`docs/FRAMEWORK_GUIDE.md`](docs/FRAMEWORK_GUIDE.md) - Unified architectural guide, App Facade pattern, fixtures, and runner usage
- [`docs/ONBOARDING.md`](docs/ONBOARDING.md) - Developer onboarding pathways, step-by-step tutorials, and milestone checklist
- [`docs/README.md`](docs/README.md) - Test suite structure overview, active vs. template suite mapping, and reporting conventions
- [`docs/TEST_STRATEGY.md`](docs/TEST_STRATEGY.md) - Test strategy, CI execution matrix (smoke vs. full), and suite ownership rules
- [`docs/PRODUCTION_READINESS.md`](docs/PRODUCTION_READINESS.md) - Production deployment audit checklist
- [`docs/STRUCTURE_REFACTORING.md`](docs/STRUCTURE_REFACTORING.md) - Details of the multi-app architectural migration
- [`docs/FRAMEWORK_TODO.md`](docs/FRAMEWORK_TODO.md) - Enhancement roadmap and prioritized action items

### Implementation & Quality Guides
- [`docs/PRODUCTION_FRAMEWORK_SUMMARY.md`](docs/PRODUCTION_FRAMEWORK_SUMMARY.md) - Architecture summary and implemented capabilities
- [`docs/playwright-best-practices.md`](docs/playwright-best-practices.md) - Playwright locator, assertion, and fixture best practices
- [`docs/FLAKINESS_REDUCTION.md`](docs/FLAKINESS_REDUCTION.md) - Timing strategies, FlakeHelper, and network stability patterns
- [`docs/QUALITY_GATES.md`](docs/QUALITY_GATES.md) - Verification gates across pre-commit, pull requests, and scheduled runs
- [`docs/QUICK_REFERENCE.md`](docs/QUICK_REFERENCE.md) - Command cheatsheet, app credentials, and locator rules

### Setup, CI/CD & Operations
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) - CI/CD pipeline triggers, secret configuration, and Docker container execution
- [`docs/docker-desktop-guide.md`](docs/docker-desktop-guide.md) - Local container execution via Docker Desktop and Compose
- [`docs/jenkins-docker-setup.md`](docs/jenkins-docker-setup.md) - Jenkins declarative pipeline configuration with Docker agent
- [`docs/CODE_REVIEW.md`](docs/CODE_REVIEW.md) - Pull request review checklist and quality criteria
- [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) - Contribution standards, branching model, and PR workflow
- [`docs/SECURITY.md`](docs/SECURITY.md) - Credential management, vulnerability scanning, and secure test practices

## Quick Start Commands

### Running Tests via Multi-App Suite Runner
App-specific suites are executed using the custom orchestrator:
```bash
# General syntax
node scripts/run-app-suite.cjs --app=<app> --suite=<suite> [--project=<browser>]

# SauceDemo
node scripts/run-app-suite.cjs --app=saucedemo --suite=smoke
node scripts/run-app-suite.cjs --app=saucedemo --suite=regression
node scripts/run-app-suite.cjs --app=saucedemo --suite=auth
node scripts/run-app-suite.cjs --app=saucedemo --suite=accessibility
node scripts/run-app-suite.cjs --app=saucedemo --suite=performance
node scripts/run-app-suite.cjs --app=saucedemo --suite=visual

# CURA Healthcare
node scripts/run-app-suite.cjs --app=cura --suite=smoke
node scripts/run-app-suite.cjs --app=cura --suite=regression
node scripts/run-app-suite.cjs --app=cura --suite=auth
node scripts/run-app-suite.cjs --app=cura --suite=accessibility
node scripts/run-app-suite.cjs --app=cura --suite=performance
node scripts/run-app-suite.cjs --app=cura --suite=visual

# OrangeHRM
node scripts/run-app-suite.cjs --app=orangehrm --suite=smoke
node scripts/run-app-suite.cjs --app=orangehrm --suite=regression
node scripts/run-app-suite.cjs --app=orangehrm --suite=auth
node scripts/run-app-suite.cjs --app=orangehrm --suite=accessibility
node scripts/run-app-suite.cjs --app=orangehrm --suite=performance
node scripts/run-app-suite.cjs --app=orangehrm --suite=visual

# Shared Suites
node scripts/run-app-suite.cjs --app=local --suite=shared-auth
node scripts/run-app-suite.cjs --app=local --suite=shared-api
```

### Standard npm Scripts
- **Default test run**: `npm test`
- **Interactive UI mode**: `npm run test:ui`
- **Debug mode**: `npm run test:debug`
- **Headed mode**: `npm run test:headed`
- **Smoke tag execution**: `npm run test:smoke`
- **Browser-specific**: `npm run test:chromium`, `npm run test:firefox`, `npm run test:webkit`
- **HTML Report viewer**: `npm run test:report`

### Visual Regression Snapshot Updates
To update visual snapshot baselines, pass the `-u` flag to the suite runner:
```bash
node scripts/run-app-suite.cjs --app=saucedemo --suite=visual -u
node scripts/run-app-suite.cjs --app=cura --suite=visual -u
node scripts/run-app-suite.cjs --app=orangehrm --suite=visual -u
```

### Code Quality & Validation
- **Typecheck**: `npm run typecheck` (`tsc --noEmit`)
- **Linting**: `npm run lint` / `npm run lint:fix`
- **Formatting**: `npm run format` / `npm run format:check`
- **Pre-push Gate**: `npm run pre-push`

## Environment Variables

The framework uses environment variables defined in `.env` (refer to `.env.example`):

### Application Credentials
- `SAUCEDEMO_USERNAME`, `SAUCEDEMO_PASSWORD`
- `CURA_USERNAME`, `CURA_PASSWORD`
- `ORANGEHRM_USERNAME`, `ORANGEHRM_PASSWORD`

### Configuration Overrides
- `APP_NAME` - Specifies default app scope (`saucedemo`, `cura`, `orangehrm`, `local`)
- `ENVIRONMENT` - Target environment (`local`, `dev`, `staging`, `prod`)
- `HEADLESS` - Boolean flag for headless execution (`true` / `false`)
- `SKIP_GLOBAL_AUTH_SETUP` - Set to `1` to bypass pre-test global auth bootstrap
- `CI` - Set to `true` in CI environments to enforce single-worker, retries, and forbidden test.only

## Project Structure (High-Level)

For detailed architectural diagrams, see [`docs/ARCHITECTURE_VISUAL_GUIDE.md`](docs/ARCHITECTURE_VISUAL_GUIDE.md):

```
├── config/                     # JSON configuration (apps.json, test-suites.json)
├── globals/                    # Global setup (global-setup.ts) and teardown hooks
├── schemas/                    # JSON schemas for API response validation
├── scripts/                    # Custom suite runner (run-app-suite.cjs) and git hooks
├── src/
│   ├── apps/                   # App Facades (SauceDemoApp, CuraApp, OrangeHrmApp)
│   ├── config/                 # AppRegistry and environment configuration loaders
│   ├── core/                   # Fixtures (test.fixture.ts, auth.fixture.ts) & logger
│   ├── pages/
│   │   ├── apps/{app}/pages/   # Page Object Models per target application
│   │   └── base/               # Multi-app BasePage abstract class
│   └── utils/                  # Flakiness helpers, API client, and schema validators
├── tests/                      # App-specific test suites & shared suites
│   ├── saucedemo/
│   ├── cura/
│   ├── orangehrm/
│   ├── shared/
│   └── templates/              # Reusable suite templates (.template.ts)
└── storage-state/              # Persisted session state ({app}.json, gitignored)
```

## Getting Started

For full step-by-step onboarding, see [`docs/ONBOARDING.md`](docs/ONBOARDING.md):

1. Clone the repository
2. Install dependencies: `npm install`
3. Environment Setup: Copy `.env.example` to `.env` and set credentials
4. Verify code quality: `npm run typecheck && npm run lint`
5. Run smoke tests: `node scripts/run-app-suite.cjs --app=saucedemo --suite=smoke`

## Contributing & Reviews

Please see [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) and [`docs/CODE_REVIEW.md`](docs/CODE_REVIEW.md) for contribution rules and pull request review checklists.