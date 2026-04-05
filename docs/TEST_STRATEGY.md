# Test Strategy

This document defines which tests are active, how suites are organized, and what the CI pipeline is expected to run.

## Goals

- Keep active test ownership clear
- Separate app-owned coverage from shared framework coverage
- Preserve reusable templates without letting them pollute active execution
- Keep PR validation fast while still giving full CI meaningful coverage

## Active Suite Model

### App-Owned Suites

Each supported app owns its own runnable suites under `tests/<app>/...`.

Current active apps:

- `tests/saucedemo`
- `tests/cura`
- `tests/orangehrm`

Typical suite types:

- `01-auth`: negative-path and validation coverage
- `smoke`: fast happy-path confidence
- `regression`: broader workflow coverage
- `04-accessibility-testing`: app-owned accessibility checks
- `05-performance-testing`: app-owned performance checks
- `06-visual-regression`: app-owned visual baselines and screenshot checks

### Shared Suites

Shared framework-level coverage lives under:

- `tests/shared/auth`
- `tests/shared/api`

Use shared suites for:

- auth/session fixture validation
- shared API contracts
- framework behavior that is not owned by a single app

### Template Suites

Reusable examples and learning/reference material live under:

- `tests/templates/01-fundamentals`
- `tests/templates/02-interactions`
- `tests/templates/03-test-organization`
- `tests/templates/04-advanced-features`
- `tests/templates/05-page-object-model`
- `tests/templates/06-api-testing`
- `tests/templates/07-smoke-testing`
- `tests/templates/08-performance-testing`
- `tests/templates/09-accessibility-testing`
- `tests/templates/10-visual-regression`

Template files use `*.template.ts` so Playwright does not execute them as active coverage.

### Archived Coverage

VWO is currently archived because valid org-owned credentials are not available.

Archived template location:

- `tests/templates/apps/vwo.com/01-auth`

## Ownership Rules

- If a test validates real app behavior, it should live under that app's folder.
- If a test validates framework behavior across apps, it should live under `tests/shared`.
- If a test is educational, experimental, or reusable boilerplate, it should live under `tests/templates`.
- Do not leave new active coverage in numbered root folders.

## CI Execution Policy

The staged CI workflow is defined in `.github/workflows/ci.yml`.

### Pull Requests

Pull requests run the `smoke` scope only.

Current PR scope:

- `saucedemo:smoke`
- `cura:smoke`
- `orangehrm:smoke`
- `local:shared-api`

Reason:

- keep PR feedback fast
- validate the core login/shell paths
- keep shared API health visible

### Full CI Runs

Push and manual runs use the `full` scope.

Current full scope:

- `saucedemo:auth`
- `saucedemo:smoke`
- `saucedemo:regression`
- `saucedemo:accessibility`
- `saucedemo:shared-auth`
- `cura:auth`
- `cura:smoke`
- `cura:regression`
- `cura:shared-auth`
- `orangehrm:auth`
- `orangehrm:smoke`
- `orangehrm:accessibility`
- `orangehrm:shared-auth`
- `local:shared-api`

### Not Yet In CI By Default

These suites are active but not part of the default CI matrix today:

- `cura:accessibility`
- `cura:performance`
- `cura:visual`
- `saucedemo:performance`
- `saucedemo:visual`
- `orangehrm:performance`
- `orangehrm:visual`

Reason:

- keep the default CI run time under control
- avoid making visual baselines a required merge dependency across environments
- add quality suites gradually, starting with the most stable and lightweight ones

## Reporting Expectations

Active suites should be run through `scripts/run-app-suite.cjs` whenever possible.

Report outputs are organized by app and suite:

- HTML: `playwright-report/<app>/<suite>`
- JSON: `test-results/json/<app>-<suite>.json`
- JUnit: `test-results/junit/<app>-<suite>.xml`
- Artifacts: `test-results/artifacts/<app>/<suite>`

Visual snapshot baselines live next to the owning suite under `*-snapshots/`.

## Local Execution Guidance

Common commands:

```bash
npm run test:smoke
npm run test:a11y
npm run test:performance
npm run test:visual
```

App-specific commands:

```bash
npm run test:saucedemo:accessibility
npm run test:cura:visual
npm run test:orangehrm:performance
```

When updating visual baselines, prefer the app-owned update command for the current platform:

```bash
npm run test:cura:visual:update
npm run test:saucedemo:visual:update
npm run test:orangehrm:visual:update
```

If local storage-state bootstrap gets in the way during visual baseline generation, use:

```bash
SKIP_GLOBAL_AUTH_SETUP=1 npm run test:cura:visual:update
```

On PowerShell, the equivalent is:

```powershell
$env:SKIP_GLOBAL_AUTH_SETUP='1'; npm.cmd run test:cura:visual:update
```

## When Adding New Coverage

Before adding a new suite, decide:

1. Is this app-owned, shared, or template coverage?
2. Is this fast enough and stable enough for PR CI?
3. Is this valuable enough for full CI?
4. Does it need environment-specific data or credentials?
5. Does it need visual baselines committed for the current platform?

Recommended rollout order for new quality coverage:

1. Add the suite locally
2. Wire reporting through `run-app-suite`
3. Validate with `--list`
4. Add/update visual baselines if needed
5. Promote one stable suite at a time into full CI

## Current North Star

The framework should stay easy to reason about:

- app behavior lives with the app
- shared framework behavior lives in shared suites
- templates stay available without affecting active runs
- CI stays staged, readable, and intentionally scoped
