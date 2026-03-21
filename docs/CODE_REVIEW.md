# Code Review Checklist

This checklist ensures code quality, consistency, and best practices across the Playwright framework.

## Pre-Merge Requirements

### Code Quality

- [ ] All tests pass locally: `npm test`
- [ ] No linting errors: `npm run lint`
- [ ] Prettier formatting applied: `npm run format`
- [ ] TypeScript strict mode passes: `npm run typecheck`
- [ ] No console.log() or debug statements left in code
- [ ] No hardcoded URLs, credentials, or sensitive data

### Test Coverage

- [ ] New code has corresponding tests
- [ ] Test names are descriptive and follow naming conventions
- [ ] Tests follow Arrange-Act-Assert pattern
- [ ] No test.only() or test.skip() left in commits
- [ ] Edge cases are covered (empty state, errors, boundary values)

### Page Object Model & Architecture

- [ ] New page objects extend `BasePage`
- [ ] Page objects implement relevant interfaces from `src/interface/pages.interface.ts`
- [ ] Selectors use preferred priority: testId > role > placeholder > text
- [ ] No query selectors hardcoded in tests (use centralized selectors)
- [ ] Page navigation methods use `goto()` or `navigateTo()`

### API Testing

- [ ] API calls use `ApiHelper` with schema validation
- [ ] Response schemas added to `schemas/` directory
- [ ] API error scenarios tested
- [ ] Request/response payloads typed
- [ ] Base URLs use environment variables

### Documentation

- [ ] README or comments explain non-obvious test logic
- [ ] Complex selectors documented with rationale
- [ ] Test data sources documented (fixtures, API, etc.)
- [ ] Any custom utilities have JSDoc comments

### Git & Commit

- [ ] Commits are atomic (single feature/fix per commit)
- [ ] Commit messages follow format: "Brief description + details"
- [ ] Branch name follows convention: `feature/`, `bugfix/`, `docs/`
- [ ] No merge conflicts
- [ ] Branch is up-to-date with main

### Performance & Reliability

- [ ] No hardcoded waits (use `waitForLoadState()`, `waitForSelector()`)
- [ ] Timeouts are reasonable and set via playwright.config.ts
- [ ] Tests work reliably multiple runs (no flakiness)
- [ ] Network/API mocking handled properly

### Accessibility & UI Best Practices

- [ ] New UI features are keyboard navigable
- [ ] ARIA labels considered for dynamic elements
- [ ] Color contrast is sufficient
- [ ] Tests don't rely on visual positioning alone

### Dependencies

- [ ] New packages are necessary and justified
- [ ] Dev vs prod dependencies correctly specified
- [ ] No duplicate or conflicting versions
- [ ] Security vulnerabilities checked: `npm audit`

---

## Review Checklist (For Reviewers)

### Functionality

- [ ] Changes accomplish stated goal
- [ ] Code solves the problem, not a symptom
- [ ] Logic is clear and maintainable
- [ ] No workarounds or hacks without explanation

### Testing Quality

- [ ] Tests are focused and not testing framework
- [ ] Test assertions verify meaningful behavior
- [ ] Setup/teardown is minimal and clean
- [ ] Tests are independent and can run in any order

### Code Style & Consistency

- [ ] Follows existing patterns in codebase
- [ ] Consistent with TypeScript strict mode
- [ ] Variable/function names are clear
- [ ] No code duplication (reuse existing utilities)

### Security

- [ ] No credentials exposed
- [ ] `.env` not committed
- [ ] Sensitive data logged only in CI/CD
- [ ] External API calls handle errors gracefully

### Documentation

- [ ] Changes documented if needed
- [ ] Complex logic explained with comments
- [ ] Public APIs have JSDoc

---

## Common Issues to Look For

⚠️ **High Priority**

- Hardcoded credentials or sensitive data
- Tests that flake intermittently
- Framework code directly in test files
- test.only() or test.skip() in production code

⚠️ **Medium Priority**

- Missing or incomplete test data
- Inconsistent selector strategies
- No schema validation for API responses
- Overly long or complex tests (refactor into smaller pieces)

✅ **Nice to Have**

- Performance metrics captured
- Edge cases documented
- Accessibility considerations noted

---

## Approval Process

### Minimum Approvals Required

- 1 approval for documentation-only changes
- 2 approvals for code changes affecting tests/framework
- 1 approval from maintainer for infrastructure/CI changes

### Merge Criteria

✅ All checks must pass:

- GitHub Actions CI/CD pipeline
- Code review approval(s)
- No merge conflicts
- Commit history is clean

### Post-Merge

- [ ] Monitor CI/CD for new failures
- [ ] Watch for flaky test reports
- [ ] Update related documentation if needed
