# Deployment & Production Guide

## Overview

This guide covers deploying the Playwright Automation Framework to production environments, setting up CI/CD pipelines, and maintaining test suites in production.

---

## 1. Environment Setup

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git for version control
- GitHub account with repository access

### Local Development Setup

```bash
# Clone repository
git clone https://github.com/yourusername/playwright-automation-framework.git
cd playwright-automation-framework

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Copy environment template
cp .env.example .env

# Update .env with your configuration
# Edit: BASE_URL, API_BASE_URL, USERNAME, PASSWORD, etc.

# Run tests locally
npm test
```

---

## 2. Production Configuration

### Environment Variables

Create `.env.production` with production-specific values:

```bash
# Production URLs
BASE_URL=https://your-production-app.com
API_BASE_URL=https://api.your-production-app.com

# Authentication
USERNAME=${PROD_USERNAME}
PASSWORD=${PROD_PASSWORD}

# Execution Settings
TEST_EXECUTION_ENV=PRODUCTION
CI=true
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

# API Configuration
ACTION_TIMEOUT=10000
NAVIGATION_TIMEOUT=15000

# Realtime Testing (if applicable)
REALTIME_EMIT_PATH=https://api.your-app.com/api/realtime/emit
```

### Secrets Management

**Using GitHub Secrets:**

1. Go to Repository → Settings → Secrets and Variables → Actions
2. Add secrets:
   - `PROD_USERNAME` - Production test user
   - `PROD_PASSWORD` - Production test password
   - `API_BASE_URL` - Production API endpoint
   - `SLACK_WEBHOOK` - For notifications
   - `DATABASE_URL` - If needed for setup/teardown

**Reference in Workflows:**

```yaml
env:
  USERNAME: ${{ secrets.PROD_USERNAME }}
  PASSWORD: ${{ secrets.PROD_PASSWORD }}
```

---

## 3. CI/CD Pipeline Deployment

### GitHub Actions Workflow

The framework includes `.github/workflows/test.yml` with:

✅ **Features:**

- Multi-browser testing (Chromium, Firefox, WebKit)
- Multi-platform testing (Ubuntu, Windows, macOS)
- Scheduled daily runs at 2 AM UTC
- Pull request validation
- Test artifact upload
- Slack notifications

### Scheduled Test Runs

Tests run on a schedule to catch regressions:

```yaml
schedule:
  - cron: '0 2 * * *' # Daily at 2 AM UTC
  - cron: '0 9 * * 1' # Weekly on Monday at 9 AM UTC
```

### Manual Test Runs

Trigger tests manually via GitHub UI:

1. Go to Actions tab
2. Select "Playwright Tests" workflow
3. Click "Run workflow"
4. Select branch and click "Run"

---

## 4. Docker Deployment

### Building Docker Image

```bash
docker build -t playwright-tests:latest .
```

### Running Tests in Docker

```bash
# Run headless tests
docker-compose run test

# Run tests with display (headed mode)
docker-compose run --env HEADED=true test

# Run specific test file
docker-compose run test npx playwright test tests/path/to/test.spec.ts
```

### Production Docker Workflow

```dockerfile
# In your Dockerfile
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /app
COPY package*.json ./
RUN npm ci
RUN npx playwright install --with-deps

COPY . .

# Run on container startup
CMD ["npm", "test"]
```

---

## 5. Pre-Deployment Checklist

Before deploying to production:

- [ ] All tests pass locally: `npm test`
- [ ] All linting checks pass: `npm run lint`
- [ ] TypeScript compilation succeeds: `npm run typecheck`
- [ ] Test data is production-ready
- [ ] API endpoints verified in production
- [ ] Database/service credentials configured
- [ ] Slack webhook configured for notifications
- [ ] GitHub secrets updated
- [ ] Docker image builds successfully
- [ ] Load/performance tested (if needed)

---

## 6. Deployment Steps

### Step 1: Prepare Release

```bash
# Create release branch
git checkout -b release/v1.0.0

# Update version in package.json
npm version patch  # or minor/major

# Commit and push
git add .
git commit -m "Release v1.0.0"
git push origin release/v1.0.0
```

### Step 2: Create Pull Request

- Create PR from release branch to main
- Add release notes
- Request code review
- Ensure all CI checks pass

### Step 3: Merge and Tag

```bash
# After PR approval, merge to main
git checkout main
git pull origin main
git merge release/v1.0.0

# Create git tag
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin main --tags
```

### Step 4: Monitor Deployment

