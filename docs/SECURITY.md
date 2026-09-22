# Security Policy

## Secret Management

This framework follows a strict secret management policy to prevent accidental exposure of credentials and sensitive data.

### Environment Variables

All secrets must be provided via environment variables. The framework supports the following environment variables:

- `SAUCEDEMO_USERNAME`, `SAUCEDEMO_PASSWORD` - Credentials for SauceDemo
- `CURA_USERNAME`, `CURA_PASSWORD` - Credentials for CURA Healthcare
- `ORANGEHRM_USERNAME`, `ORANGEHRM_PASSWORD` - Credentials for OrangeHRM
- `USERNAME`, `PASSWORD` - Generic credentials (used as fallbacks)
- `TEST_EXECUTION_ENV` - Test execution environment (e.g., QA, staging)
- `BASE_URL` - Web UI base URL
- `API_BASE_URL` - API base URL
- `REALTIME_EMIT_PATH` - Realtime server endpoint

### Configuration Files

- `.env.example` contains example configuration with placeholders only. Never commit real secrets to this file.
- Real environment variables should be stored in `.env` (or `.env.local`) which is ignored by git via `.gitignore`.
- The `config/apps.json` file contains only non-sensitive configuration (URLs, timeouts, selectors). No secrets are stored here.

### Test Data

- Test data files (e.g., `src/apps/*/test-data/users.ts`) have been updated to read credentials from environment variables.
- Hardcoded secrets have been removed from all test data files.

### Storage State

- Browser storage state (cookies, localStorage) is saved to `storage-state/{app}.json` files.
- These files are ignored by git via `.gitignore` to prevent leaking session data.
- Storage state is generated automatically by the global setup hook and should never be committed.

### Logging and Reporting

- The framework avoids logging sensitive information.
- Console logs should never include passwords, tokens, or other secrets.
- Test artifacts (traces, videos, screenshots) are stored in `test-results/` and ignored by git.

### CI/CD Security

- In CI environments, secrets must be injected via the CI platform's secret management system (e.g., GitHub Secrets, Jenkins Credentials).
- The CI pipeline (`Jenkinsfile.docker` and `.github/workflows/ci.yml`) passes environment variables to containers without logging them.
- The `CI` environment variable is set to `true` in CI to adjust test retries and workers.

## What Must Never Be Committed

- Real credentials or passwords
- API keys, tokens, or client secrets
- Private keys or certificates
- `.env` files containing real values
- Storage state files (`storage-state/*.json`)
- Test data containing real user information
- Logs or reports containing sensitive data

## Local Development Setup

1. Copy `.env.example` to `.env`
2. Fill in the required environment variables with test credentials (never use production credentials)
3. Never commit the `.env` file

## Handling Accidental Commits

If a secret is accidentally committed:

1. Immediately consider the secret compromised and rotate it.
2. Remove the secret from the repository history using appropriate tools (e.g., `git filter-branch` or BFG Repo-Cleaner).
3. Update any affected services.

## Dependencies

- Dependencies are managed via `package.json` and `package-lock.json`.
- Run `npm audit` regularly to check for known vulnerabilities.
- Keep dependencies up to date to minimize security risks.

## Reporting Security Issues

If you discover a security issue in this framework, please report it immediately by opening an issue or contacting the maintainers.
