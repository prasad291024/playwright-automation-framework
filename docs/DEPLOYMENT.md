# Deployment & CI/CD Pipeline Guide

This guide covers deploying the Playwright UI Automation Framework in continuous integration pipelines, containerized environments, and production staging environments.

---

## 1. Prerequisites & Environment Setup

### System Prerequisites

- **Node.js**: 20.x or higher
- **npm**: 10.x or higher
- **Docker**: Docker Desktop or Docker Engine (for containerized execution)
- **Git**: 2.30+

### Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/playwright-automation-framework.git
cd playwright-automation-framework

# 2. Install dependencies
npm ci

# 3. Install Playwright browser binaries and OS dependencies
npx playwright install --with-deps chromium

# 4. Configure local environment variables
cp .env.example .env
```

---

## 2. Configuration & Secrets Management

### Multi-App Configuration (`config/apps.json`)

The framework relies on `config/apps.json` to configure base URLs, authentication types, and timeout profiles across supported applications:

```json
{
  "saucedemo": {
    "baseUrl": "https://www.saucedemo.com",
    "authType": "cookie",
    "storageState": "storage-state/saucedemo.json",
    "timeouts": { "action": 10000, "navigation": 30000 },
    "retryStrategy": "standard"
  },
  "cura": {
    "baseUrl": "https://katalon-demo-cura.herokuapp.com",
    "authType": "session",
    "storageState": "storage-state/cura.json",
    "timeouts": { "action": 10000, "navigation": 30000 },
    "retryStrategy": "standard"
  },
  "orangehrm": {
    "baseUrl": "https://opensource-demo.orangehrmlive.com",
    "authType": "session",
    "storageState": "storage-state/orangehrm.json",
    "timeouts": { "action": 15000, "navigation": 35000 },
    "retryStrategy": "exponential"
  },
  "local": {
    "baseUrl": "http://localhost:3000",
    "authType": "none",
    "timeouts": { "action": 5000, "navigation": 15000 },
    "retryStrategy": "none"
  }
}
```

### Environment Variables & CI Secrets

In continuous integration (GitHub Actions, Jenkins), configure these secrets:

| Secret / Env Var                            | Description                                               | Example / Default                         |
| ------------------------------------------- | --------------------------------------------------------- | ----------------------------------------- |
| `CI`                                        | Flags CI environment (adjusts retries, workers, timeouts) | `true`                                    |
| `APP` / `APP_NAME`                          | Active application target                                 | `saucedemo`, `cura`, `orangehrm`, `local` |
| `TEST_SUITE`                                | Target test suite                                         | `smoke`, `regression`, `auth`, `all`      |
| `PLAYWRIGHT_WORKERS`                        | Parallel worker override                                  | `1` (in CI for stability)                 |
| `PLAYWRIGHT_RETRIES`                        | Retry override                                            | `2` (in CI)                               |
| `CURA_USERNAME` / `CURA_PASSWORD`           | CURA test credentials                                     | `John Doe` / `ThisIsNotAPassword`         |
| `ORANGEHRM_USERNAME` / `ORANGEHRM_PASSWORD` | OrangeHRM test credentials                                | `Admin` / `admin123`                      |
| `SAUCEDEMO_USERNAME` / `SAUCEDEMO_PASSWORD` | SauceDemo test credentials                                | `standard_user` / `secret_sauce`          |

---

## 3. GitHub Actions CI/CD Pipeline

The repository provides a robust, phased CI workflow in `.github/workflows/ci.yml`.

### Pipeline Architecture

```
┌────────────────────────────────────────────────────────┐
│                   GitHub Trigger                       │
│    (PR to main/develop, Push to main/develop/feature)  │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                  Job 1: Install                        │
│          Checkout, Node.js 20, npm ci,                 │
│      Resolve test-scope (smoke on PR, full on push)    │
└─────────────┬────────────────────────────┬─────────────┘
              │                            │
┌─────────────▼─────────────┐┌─────────────▼─────────────┐
│       Job 2: Lint         ││     Job 3: Typecheck      │
│  npm run lint             ││    npm run typecheck      │
│  npm run format:check     ││      (tsc --noEmit)       │
└─────────────┬─────────────┘└─────────────┬─────────────┘
              │                            │
