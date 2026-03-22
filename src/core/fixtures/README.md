# Playwright Fixtures

This folder contains the canonical custom Playwright fixtures used by the framework.

## Fixtures

- `auth.fixture.ts`
  - Provides a shared authenticated session for supported apps
  - Reuses app-specific storage state from `config/apps.json` when available
  - Falls back to app-specific login flows when credentials are configured
  - Preferred import: `import { test, expect } from '../core/fixtures/auth.fixture';`

- `test.fixture.ts`
  - Provides page-object fixtures for the legacy app-specific page model structure
  - Still available for suites that use `src/apps/...` page objects

## Usage

```typescript
import { test, expect } from '../core/fixtures/auth.fixture';

test('authenticated test', async ({ authenticatedPage, authSession }) => {
  expect(authSession.authenticated).toBeTruthy();
  await authenticatedPage.goto('/dashboard');
});
```
