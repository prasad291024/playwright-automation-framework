# npm Dependency Audit

**Date:** 2026-10-30  
**Branch:** `chore/dependency-audit`, based on `chore/audit-hardening` at `a633c8d`

## Summary

- Baseline `npm audit --json` exited with code 1 and reported **67 vulnerabilities**: 49 moderate, 17 high, and 1 critical.
- The only directly declared vulnerable package is `ruflo`, in `devDependencies`. All other critical/high entries are transitive.
- `package.json` has no runtime `dependencies`. After remediation, `npm audit --omit=dev --json` reported **0 vulnerabilities**.
- `npm audit fix` (without `--force`) changed the lockfile but exited 1 because critical/high findings remained. Total findings dropped to 65: 47 moderate, 17 high, and 1 critical.
- No overrides were added. Remaining fixes either require a breaking/out-of-range package version or lack a verified compatible target for the exact dependency pins.

## Baseline critical and high findings

Classification uses the baseline lockfile and root manifest. All listed findings are in the development dependency tree; the production-only audit confirms zero runtime findings. “npm fix target” records npm’s `fixAvailable` field, not a claim that the target is appropriate for this branch.

| Severity     | Package                              | Baseline version(s)                    | Directness / scope         | Patched version or npm fix target                                                                                                                               | Disposition                                                                      |
| ------------ | ------------------------------------ | -------------------------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| High         | `@claude-flow/cli`                   | 3.63.8                                 | Transitive / dev-only      | `ruflo@3.32.29` (npm marks major)                                                                                                                               | Requires maintainer decision; not applied                                        |
| High         | `@claude-flow/memory`                | 3.1.0                                  | Transitive / dev-only      | `ruflo@3.32.29` (npm marks major)                                                                                                                               | Requires maintainer decision; not applied                                        |
| High         | `@claude-flow/neural`                | 3.0.1                                  | Transitive / dev-only      | `ruflo@3.32.29` (npm marks major)                                                                                                                               | Requires maintainer decision; not applied                                        |
| High         | `@claude-flow/security`              | 3.0.5                                  | Transitive / dev-only      | `ruflo@3.32.29` (npm marks major)                                                                                                                               | Bundled under `@claude-flow/cli`; npm says it cannot fix automatically           |
| High         | `@claude-flow/shared`                | 3.0.6                                  | Transitive / dev-only      | `ruflo@3.32.29` (npm marks major)                                                                                                                               | Requires maintainer decision; not applied                                        |
| High         | `@opentelemetry/exporter-prometheus` | 0.218.0, 0.52.1                        | Transitive / dev-only      | GHSA-q7rr-3cgh-j5r3 recommends `0.217.0+`; npm’s aggregate affected range includes `<=0.218.0` and suggests `ruflo@3.32.29` (major)                             | Conflicting range evidence; no override                                          |
| High         | `@opentelemetry/propagator-jaeger`   | 2.7.1, 1.25.1                          | Transitive / dev-only      | GHSA-45rx-2jwx-cxfr recommends `2.9.0+`; npm says a compatible fix exists but does not name it                                                                  | The 1.x installation needs a major jump; exact parent pins remain                |
| High         | `@opentelemetry/sdk-node`            | 0.218.0, 0.52.1                        | Transitive / dev-only      | npm says a compatible fix exists but does not name a version; the related GHSA recommends `0.217.0+`, while npm’s remaining aggregate range reaches `<=0.219.0` | No verified compatible target; upgrade decision needed                           |
| High         | `@opentelemetry/sdk-trace-node`      | 2.7.1, 1.25.1                          | Transitive / dev-only      | npm says a compatible fix exists but does not name a version                                                                                                    | Multiple exact pins/major lines; no override                                     |
| High         | `@xenova/transformers`               | 2.17.2                                 | Transitive / dev-only      | `ruflo@3.32.29` (npm marks major)                                                                                                                               | Requires maintainer decision; not applied                                        |
| High         | `agentdb`                            | 3.0.0-alpha.20, 2.0.0-alpha.3.7, 1.6.1 | Transitive / dev-only      | `ruflo@3.32.29` (npm marks major)                                                                                                                               | Requires maintainer decision; not applied                                        |
| High         | `agentic-flow`                       | 3.0.0-alpha.2                          | Transitive / dev-only      | `ruflo@3.32.29` (npm marks major)                                                                                                                               | Requires maintainer decision; not applied                                        |
| High         | `onnx-proto`                         | 4.0.4                                  | Transitive / dev-only      | `ruflo@3.32.29` (npm marks major)                                                                                                                               | Requires maintainer decision; not applied                                        |
| High         | `onnxruntime-web`                    | 1.14.0                                 | Transitive / dev-only      | `ruflo@3.32.29` (npm marks major)                                                                                                                               | Requires maintainer decision; not applied                                        |
| **Critical** | `protobufjs`                         | 6.11.6                                 | Transitive / dev-only      | `7.6.3+` addresses the latest reported advisory; npm’s only named fix is `ruflo@3.32.29` (major)                                                                | Upgrade from 6.x to 7.x is breaking; requires approval                           |
| High         | `ruflo`                              | 3.63.8                                 | **Direct `devDependency`** | `3.32.29` (npm marks major and it is outside the declared `^3.51.0` range)                                                                                      | Not applied; requires maintainer decision                                        |
| High         | `sharp`                              | 0.32.6                                 | Transitive / dev-only      | `0.35.5+` addresses the latest reported advisory; npm’s only named fix is `ruflo@3.32.29` (major)                                                               | 0.x minor-line change is outside the current compatible range; requires approval |
| High         | `zod`                                | 3.25.76                                | Transitive / dev-only      | `4.6.6+`                                                                                                                                                        | Major upgrade; requires approval                                                 |

