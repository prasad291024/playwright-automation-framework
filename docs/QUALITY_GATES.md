# Quality Gates & Developer Workflow

This document defines the multi-tiered quality gates implemented in the Playwright UI Automation Framework to ensure production-grade reliability, type safety, and clean code before changes reach the `main` branch.

---

## 1. Multi-Tiered Quality Control Architecture

```
┌────────────────────────────────────────────────────────┐
│               Tier 1: Pre-Commit Hook                  │
│       Husky + lint-staged (ESLint + Prettier)          │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                Tier 2: Pre-Push Hook                   │
│    .husky/pre-push: lint, typecheck, test.only scan,   │
│               credential regex scan                    │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│            Tier 3: Pull Request Validation             │
│   .github/workflows/ci.yml (scope: smoke)              │
│   Install -> Lint -> Typecheck -> Fast Smoke Matrix    │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│         Tier 4: Main Push & Regression Gate            │
│   .github/workflows/ci.yml (scope: full)               │
│   Full multi-app matrix, artifact archiving & summary  │
└────────────────────────────────────────────────────────┘
```

---

## 2. Detailed Quality Gates

### Gate 1: Local Pre-Commit Guard (Husky + lint-staged)

- **Trigger**: Automatic on `git commit`.
- **Implementation**: `.husky/pre-commit` runs `npx lint-staged`.
- **Rules (`package.json`)**:
  - `*.ts`: `eslint --fix` followed by `prettier --write`.
  - `*.json`: `prettier --write`.
  - `*.md`: `prettier --write`.
- **Objective**: Guarantee zero formatting discrepancies or auto-fixable lint errors enter git history.

### Gate 2: Local Pre-Push Guard (`.husky/pre-push`)

- **Trigger**: Automatic on `git push`.
- **Implementation**: `.husky/pre-push` executes a 5-step validation:
  1. **Git Status**: Warns on uncommitted or dirty workspace states.
  2. **ESLint Verification**: Runs `npm run lint` across all TypeScript files.
  3. **TypeScript Compilation**: Runs `npm run typecheck` (`tsc --noEmit`) to catch type mismatches under strict mode.
  4. **Debug Marker Scan**: Blocks pushes containing `test.only` or `test.skip`.
  5. **Secret Scan**: Inspects diffs for accidental credentials, passwords, or API keys (`password.*=`, `api_key`, `secret.*=`).

### Gate 3: Pull Request Validation (GitHub Actions PR Scope)

- **Trigger**: Automatic on Pull Requests targeting `main` or `develop`.
- **Implementation**: `.github/workflows/ci.yml` (resolves `test-scope=smoke`).
- **Jobs**:
  1. **Install**: Node.js 20 setup, `npm ci`, caching.
  2. **Lint**: `npm run lint` and `npm run format:check`.
  3. **Typecheck**: `npm run typecheck`.
  4. **Quality Gate Summary**: Verifies static analysis passes.
  5. **Smoke Tests**: Sequential execution via `node scripts/run-app-suite.cjs`:
     - `saucedemo:smoke`
     - `cura:smoke`
     - `orangehrm:smoke`
     - `local:shared-api`
  6. **Report Publishing**: Posts run summary and uploads artifacts.
- **SLA**: Under 5 minutes total run time for fast developer feedback.

### Gate 4: Push & Regression Gate (Full CI Scope)

- **Trigger**: Automatic on pushes to `main`, `develop`, and `feature/**` or manual `workflow_dispatch`.
- **Implementation**: `.github/workflows/ci.yml` (resolves `test-scope=full`).
- **Comprehensive Matrix**:
  - **SauceDemo**: `auth`, `smoke`, `regression`, `accessibility`, `shared-auth`
  - **CURA Healthcare**: `auth`, `smoke`, `regression`, `shared-auth`
  - **OrangeHRM**: `auth`, `smoke`, `regression`, `accessibility`, `shared-auth`
  - **Shared API**: `local:shared-api`
- **Artifacts**: Uploads JUnit XML, JSON, HTML reports, and failure videos/traces with 30-day retention.

### Gate 5: Enterprise Container Gate (Jenkins & Docker)

- **Trigger**: Jenkins webhook on GitHub push or scheduled build.
- **Implementation**: `Jenkinsfile.docker` running inside `mcr.microsoft.com/playwright:v1.56.1-noble`.
- **Validates**: Tests run reliably in isolated Linux container environments without host-dependent quirks.

---

## 3. Test Tagging & Selective Execution

Tests use tags to control execution scope across quality gates:

| Tag                        | Intended Scope                                 | Execution Frequency                   |
| -------------------------- | ---------------------------------------------- | ------------------------------------- |
| `@smoke`                   | Fast happy-path confidence checks              | PR validation, pre-merge, deployments |
| `@regression`              | Complete user journeys and business flows      | Full CI runs, scheduled nightly runs  |
| `@auth`                    | Negative-path and credential boundary tests    | Full CI runs, security audits         |
| `@api`                     | Backend REST contracts and schema validation   | Every PR and push                     |
| `@accessibility` / `@a11y` | Axe-core accessibility compliance checks       | Full CI runs, accessibility audits    |
| `@performance` / `@perf`   | Navigation timing and Web Vitals benchmarks    | On-demand, nightly runs               |
| `@visual`                  | Pixel-diff visual comparisons (`*-snapshots/`) | On-demand, nightly runs               |

---

## 4. Flakiness Protection & Resilience Controls

To prevent flaky tests from degrading CI confidence:

- **Worker Concurrency**:
  - Local development: Auto-scaled to available CPU cores.
  - CI environment (`CI=true`): Strictly single-worker (`workers: 1`) to eliminate CPU starvation and timing race conditions.
- **Automated Retries**:
  - Local development & debug: `retries: 0` for fast failure feedback.
  - CI environment: `retries: 2` to absorb intermittent network latency.
- **Failure Diagnostics**:
  - Screenshots: `only-on-failure`.
  - Videos: `retain-on-failure`.
  - Traces: `on-first-retry` (includes DOM snapshots, network logs, and console output).
- **Zero Sleep Policy**: `page.waitForTimeout()` is strictly banned in PRs. Dynamic waiting (`waitForNetworkStable`, web-first assertions) is required.

---

## 5. Standard Developer Workflow

### Step 1: Sync & Verify

```bash
git checkout develop
git pull origin develop

# Verify clean environment
npm run typecheck
npm run lint
npm run format:check
```

### Step 2: Develop & Test Locally

```bash
git checkout -b feature/your-feature-name

# Run targeted suite
node scripts/run-app-suite.cjs --app=saucedemo --suite=smoke

# Interactive UI runner for rapid debugging
npm run test:ui
```

### Step 3: Local Quality Gate Check

```bash
# Combined pre-push check
npm run pre-push
```

### Step 4: Commit & Push

```bash
# Husky triggers lint-staged on commit
git commit -m "feat(saucedemo): add checkout summary assertions"

# Husky triggers pre-push script on push
git push origin feature/your-feature-name
```

### Step 5: Pull Request & Merge

1. Open PR targeting `develop` or `main`.
2. GitHub Actions runs Gate 3 (`smoke` scope).
3. Code review approval required per [`docs/CODE_REVIEW.md`](CODE_REVIEW.md).
4. Squash merge once all checks pass. Gate 4 (`full` scope) executes on merge.
