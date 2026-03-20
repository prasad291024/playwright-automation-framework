# Playwright Fixtures

Contains custom Playwright test fixtures that extend the base test context.

## Fixtures

- **`auth.fixture.ts`** - Authentication fixture providing pre-authenticated browser contexts
  - Used by tests that require a logged-in user session
  - Loads storage state from the app-specific path in `config/apps.json`
  - Falls back to an app-specific login flow when credentials are available
  - Example: `import { test } from '../fixture/auth.fixture';`

## Usage

Tests can extend the base `@playwright/test` with custom fixtures:

```typescript
import { test } from '../fixture/auth.fixture';

test('authenticated test', async ({ authenticatedPage }) => {
  // Use authenticatedPage - pre-authenticated with storage state
});
```