┌─────────────▼────────────────────────────▼─────────────┐
│                 Job 4: Code Quality Gate               │
│               Summarize quality validation             │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                    Job 5: Test                         │
│       Install Chromium, run app-specific suites        │
│       via node scripts/run-app-suite.cjs               │
│       Upload JUnit, JSON, HTML & artifact results      │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                Job 6: Publish Report                   │
│          Download artifacts, build markdown run        │
│          summary, upload consolidated CI artifacts     │
└────────────────────────────────────────────────────────┘
```

### Execution Matrix Scopes

- **Pull Requests (`smoke` scope)**: Fast feedback running in under 5 minutes:
  - `saucedemo:smoke`
  - `cura:smoke`
  - `orangehrm:smoke`
  - `local:shared-api`
- **Pushes / Manual Dispatch (`full` scope)**:
  - `saucedemo`: `auth`, `smoke`, `regression`, `accessibility`, `shared-auth`
  - `cura`: `auth`, `smoke`, `regression`, `shared-auth`
  - `orangehrm`: `auth`, `smoke`, `regression`, `accessibility`, `shared-auth`
  - `local`: `shared-api`

_(Note: Visual regression and performance suites are omitted from the blocking CI matrix to avoid false positives from cross-platform rendering diffs and long execution times. They are run on-demand or via scheduled nightly jobs)._

---

## 4. Jenkins Declarative Pipeline (`Jenkinsfile.docker`)

The framework includes a production-grade Jenkins pipeline using Playwright's official Docker container:

### Container Specifications

- **Image**: `mcr.microsoft.com/playwright:v1.56.1-noble`
- **Volume Mount**: Workspace mounted dynamically to `/workspace`
- **Execution**: Cross-platform compatible (`sh` on Linux/macOS, `bat` on Windows)

### Pipeline Stages

1. **Preflight**: Verifies Docker daemon is running (`docker info`).
2. **Install**: Pulls container image, creates report directories, and executes `npm ci`.
3. **Lint & Typecheck**: Executes `npm run lint`, `npm run format:check`, and `npm run typecheck` inside container.
4. **Test**: Executes Playwright tests with parameters:
   - `TEST_SCOPE`: `smoke` vs. `full`
   - `PLAYWRIGHT_PROJECT`: `chromium`, `firefox`, `webkit`, `saucedemo`, `cura`
   - `APP`: Application profile from `config/apps.json`
5. **Publish Report**: Publishes JUnit XML results (`test-results/junit/*.xml`) and HTML report (`playwright-report/jenkins`).
6. **Archive Artifacts**: Retains traces, videos, and screenshots on failure.
7. **Notify**: Posts build status and report links to Slack channel.

---

## 5. Docker & Containerized Execution

### Local Docker Compose

Run tests locally using Docker Compose to replicate CI container conditions:

```bash
# Run headless tests
docker compose run test

# Run tests in headed container (X11 / VNC forwarding)
docker compose run test-headed

# Run a specific app suite in container
docker compose run test node scripts/run-app-suite.cjs --app=saucedemo --suite=smoke
```

### Building the Dockerfile Directly

```bash
# Build custom image
docker build -t playwright-framework:v1.56.1 .

# Run tests headlessly
docker run --rm --ipc=host \
  -v "$(pwd)/test-results:/app/test-results" \
  -v "$(pwd)/playwright-report:/app/playwright-report" \
  playwright-framework:v1.56.1 npm test
```

---

## 6. Authentication & Storage State Lifecycle

The framework uses session state caching (`storage-state/{app}.json`) to avoid repetitive UI logins:

```
┌────────────────────────────────────────────────────────┐
│                   Test Initiation                      │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│      Does storage-state/{app}.json exist & valid?      │
└─────────────┬────────────────────────────┬─────────────┘
              │ Yes                        │ No / Expired
┌─────────────▼─────────────┐┌─────────────▼─────────────┐
│  Reuse existing cookies   ││  Execute login via UI POM │
│   & session in context    ││  Save state to file       │
└─────────────┬─────────────┘└─────────────┬─────────────┘
              │                            │
┌─────────────▼────────────────────────────▼─────────────┐
│               Run Test Specification                   │
└────────────────────────────────────────────────────────┘
```

### Managing Storage States in CI/CD

1. **Storage State Regeneration**:
   Run the preparation script to pre-generate all storage states before test execution:
   ```bash
   npx ts-node scripts/prepare-storage-states.ts
   ```
2. **Bypassing Storage State**:
   For clean unauthenticated validation or to debug session bootstrap issues:

   ```bash
   # Unix:
   SKIP_GLOBAL_AUTH_SETUP=1 node scripts/run-app-suite.cjs --app=cura --suite=smoke

   # PowerShell:
   $env:SKIP_GLOBAL_AUTH_SETUP='1'; node scripts/run-app-suite.cjs --app=cura --suite=smoke
   ```

---

## 7. Performance & Stability Optimization in CI

### Worker & Concurrency Management

- In local development, Playwright auto-detects logical CPU cores (`workers: undefined`).
- In CI environments, `playwright.config.ts` defaults to `workers: 1` to prevent CPU throttling, resource starvation, and timing-induced flakiness:
  ```typescript
  if (process.env.CI) return 1;
  ```
- Workers can be overridden via `PLAYWRIGHT_WORKERS=2` if high-concurrency cloud runners are used.

### Retry Strategy

- In CI environments, retries default to `2` to handle temporary network blips:
  ```typescript
  retries: process.env.CI ? 2 : 0;
  ```
- Traces are captured on first retry (`trace: 'on-first-retry'`) to conserve disk space while ensuring failed tests produce debugging traces.

### Artifact Retention Policies

- GitHub Actions artifacts (`junit-results`, `json-results`, `playwright-html-report`, `raw-test-results`) are retained for **30 days**.
- Jenkins retains the last 20 builds via `buildDiscarder(logRotator(numToKeepStr: '20'))`.

---

## 8. Deployment Troubleshooting

### Common Pipeline Issues

#### 1. Tests Time Out in CI but Pass Locally

- **Cause**: CI runners typically have fewer CPU cores and memory than developer laptops.
- **Fix**: Verify single-worker execution (`workers: 1`), ensure action timeouts in `config/apps.json` are sufficient (10-15s), and ensure `page.waitForLoadState('networkidle')` is accompanied by fallback element assertions.

#### 2. Visual Regression Differences Across Environments

- **Cause**: Different OS font-rendering engines (Ubuntu in CI vs. Windows/macOS locally) produce pixel-level anti-aliasing diffs.
- **Fix**: Generate baselines using the Docker container (`docker compose run test ... -u`) or run visual suites on dedicated matching agent types.

#### 3. Storage State Permissions in Docker

- **Cause**: Volume mounting directories created by root inside the container may fail when running with non-root users.
- **Fix**: `Jenkinsfile.docker` uses `--ipc=host` and creates output directories before container launch (`mkdir -p test-results/json test-results/junit playwright-report`).