1. Monitor GitHub Actions for test results
2. Check Slack notifications
3. Review any failed tests
4. Monitor production app for issues

---

## 7. Post-Deployment

### Monitoring & Alerts

- **Daily Test Runs:** Automated via cron schedule
- **PR Validations:** Automatic on every pull request
- **Slack Notifications:** Sent on test failures
- **HTML Reports:** Artifacts uploaded for 7 days

### Troubleshooting

**Tests Failing in Production:**

1. Check test execution logs in GitHub Actions
2. Download HTML report from artifacts
3. Review test videos for failure cause
4. Check if production environment is healthy
5. Verify credentials and API endpoints
6. Update selectors if UI changed (get latest screenshots)

**Flaky Tests:**

1. Identify tests that fail intermittently
2. Review test logs and videos
3. Add explicit waits instead of implicit
4. Increase timeouts if necessary
5. Mock external dependencies if possible

**Performance Issues:**

1. Check navigation timeouts
2. Verify network connectivity
3. Monitor API response times
4. Scale CI/CD resources if needed

---

## 8. Maintenance & Updates

### Regular Maintenance Tasks

**Weekly:**

- Review test failure reports
- Check for flaky tests
- Monitor CI/CD performance

**Monthly:**

- Update Playwright version: `npm update @playwright/test`
- Review and update test data
- Check dependency security: `npm audit`
- Clean up old test artifacts

**Quarterly:**

- Review and update test coverage
- Optimize slow tests
- Archive test reports
- Plan new test scenarios

### Updating Playwright Version

```bash
# Check current version
npm list @playwright/test

# Update to latest
npm update @playwright/test

# Test with new version
npm test

# Commit changes
git add package.json package-lock.json
git commit -m "Upgrade Playwright to v1.x"
```

---

## 9. Troubleshooting Guide

### Common Issues

#### Issue: Tests timeout in CI but pass locally

**Solution:**

- Increase timeout in `playwright.config.ts`
- Check CI environment network connectivity
- Mock slower APIs
- Run tests with more debug output

#### Issue: Port conflicts in Docker

**Solution:**

```bash
# Kill process on port 3000
Kill -9 $(lsof -t -i:3000)

# Or use different port
docker-compose -p different_name run test
```

#### Issue: Secrets not available in workflow

**Solution:**

- Verify secret exists in GitHub Settings
- Check secret name matches exactly
- Verify `${{ secrets.SECRET_NAME }}` syntax
- Secrets must be referenced in job/step

#### Issue: Storage state not

persisting

**Solution:**

```bash
# Regenerate storage state
rm storage-state/<app>.json
npm run test  # This will trigger global-setup
```

For local debugging, you can bypass the auth bootstrap layer entirely when you do not need saved login state:

```bash
SKIP_GLOBAL_AUTH_SETUP=1
```

---

## 10. Scaling & Performance Optimization

### Running Tests in Parallel

Tests run in parallel by default. Configure workers:

```typescript
// playwright.config.ts
fullyParallel: true,
workers: process.env.CI ? 4 : undefined,
```

### Reducing CI/CD Time

```bash
# Run only changed tests
npm test -- --grep "@smoke"

# Run on subset of projects
npm test -- --project=chromium
```

### Cost Optimization

- Use scheduled runs instead of every commit
- Run full suite on main, quick smoke tests on PRs
- Archive old test artifacts (7-day retention)

---

## 11. Security Best Practices

✅ **DO:**

- Store secrets in GitHub Secrets
- Use HTTPS for all URLs
- Rotate credentials regularly
- Audit dependency security

❌ **DON'T:**

- Commit `.env` file
- Expose credentials in logs
- Use weak passwords for test accounts
- Disable SSL verification in production

---

## Contact & Support

For deployment issues:

1. Check troubleshooting guide above
2. Review test execution logs
3. Contact team lead
4. Create GitHub issue with detailed reproduction steps

---

## Appendix: Useful Commands

```bash
# Run all tests
npm test

# Run specific test file
npx playwright test tests/path/to/test.spec.ts

# Run tests matching pattern
npx playwright test --grep "login"

# Run in headed mode (see browser)
npm run test:headed

# Debug specific test
npx playwright test path/to/test.spec.ts --debug

# Run with specific browser
npx playwright test --project=firefox

# Update snapshots (visual regression)
npx playwright test --update-snapshots

# Generate coverage report
npx playwright test --reporter=coverage

# View HTML report
npx playwright show-report
```
