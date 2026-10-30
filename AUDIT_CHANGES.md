# Playwright Hardening Changes

## Per-phase summary

### Phase 0 — Baseline

- No project files changed. Work continued on `chore/audit-hardening`.
- Baseline: `npm audit` reported 67 vulnerabilities (49 moderate, 17 high, 1 critical); `npm outdated` listed 8 packages. `npm run typecheck` and `npm run lint` passed. Playwright discovery listed 184 tests in 27 files.
- The tracked-file scan matched `.env.example`, `test-data/fixtures/login.env.json`, `test-data/storage-state/README.md`, and `tests/shared/auth/storage-state.spec.ts`. The maintainer confirmed the fixture contains only public demo values/placeholders and the other matches are false positives.
- The pre-existing `.claude-flow/mods/session.json` modification was not staged or committed.

### Phase 1 — Secret scanning

- Added a full-history Gitleaks workflow job (`fetch-depth: 0`) with read-only contents permissions. Added `.gitleaks.toml` to document the narrow allowlist for the maintainer-confirmed public demo fixture and values.
- Kept `scripts/secret-detection.js` as a separate local hook.
- Files: `.github/workflows/ci.yml`, `.gitleaks.toml`.
- Commits: `49a9118`, `875ed19` (workflow structure correction).
- Verification: typecheck and lint passed. The hosted Gitleaks scan was not run locally; CI must provide its result.

### Phase 2 — CI hardening

- Added least-privilege workflow permissions, verified SHA pins for third-party actions, job timeouts and concurrency controls. Separated SARIF upload and container publishing so write permissions are scoped to their respective jobs.
- Added weekly grouped npm/GitHub Actions Dependabot updates, `.nvmrc` (Node 24), and `engines.node` (`>=20`).
- Files: `.github/dependabot.yml`, `.github/workflows/ci.yml`, `.github/workflows/codeql.yml`, `.github/workflows/container.yml`, `.nvmrc`, `package.json`, `package-lock.json`.
- Commit: `1d1293b`.
- Verification: typecheck/lint passed; workflow YAML and action pin/timeout/engine consistency checks passed. No Firefox/WebKit PR gating was added.

### Phase 3 — Credential handling

- Removed generic `USERNAME`/`PASSWORD` fallbacks and centralized explicitly named public demo credential defaults. Added clear missing-credential errors where no public default exists.
- Updated `.env.example`, user documentation and the Gitleaks allowlist.
- Files: `.env.example`, `.gitleaks.toml`, `README.md`, `docs/SECURITY.md`, `src/apps/cura/CuraApp.ts`, `src/apps/cura/test-data/users.ts`, `src/apps/saucedemo/test-data/users.ts`, `src/config/public-demo-credentials.ts`, `src/core/auth/auth-session.ts`, `tests/orangehrm/01-auth/login-data-driven.spec.ts`, `tests/templates/07-smoke-testing/smoke.template.ts`, `tests/templates/apps/vwo.com/01-auth/vwo-login.template.ts`.
- Commit: `da5333e`.
- Verification: typecheck/lint/test discovery passed; source/tests and `.env.example` searches found no remaining generic credential fallbacks.

### Phase 4 — Playwright lint rules

- Enabled `eslint-plugin-playwright` recommended rules and configured the requested rules. Safe title cleanup was applied; legacy or app-gated cases remain warnings rather than having test behavior changed.
- Files: `.eslintrc.cjs`, `package.json`, `package-lock.json`, `tests/shared/api/user-api.spec.ts`.
- Commit: `083871a`.
- Verification: typecheck and discovery passed; lint passed with warnings. The final lint run reports 0 errors and 105 warnings.

### Phase 5 — Hard waits

