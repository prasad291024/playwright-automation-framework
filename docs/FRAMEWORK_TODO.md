# Framework Todo

This checklist tracks the next framework cleanup and improvement steps.

## 1. Move Markdown Documentation Into `docs`

- [ ] Move all root-level Markdown files except `README.md` into `docs/`
- [ ] Update any broken relative links after the move
- [ ] Verify GitHub Actions, Jenkins docs, and contribution docs still point to the correct paths

Markdown files currently at the project root to move:

- [ ] `CODE_REVIEW.md`
- [ ] `CONTRIBUTING.md`
- [ ] `DEPLOYMENT.md`
- [ ] `FRAMEWORK_IMPLEMENTATION.md`
- [ ] `FRAMEWORK_INDEX.md`
- [ ] `playwright-best-practices.md`
- [ ] `PRODUCTION_FRAMEWORK_SUMMARY.md`
- [ ] `PRODUCTION_READINESS.md`
- [ ] `SECURITY.md`
- [ ] `STRUCTURE_REFACTORING.md`

## 2. Improve Authenticated Test Coverage

- [ ] Add authenticated tests that use the shared auth fixture instead of inline login steps
- [ ] Cover at least one protected flow per supported app where auth is available
- [ ] Replace placeholder authenticated examples with real app-specific assertions
- [ ] Confirm storage state reuse works locally and in CI-safe scenarios

## 3. Add OrangeHRM Auth Support

- [ ] Add OrangeHRM credential resolution to the shared auth flow
- [ ] Create or register the OrangeHRM login page object in the auth/session layer
- [ ] Save and reuse `storage-state/orangehrm.json`
- [ ] Add at least one auth smoke test for OrangeHRM
- [ ] Document required `ORANGEHRM_*` environment variables

## 4. Clean Up Framework Structure

- [ ] Remove duplicated old fixture paths where the new core fixture path already exists
- [ ] Consolidate imports so tests use one consistent fixture location
- [ ] Review legacy folders and decide which are still active versus archive/demo only
- [ ] Reduce duplicate app/page object structures where they overlap

## 5. Strengthen Reporting And Suite Organization

- [ ] Standardize app-specific test folder structure and naming
- [ ] Improve reporting outputs for app-specific suites
- [ ] Ensure HTML, JSON, and JUnit outputs are easy to map back to app and suite
- [ ] Add clearer smoke vs regression grouping for each app
- [ ] Review artifact naming so CI reports are easier to scan

## Suggested Execution Order

- [ ] Step 1: Move markdown files into `docs`
- [ ] Step 2: Improve authenticated test coverage
- [ ] Step 3: Add OrangeHRM auth support
- [ ] Step 4: Clean up duplicated fixture/framework paths
- [ ] Step 5: Strengthen reporting and suite organization
