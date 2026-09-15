# Playwright UI Automation Framework

## Quick Reference

This file serves as a quick reference guide. For comprehensive documentation, please see the `docs/` folder.

## Documentation Structure

All detailed documentation has been moved to the `docs/` folder for better organization:

### Core Documentation
- [`docs/FRAMEWORK_INDEX.md`](docs/FRAMEWORK_INDEX.md) - Complete implementation index and quick start guide
- [`docs/TEST_STRATEGY.md`](docs/TEST_STRATEGY.md) - Test suite organization, CI execution policies, and ownership rules
- [`docs/PRODUCTION_READINESS.md`](docs/PRODUCTION_READINESS.md) - Production deployment checklist
- [`docs/STRUCTURE_REFACTORING.md`](docs/STRUCTURE_REFACTORING.md) - Details about the project structure refactoring
- [`docs/FRAMEWORK_TODO.md`](docs/FRAMEWORK_TODO.md) - Current improvement checklist

### Implementation Guides
- [`docs/FRAMEWORK_IMPLEMENTATION.md`](docs/FRAMEWORK_IMPLEMENTATION.md) - Detailed code samples and implementation details
- [`docs/PRODUCTION_FRAMEWORK_SUMMARY.md`](docs/PRODUCTION_FRAMEWORK_SUMMARY.md) - Complete architecture guide
- [`docs/playwright-best-practices.md`](docs/playwright-best-practices.md) - Playwright-specific best practices

### Setup & Configuration
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) - Deployment instructions
- [`docs/docker-desktop-guide.md`](docs/docker-desktop-guide.md) - Docker Desktop setup guide
- [`docs/jenkins-docker-setup.md`](docs/jenkins-docker-setup.md) - Jenkins with Docker setup
- [`docs/CODE_REVIEW.md`](docs/CODE_REVIEW.md) - Code review guidelines
- [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) - Contribution guidelines
- [`docs/SECURITY.md`](docs/SECURITY.md) - Security considerations

## Quick Start Commands

For immediate reference, here are the most commonly used commands:

### Running Tests
- **Default test run**: `npm test`
- **SauceDemo suites**:
  - All: `npm run test:saucedemo`
  - Smoke: `npm run test:saucedemo:smoke`
  - Regression: `npm run test:saucedemo:regression`
  - Auth: `npm run test:saucedemo:auth`
  - Accessibility: `npm run test:saucedemo:a11y`
  - Performance: `npm run test:saucedemo:perf`
  - Visual Regression: `npm run test:saucedemo:visual`
  - Visual Regression Update: `npm run test:saucedemo:visual:update`
- **CURA Healthcare suites**:
  - All: `npm run test:cura`
  - Smoke: `npm run test:cura:smoke`
  - Regression: `npm run test:cura:regression`
  - Auth: `npm run test:cura:auth`
  - Accessibility: `npm run test:cura:a11y`
  - Performance: `npm run test:cura:perf`
  - Visual Regression: `npm run test:cura:visual`
  - Visual Regression Update: `npm run test:cura:visual:update`
- **OrangeHRM suites**:
  - All: `npm run test:orangehrm`
  - Smoke: `npm run test:orangehrm:smoke`
  - Regression: `npm run test:orangehrm:regression`
  - Auth: `npm run test:orangehrm:auth`
  - Accessibility: `npm run test:orangehrm:a11y`
  - Performance: `npm run test:orangehrm:perf`
  - Visual Regression: `npm run test:orangehrm:visual`
  - Visual Regression Update: `npm run test:orangehrm:visual:update`
- **API tests**: `npm run test:api`
- **Run a single test file**: `npx playwright test tests/saucedemo/smoke/app-smoke.spec.ts`
- **Run tests matching a title tag**: `npx playwright test -g "@smoke"`
- **Run with specific browser**: `npx playwright test --project=chromium`
- **Interactive UI mode**: `npm run test:ui`
- **Debug mode**: `npm run test:debug`

### Visual Regression Testing Special Commands
When updating visual baselines, use the app-specific update commands:
```bash
# For SauceDemo
npm run test:saucedemo:visual:update

# For CURA
npm run test:cura:visual:update

# For OrangeHRM
npm run test:orangehrm:visual:update
```

If local storage-state bootstrap interferes during visual baseline generation:
```bash
SKIP_GLOBAL_AUTH_SETUP=1 npm run test:cura:visual:update
# or on PowerShell:
# $env:SKIP_GLOBAL_AUTH_SETUP='1'; npm.cmd run test:cura:visual:update
```

### Code Quality & Validation
- **Typecheck**: `npm run typecheck` (`tsc --noEmit`)
- **Linting**: `npm run lint` / `npm run lint:fix`
- **Formatting**: `npm run format` / `npm run format:check`
- **CI pipeline check**: `npm run test:ci`

## Environment Variables

The framework uses environment variables for configuration and credentials:

### Required for All Apps
- `APP_NAME` - Specifies which application to test (saucedemo, cura, orangehrm, local)

### SauceDemo Credentials
- `SAUCEDEMO_USERNAME` - Username for SauceDemo login
- `SAUCEDEMO_PASSWORD` - Password for SauceDemo login

### CURA Healthcare Credentials
- `CURA_USERNAME` - Username for CURA login
- `CURA_PASSWORD` - Password for CURA login

### OrangeHRM Credentials
- `ORANGEHRM_USERNAME` - Username for OrangeHRM login
- `ORANGEHRM_PASSWORD` - Password for OrangeHRM login

### Configuration
- `ENVIRONMENT` - Deployment environment (default: local)
- `BASE_URL_*` - Override base URL for specific apps
- `HEADLESS` - Run in headless mode (default: true)
- `TRACE` - Enable Playwright tracing (on/off/retain-on-failure)

### CI/CD
- `CI` - Set to true when running in CI environment
- `PLAYWRIGHT_WORKERS` - Number of parallel workers
- `PLAYWRIGHT_RETRIES` - Number of test retries

Create a `.env` file in the project root based on `.env.example` to manage these variables.

## Project Structure (High-Level)

For detailed structure, see [`docs/STRUCTURE_REFACTORING.md`](docs/STRUCTURE_REFACTORING.md):

```
framework/
├── config/                     # JSON-based app registry and test suite paths
├── globals/                    # Global setup and teardown hooks
├── schemas/                    # JSON schemas for API validation
├── scripts/                    # Custom suite runner and git hooks
├── src/
│   ├── config/                 # App configuration types and AppRegistry
│   ├── core/                   # Custom test fixtures, session management, and logger
│   ├── pages/                  # Page Object Model classes organized by app
│   └── utils/                  # Flakiness helpers, API clients, and schema validator
├── tests/                      # Test specs segmented by app
└── .auth/                      # Authentication storage states (gitignored)
```

## Getting Started

For complete getting started instructions, see [`docs/FRAMEWORK_INDEX.md`](docs/FRAMEWORK_INDEX.md):

1. Clone the repository
2. Install dependencies: `npm install`
3. Environment Setup: Create `.env` file based on `.env.example` if needed
4. Run tests: See the commands above or refer to the detailed documentation

## Contributing

Please see [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) for guidelines on contributing to this framework.

## License

This project is licensed under the ISC License.