- Replaced manual time/count/visibility polling with `expect.poll`, `toHaveCount`, or `toBeVisible`; removed fallback and post-scroll delays. The network-stable helper now waits for `domcontentloaded`; the helper name is retained for compatibility, but it no longer guarantees network-idle stability.
- Before/after call-site summary:
  - `waitForNetworkIdle`: removed the 500 ms fallback sleep; network-idle timeout now surfaces to callers.
  - `waitForAllConditions`: 100 ms manual polling loop → `expect.poll`.
  - `waitForElementCount`: 100 ms manual count loop → `expect(locator).toHaveCount`.
  - `waitForNetworkStable`: network-idle-plus-delay fallback → `domcontentloaded`; condition polling loop → `expect.poll`.
  - `waitForStableVisibility`: repeated visibility checks and 100/300 ms sleeps → `expect(locator).toBeVisible`.
  - `scrollIntoViewStable`: removed the 200 ms post-scroll sleep.
  - `retryWithBackoff`: retained retry delay, capped at 2 seconds.
  - `resilientType`: retained per-character delay, capped at 250 ms.
  - Realtime template: retained its 500 ms offline interval because the generic template has no application-specific reconnect signal; a narrow lint disable documents that exception.
  - The explicit network-idle helper retains `waitForLoadState('networkidle')` with a narrow lint disable; its failure is no longer hidden by a sleep.
- Files: `src/core/utils/waitUtils.ts`, `src/utils/flakeHelper.ts`, `src/pages/BasePage.ts`, `src/pages/base/BasePage.ts`, `tests/templates/04-advanced-features/realtime.template.ts`.
- Commit: `8079695`.
- Verification: typecheck, lint, test discovery, Prettier, and `git diff --check` passed.

### Phase 6 — Locator migration

- Measurement used the installed TypeScript compiler API to parse all 98 `.ts`/`.tsx` files under `src/` and `tests/`. It counts calls to the five requested semantic methods, `locator()` as CSS/XPath, and `nth()`/`first()`/`last()` as positional. These are source call counts, not runtime locator-use or test-coverage measures.
- Before migration: 90 semantic, 120 `locator()`, 22 positional calls; 39 files contained locator calls. `CuraAppointmentPage` and `CuraLoginPage` tied at 11 brittle calls; the appointment page had more `locator()` calls (10 vs. 9) and fewer semantic calls (0 vs. 4), so it was selected.
- Migrated only `CuraAppointmentPage` to `getByLabel`/`getByRole`, removed its obsolete appointment selector entries from `src/config/cura.config.ts`, and preserved its public methods.
- After migration: 94 semantic, 111 `locator()`, 22 positional calls; still 39 files with calls. The selected page changed from 0/10/1 to 4/1/1 (semantic/CSS-XPath/positional); the remaining CSS call is its date-picker day-cell selector.
- Files: `src/pages/apps/cura/pages/CuraAppointmentPage.ts`, `src/config/cura.config.ts`.
- Verification: typecheck passed; lint passed with 0 errors and 105 warnings; safe test discovery listed 184 tests in 27 files; AST measurement and `git diff --check` passed. No browser tests were run against the public demo site.

## Locator measurement by file (before migration)

Counts are `semantic | locator() CSS/XPath | positional`.

