# Quality Gates & Developer Workflow

This framework implements industrial-grade quality gates to ensure production-ready automation code.

## Quality Control Points

### 1. Pre-Pull Checks (Local Developer Guard)

**Purpose**: Prevent bad code from entering the repository
**Trigger**: Git pre-commit hook (via Husky + lint-staged)
**Checks**:

- ESLint rules validation with auto-fix
- Code formatting with Prettier auto-fix
- TypeScript compilation (manual verification)

**Implementation**: `.husky/pre-commit` runs `npx lint-staged`

### 2. Post-Pull Checks (Environment Health)

**Purpose**: Verify developer environment consistency after repository updates
**Trigger**: Manual execution
**Command**: `npm run verify-env`
**Checks**:

- Dependencies installation
- Browser installation
- Code quality validation
- Smoke test execution

### 3. Pre-Merge Checks (Pull Request Validation)

**Purpose**: Validate code meets standards before merge
**Trigger**: Pull Request to main branch
**Pipeline**: `.github/workflows/pr-checks.yml`
**Checks**:

- Linting
- Type checking
- Smoke tests

### 4. Post-Merge Checks (Main Branch Protection)

**Purpose**: Ensure main branch remains production-ready
**Trigger**: Push to main branch
**Pipeline**: `.github/workflows/main-tests.yml`
**Checks**:

- Full regression test suite
- Report generation and artifact upload

## Test Tagging Strategy

Tests are tagged for selective execution:

- `@smoke`: Core health tests (fast, critical path)
- `@regression`: Full test suite
- `@critical`: High-risk business flows

## Flaky Test Protection

- **Retries**: 2 retries on CI, 0 locally
- **Diagnostics**: Trace, video, and screenshots on failure

## Developer Workflow

### Standard Development Flow

1. **Sync and Verify Environment**

   ```bash
   git pull
   npm run verify-env
   ```

2. **Develop Feature**
   - Write code following established patterns
   - Add appropriate test tags
   - Ensure TypeScript types are correct

3. **Commit Changes**
   - Pre-commit hook runs automatically
   - Validates linting, types, and formatting

4. **Create Pull Request**
   - Push feature branch
   - Create PR targeting main

5. **PR Validation**
   - GitHub Actions validates code quality
   - Reviews and approvals required

6. **Merge to Main**
   - Squash merge after approvals
   - Main branch pipeline runs full regression

## Repository Protection

Configure GitHub branch protection for `main`:

- Require PR reviews
- Require status checks (lint, typecheck, tests)
- Prevent direct pushes
- Require linear history

## Quality Metrics

The framework enforces:

- ✅ Linting discipline
- ✅ TypeScript correctness
- ✅ Deterministic formatting
- ✅ Stable CI execution
- ✅ Protected main branch
- ✅ Automated regression verification

This transforms the repository from a test project into a production-grade automation platform.