The advisory scan returned 17 CVE records; its result identified affected dependency paths including OpenTelemetry, protobufjs, sharp, and zod. The scan's package-specific recommendations are reflected in the table. npm’s aggregate `fixAvailable` target for many dependency-chain findings is a `ruflo@3.32.29` major/out-of-range change; it was not applied.

## `npm audit fix` result and diff

Command run: `npm audit fix` (**no `--force`**).

- npm reported: **added 1 package, removed 2 packages, changed 13 packages**, audited 1,203 packages.
- Exit code: **1**; npm still reported vulnerabilities.
- The first `npm ci` attempt failed because the lockfile produced by `npm audit fix` did not satisfy several Octokit/router dependency edges. `npm install --package-lock-only --ignore-scripts` repaired the lock metadata without changing `package.json`; the subsequent `npm ci` passed.
- Final Git diff: `package-lock.json` only, **754 insertions / 633 deletions**. `package.json` was unchanged. Compared with the base lock, 33 package entries changed, were added, or were removed; this includes nested Octokit entries required to satisfy the parents' declared ranges.
- The lockfile version changes were:
  - `@ai-sdk/google` 3.0.139 → 3.0.140
  - `@ai-sdk/provider-utils` 4.0.62 → 4.0.63
  - `@claude-flow/cli` 3.63.8 → 3.65.0
  - `@grpc/grpc-js` 1.14.6 → 1.14.7
  - `@metaharness/router` 0.4.0 → 0.3.2
  - `express-rate-limit` 8.7.1 → 8.7.2
  - `gaxios` 6.7.1 → 6.3.0
  - `ruflo` 3.63.8 → 3.65.0
- Seven lock entries were removed: `@octokit/core`, `@ruvector/tiny-dancer`, nested `zod`, nested `jose`, nested `@metaharness/router`, `marked`, and `uuid`.

## Remaining fixes and override assessment

No `overrides` were added:

- npm’s named `ruflo@3.32.29` fix is flagged as major and outside the declared `^3.51.0` range. The `npm audit fix` update to 3.65.0 stayed within the manifest range but did not clear the high/critical dependency chains.
- The protobufjs fix is in 7.x, while the installed version is 6.11.6.
- The sharp fix is 0.35.5+, while the installed 0.32.6 dependency is constrained to its 0.32 line; npm registry lookup found no newer 0.32 release.
- The zod fix is 4.6.6+, a major upgrade from 3.x.
- The OpenTelemetry dependency tree contains exact 1.25.1 / 2.7.1 / 0.52.1 pins. The Jaeger recommendation of 2.9.0+ cannot fix the 1.x instance without a major upgrade, and forcing the other versions would override exact pins without a verified compatible release matrix. npm registry lookups found no newer releases in the currently pinned 0.52, 1.25, and 2.7 minor lines.

These remaining dependency changes need maintainer approval before making major or out-of-range updates.

## Post-fix validation

| Command                       | Result                                                                                                                   |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `npm audit --json`            | Exit 1; **65 total**: 47 moderate, 17 high, 1 critical                                                                   |
| `npm audit --omit=dev --json` | **0 vulnerabilities**                                                                                                    |
| `npm run typecheck`           | Passed                                                                                                                   |
| `npm run lint`                | Passed with 0 errors and 105 warnings                                                                                    |
| `npx playwright test --list`  | Passed; 184 tests in 27 files                                                                                            |
| `npm ci`                      | Passed after lock metadata repair; npm emitted a Windows `EPERM` cleanup warning for a nested optional package directory |

Test discovery used a temporary preload to prevent dotenv loading and storage-state freshness checks. No `.env` or storage-state files were opened. No full Playwright suite was run.

## Follow-up decision

Approve or decline the breaking/out-of-range upgrades: the Ruflo dependency graph, protobufjs 7.x, sharp 0.35.x, zod 4.x, and a coordinated OpenTelemetry upgrade. No changes were committed or pushed.
