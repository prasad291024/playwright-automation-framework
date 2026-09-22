# 🔒 Security Policy

This document outlines the security practices and policies for the Playwright UI Automation Framework repository.

## 📋 Table of Contents

- [Secret Management](#secret-management)
- [Environment Variables](#environment-variables)
- [Test Data Handling](#test-data-handling)
- [Storage State Security](#storage-state-security)
- [Logging and Reporting](#logging-and-reporting)
- [CI/CD Security](#cicd-security)
- [Dependency Management](#dependency-management)
- [Pre-commit Hooks](#pre-commit-hooks)
- [What Must Never Be Committed](#what-must-never-be-committed)
- [Security Best Practices](#security-best-practices)
- [Reporting Security Issues](#reporting-security-issues)

## 🔐 Secret Management

All application credentials and sensitive information must be managed through environment variables, never hardcoded in source code.

### Approved Methods:

- Environment variables (`.env` file, CI/CD platform secrets)
- Framework's secret management system
- Encrypted secrets in CI/CD platforms (GitHub Secrets, Jenkins Credentials)

### Prohibited Practices:

- Hardcoding passwords, API keys, or tokens in source files
- Committing `.env` files with real credentials
- Using real production credentials in test environments
- Storing secrets in logs, reports, or test artifacts

## 🌐 Environment Variables

The framework uses environment variables for all configuration and credentials:

### Application Credentials:

```
SAUCEDEMO_USERNAME
SAUCEDEMO_PASSWORD
CURA_USERNAME
CURA_PASSWORD
ORANGEHRM_USERNAME
ORANGEHRM_PASSWORD
```

> [!NOTE]
> **Public Demo Credentials vs. Private Secrets:**
>
> - **Public Demo Credentials:** Pre-configured accounts for third-party public training websites (SauceDemo, CURA Healthcare, OrangeHRM). These credentials are published openly on their respective login portals and are used strictly as test fixtures for automated UI demonstrations.
> - **Private Secrets:** Any enterprise or proprietary credentials, API keys, tokens, or private infrastructure passwords. Private secrets must NEVER be committed to Git, must NEVER have in-code string fallbacks, and must be injected exclusively via secure environment variables or repository secret managers.

### Configuration Overrides:

```
APP_NAME          # saucedemo, cura, orangehrm, local
ENVIRONMENT       # local, dev, staging, prod
HEADLESS          # true / false
SKIP_GLOBAL_AUTH_SETUP # Set to 1 to bypass pre-test global auth bootstrap
CI                # Set to true in CI environments
```

### Best Practices:

- Never commit `.env` files - use `.env.example` as template
- Use different credentials for different environments
- Rotate credentials regularly
- Use least-privilege principles for test accounts
- Document required variables in `.env.example` without real values

## 🧪 Test Data Handling

Test data should be synthetic and never contain real user information or production data.

### Guidelines:

- Use synthetic test data generators for realistic but fake data
- Never use real customer/user data in tests
- Mask or redact any sensitive data in test outputs
- Store test data in version-controlled files only if non-sensitive
- Use environment variables for credential-based test data
- Implement data cleanup routines where applicable

### Examples:

```typescript
// Good - using environment variables with validation
const username = process.env.APP_USERNAME;
const password = process.env.APP_PASSWORD;

if (!username || !password) {
  throw new Error('Missing credentials: set APP_USERNAME and APP_PASSWORD');
}

// Bad - hardcoded credentials or inline secret fallbacks
const username = 'admin';
const password = 'mySecretPassword123'; // NEVER DO THIS
const token = process.env.API_TOKEN || 'hardcoded_secret_fallback'; // NEVER DO THIS
```

## 💾 Storage State Security

Storage state (session cookies, localStorage) can contain sensitive authentication information.

### Practices:

- Storage state files are automatically gitignored (`storage-state/*.json`)
- Never commit storage state files to the repository
- Encrypt storage state if storing for extended periods
- Implement storage state rotation policies
- Consider storage state expiration and refresh mechanisms
- Treat storage state as sensitive as passwords

### Configuration:

Storage state files are stored in:

```
storage-state/
├── saucedemo.json
├── cura.json
└── orangehrm.json
```

All files in this directory are gitignored.

## 📝 Logging and Reporting

Logs, reports, and test artifacts must not contain sensitive information.

### Requirements:

- Redact credentials, tokens, and PII from logs
- Mask sensitive values in screenshots and videos when possible
- Sanitize test data in reports and attachments
- Review HTML reports, JSON reports, and JUnit reports for accidental secret inclusion
- Ensure traces and videos don't capture sensitive input fields

### Implementation:

- Custom logging utilities that automatically redact known sensitive patterns
- Test artifact sanitization hooks
- Sensitive field masking in Playwright configurations
- Regular audit of test outputs for data leakage

## 🔄 CI/CD Security

CI/CD pipelines must handle secrets securely without exposing them in logs or artifacts.

### GitHub Actions:

- Use `secrets.` context for accessing secrets (e.g., `${{ secrets.CURA_USERNAME }}`)
- Never echo or print secrets to logs
- Use environment variable masking in workflows
- Limit secret permissions to minimum required
- Use environment protection rules for production secrets

### Jenkins:

- Use Jenkins Credentials Binding plugin
- Mask credentials in console output
- Restrict credential access to specific jobs/nodes
- Regularly audit credential usage

### General:

- Never log environment variables that might contain secrets
- Use secret scanning in CI pipelines
- Implement least-privilege access for CI/CD service accounts
- Separate secrets for different environments (dev/staging/prod)

## 📦 Dependency Management

Dependencies must be regularly scanned for vulnerabilities and kept up to date.

### Practices:

- Regular dependency vulnerability scanning (`npm audit`)
- Prompt updating of dependencies with known vulnerabilities
- Removal of unused dependencies (especially those with high severity issues)
- Use of lockfiles (`package-lock.json`) for reproducible builds
- Peer review of new dependency additions
- Monitoring of dependency change logs for security updates

### Current Status:

- Unused `xlsx` dependency removed due to high severity vulnerabilities
- Regular vulnerability scanning integrated into CI
- Lockfile committed for dependency integrity

## 🔍 Pre-commit Hooks

Pre-commit hooks prevent accidental commitment of secrets and enforce code quality.

### Secret Detection:

- Custom script (`scripts/secret-detection.js`) scans staged files for potential secrets
- Detects patterns indicating passwords, API keys, tokens, etc.
- Masks output to prevent secret leakage during detection
- Integrates with lint-staged via `package.json`
- Runs automatically on `git commit` through husky

### What It Detects:

- Password patterns (`password: "value"`)
- API key patterns (`api_key: "value"`)
- Token patterns (`token: "value"`)
- Secret key patterns (`secret_key: "value"`)
- Authorization headers (`authorization: "Bearer ..."`)
- AWS access key IDs (`AKIA...`)
- High-entropy strings that might be secrets

### Exclusions:

- Markdown files (documentation may contain examples)
- JSON configuration files (may have legitimate values)
- Node modules, dist, build directories
- `.env.example` files (expected to have placeholders)
- Test data files using environment variables with fallbacks

## 🚫 What Must Never Be Committed

The following items must never be committed to this repository:

### Absolute Prohibitions:

- Real credentials (passwords, API keys, tokens, etc.)
- Production database connection strings
- Private SSH keys or SSL certificates
- `.env` files with real values
- Storage state files with real session data
- Logs containing sensitive information
- Test data with real PII or credentials

### Conditional Prohibitions (requires review):

- Example credentials in documentation (must be clearly marked as examples)
- Configuration files with placeholder values
- Security-related code snippets (review for actual secrets)

## 🛡️ Security Best Practices

### For Developers:

1. Always use environment variables for credentials
2. Never hardcode secrets, even temporarily
3. Use `.env.example` to document required variables
4. Run `npm run lint` before committing to trigger secret detection
5. Review test outputs for accidental secret inclusion
6. Report any suspected security issues immediately
7. Keep dependencies updated and scan regularly
8. Treat test environments with same security rigor as production

### For Reviewers:

1. Verify no hardcoded secrets in code changes
2. Check that new dependencies don't introduce vulnerabilities
3. Ensure documentation doesn't contain real credentials
4. Confirm test data uses synthetic or environment-driven values
5. Validate that CI/CD workflows handle secrets properly
6. Look for potential information leakage in test artifacts

## 🚨 Reporting Security Issues

If you discover a security issue in this repository:

### For Public Issues:

1. Do NOT open a public issue that discloses the vulnerability
2. Contact the repository owner through secure channels
3. Provide detailed steps to reproduce
4. Include impact assessment and suggested fixes
5. Allow reasonable time for remediation before public disclosure

### For Framework Users:

1. If using this framework in your own projects, apply the same security principles
2. Report issues in your implementation through your standard security channels
3. Consider contributing improvements back to this framework

## 🔄 Policy Updates

This security policy will be updated as new threats emerge and best practices evolve. Significant changes will be documented in the repository's changelog.

### Last Updated: September 2026

### Framework Version: 1.0.0

---

> **Remember**: Security is everyone's responsibility. When in doubt, err on the side of caution and treat information as sensitive until proven otherwise.