| File                                                                    |       Counts |
| ----------------------------------------------------------------------- | -----------: |
| `src/pages/apps/cura/pages/CuraLoginPage.ts`                            |  4 \| 9 \| 2 |
| `src/pages/apps/cura/pages/CuraAppointmentPage.ts`                      | 0 \| 10 \| 1 |
| `tests/templates/09-accessibility-testing/legacy-a11y.template.ts`      |  0 \| 9 \| 2 |
| `src/pages/LoginPage.ts`                                                | 15 \| 9 \| 1 |
| `tests/templates/04-advanced-features/realtime.template.ts`             |  0 \| 9 \| 0 |
| `src/pages/apps/vwo/pages/VwoLoginPage.ts`                              |  2 \| 5 \| 2 |
| `tests/templates/10-visual-regression/visual-regression.template.ts`    |  2 \| 3 \| 4 |
| `tests/saucedemo/04-accessibility-testing/a11y.spec.ts`                 |  1 \| 5 \| 2 |
| `src/pages/apps/saucedemo/pages/SauceDemoInventoryPage.ts`              |  0 \| 6 \| 1 |
| `src/pages/apps/orangehrm/pages/OrangeHrmDashboardPage.ts`              | 15 \| 3 \| 3 |
| `src/pages/apps/saucedemo/pages/SauceDemoLoginPage.ts`                  |  2 \| 6 \| 0 |
| `src/pages/apps/saucedemo/pages/SauceDemoCartPage.ts`                   |  0 \| 5 \| 1 |
| `src/pages/apps/orangehrm/pages/OrangeHrmLoginPage.ts`                  |  3 \| 5 \| 0 |
| `src/pages/DashboardPage.ts`                                            |  8 \| 4 \| 0 |
| `src/apps/orangehrm/OrangeHrmApp.ts`                                    |  4 \| 2 \| 2 |
| `tests/cura/04-accessibility-testing/a11y.spec.ts`                      |  2 \| 4 \| 0 |
| `src/utils/assertions.ts`                                               |  0 \| 4 \| 0 |
| `tests/orangehrm/04-accessibility-testing/a11y.spec.ts`                 |  1 \| 3 \| 0 |
| `src/apps/cura/CuraApp.ts`                                              |  0 \| 3 \| 0 |
| `src/pages/ProfilePage.ts`                                              |  3 \| 2 \| 0 |
| `src/pages/SearchPage.ts`                                               |  2 \| 2 \| 0 |
| `src/core/auth/auth-session.ts`                                         |  0 \| 2 \| 0 |
| `src/pages/apps/cura/pages/CuraConfirmationPage.ts`                     |  0 \| 2 \| 0 |
| `src/pages/base/BasePage.ts`                                            |  5 \| 1 \| 0 |
| `src/pages/BasePage.ts`                                                 |  5 \| 1 \| 0 |
| `src/pages/RegisterPage.ts`                                             |  2 \| 1 \| 0 |
| `tests/templates/08-performance-testing/legacy-performance.template.ts` |  1 \| 0 \| 1 |
| `tests/cura/06-visual-regression/visual-regression.spec.ts`             |  0 \| 1 \| 0 |
| `tests/orangehrm/06-visual-regression/visual-regression.spec.ts`        |  0 \| 1 \| 0 |
| `tests/orangehrm/smoke/app-smoke.spec.ts`                               |  0 \| 1 \| 0 |
| `tests/saucedemo/06-visual-regression/visual-regression.spec.ts`        |  0 \| 1 \| 0 |
| `tests/templates/02-interactions/register-form.template.ts`             |  0 \| 1 \| 0 |
| `tests/shared/auth/authenticated.spec.ts`                               |  3 \| 0 \| 0 |
| `tests/templates/05-page-object-model/authenticated.template.ts`        |  3 \| 0 \| 0 |
| `tests/cura/smoke/app-smoke.spec.ts`                                    |  2 \| 0 \| 0 |
| `tests/templates/01-fundamentals/playwright-example.template.ts`        |  2 \| 0 \| 0 |
| `tests/orangehrm/05-performance-testing/performance.spec.ts`            |  1 \| 0 \| 0 |
| `tests/saucedemo/smoke/app-smoke.spec.ts`                               |  1 \| 0 \| 0 |
| `tests/templates/07-smoke-testing/smoke.template.ts`                    |  1 \| 0 \| 0 |

## Remaining page objects ranked by brittle-call count

Priority is CSS/XPath `locator()` plus positional calls; ties are alphabetical.

| Rank | File                                                       | Semantic | CSS/XPath | Positional | Brittle total |
| ---: | ---------------------------------------------------------- | -------: | --------: | ---------: | ------------: |
|    1 | `src/pages/apps/cura/pages/CuraLoginPage.ts`               |        4 |         9 |          2 |            11 |
|    2 | `src/pages/LoginPage.ts`                                   |       15 |         9 |          1 |            10 |
|    3 | `src/pages/apps/saucedemo/pages/SauceDemoInventoryPage.ts` |        0 |         6 |          1 |             7 |
|    4 | `src/pages/apps/vwo/pages/VwoLoginPage.ts`                 |        2 |         5 |          2 |             7 |
|    5 | `src/pages/apps/orangehrm/pages/OrangeHrmDashboardPage.ts` |       15 |         3 |          3 |             6 |
|    6 | `src/pages/apps/saucedemo/pages/SauceDemoCartPage.ts`      |        0 |         5 |          1 |             6 |
|    7 | `src/pages/apps/saucedemo/pages/SauceDemoLoginPage.ts`     |        2 |         6 |          0 |             6 |
|    8 | `src/pages/apps/orangehrm/pages/OrangeHrmLoginPage.ts`     |        3 |         5 |          0 |             5 |
|    9 | `src/pages/DashboardPage.ts`                               |        8 |         4 |          0 |             4 |
|   10 | `src/pages/apps/cura/pages/CuraConfirmationPage.ts`        |        0 |         2 |          0 |             2 |
|   11 | `src/pages/ProfilePage.ts`                                 |        3 |         2 |          0 |             2 |
|   12 | `src/pages/SearchPage.ts`                                  |        2 |         2 |          0 |             2 |
|   13 | `src/pages/base/BasePage.ts`                               |        5 |         1 |          0 |             1 |
|   14 | `src/pages/BasePage.ts`                                    |        5 |         1 |          0 |             1 |
|   15 | `src/pages/RegisterPage.ts`                                |        2 |         1 |          0 |             1 |

## Commands and outcomes

| Command/check                | Outcome                                                                                                                         |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `npm audit` (baseline)       | 67 findings: 49 moderate, 17 high, 1 critical; no force remediation applied.                                                    |
| `npm outdated` (baseline)    | 8 packages listed as outdated.                                                                                                  |
| `npm run typecheck`          | Passed at baseline and after each implementation phase; final run passed.                                                       |
| `npm run lint`               | Passed; final run had 0 errors and 105 warnings, primarily existing legacy Playwright patterns and intentional app-gated skips. |
| `npx playwright test --list` | 184 tests in 27 files. Final discovery used a temporary preload to prevent dotenv and storage-state access.                     |
| `git diff --check`           | Passed for the final source changes.                                                                                            |
| Gitleaks full-history scan   | Not run locally; the CI job must execute to verify.                                                                             |
| Full Playwright suite        | Not run; the project includes external demo applications and credential-dependent scenarios.                                    |

## Quick wins

- Review and progressively fix the remaining lint warnings, starting with unsafe or ambiguous waits and assertion patterns.
- Run the Gitleaks full-history job in CI and triage any findings without adding broad allowlists.
- Run focused CURA appointment tests against the configured demo environment to verify its accessible labels and button name.

## Prioritized roadmap

### Now

- Confirm CI's Gitleaks run and review all findings.
- Have a maintainer verify no non-demo credentials were ever committed; rotate any such credentials outside this repository if found.
- Verify CURA appointment semantic locators against the live demo or a controlled test environment.

### Next

- Convert the top-ranked remaining page objects to semantic locators in separate, measured changes.
- Reduce the 105 lint warnings incrementally without changing app-gated test behavior blindly.
- Add focused tests for wait helpers and run suitable browser tests in a credential-safe environment.

### Later

- Consider scheduled cross-browser coverage, API-based setup/teardown, accessibility automation, and flaky-test tracking after CI capacity and service credentials are confirmed.
- Add/verify repository ownership and contribution/security metadata where maintainers want them.

## Items not verified / manual follow-ups

- The Gitleaks workflow has not run in hosted CI; its full-history scan result is unknown.
- No complete test suite or live browser test was run, so the CURA labels and button accessible name have not been verified against the external demo.
- No credential rotation was performed. The known CURA/SauceDemo values were treated as public demo credentials based on maintainer confirmation; whether any private credential was used elsewhere in Git history remains for maintainers to verify.
- The baseline Playwright listing invoked `playwright.config.ts`, which loaded dotenv and checked storage-state freshness. No values were printed and no file was directly opened by the operator, but the configuration performed implicit reads contrary to the intended safety boundary. Subsequent discovery used a temporary preload to disable dotenv loading and storage-state checks. No `.env`, storage-state, trace, or report file was intentionally opened or modified.
- The locator AST count measures source call expressions only; it does not prove which runtime branch executes or whether a locator uniquely matches.
- No dependency remediation was performed. `npm audit` proposed a force path involving a breaking Ruflo change, which was not applied.
- The pre-existing `.claude-flow/mods/session.json` worktree change is intentionally not part of this work or its commits.

## Questions for maintainers

- Should the explicitly public demo credentials remain the default for local runs, or should all credentials be supplied through app-specific environment variables?
- Should test discovery continue to load `.env` and inspect configured storage state, or should configuration make those checks opt-in for read-only discovery?
- Which CI environment can safely run the CURA/SauceDemo integration tests and validate the new accessible-name locators?
