# Flakiness Reduction Guide

This guide explains strategies and utilities to reduce test flakiness in the Playwright framework.

## Overview

Flakiness typically comes from:

1. **Timing issues** - Elements not ready when expected
2. **Brittle selectors** - CSS selectors that break with UI changes
3. **Network instability** - Slow or intermittent network
4. **Dynamic content** - Animations, loading states, async updates
5. **Environmental factors** - Browser differences, system slowness

## Built-in Strategies

### 1. Selector Resilience

**Priority order (most resilient to least):**

1. **data-testid** - Most resilient and explicit

   ```typescript
   this.getByTestId('submit-button');
   ```

2. **getByRole** - Accessible and semantic

   ```typescript
   this.getByRole('button', { name: /submit|save/i });
   ```

3. **getByPlaceholder** - Good for form inputs

   ```typescript
   this.getByPlaceholder(/username|email/i);
   ```

4. **getByText** - Good for buttons/links

   ```typescript
   this.getByText(/submit|save/i);
   ```

5. **getByLabel** - Good for associated inputs

   ```typescript
   this.page.getByLabel(/password/i);
   ```

6. **CSS selectors** - Last resort (brittle!)
   ```typescript
   this.locator('#submit-btn'); // ❌ Don't use if avoidable
   ```

**Best Practice:** Use multiple strategies with fallbacks:

```typescript
async fillUsername(username: string): Promise<void> {
  const candidates = [
    this.getByTestId('username-input'),      // First try test ID
    this.getByPlaceholder(/username|email/i), // Then placeholder
    this.page.getByLabel(/username/i),        // Then label
    this.locator('input[name="username"]'),   // Then name attribute
  ];

  for (const candidate of candidates) {
    if ((await candidate.count()) > 0) {
      await this.stableFill(candidate, username);
      return;
    }
  }

  throw new Error('Username input not found');
}
```

### 2. Stable Interactions

Replace direct interactions with retry-enabled versions:

**Stable Click**

```typescript
// ❌ Direct click (can fail if element not ready)
await button.click();

// ✅ Stable click with retries
await this.stableClick(button);
```

**Stable Fill**

```typescript
// ❌ Direct fill (can fail if input not ready)
await input.fill('text');

// ✅ Stable fill with retries
await this.stableFill(input, 'text');
```

**Resilient Type**

```typescript
// ✅ Slower character-by-character input (useful for validating inputs)
await this.resilientType(input, 'text@example.com', { delayBetweenCharsMs: 50 });
```

### 3. Wait Strategies

**Wait for Network Stability**

```typescript
// Waits for networkidle with fallback
await this.waitForPageLoad();

// Or in custom code:
import { waitForNetworkStable } from '../utils/flakeHelper';
await waitForNetworkStable(page, { maxWaitMs: 15000 });
```

**Wait for Stable Visibility**

```typescript
// Waits for element to be visible + animation complete
await this.waitForStableVisibility(element);
```

**Wait for Multiple Conditions**

```typescript
await this.waitForConditions([
  () => page.getByText('Loading...').isHidden(),
  () => page.getByTestId('content').isVisible(),
  () => page.locator('button').isEnabled(),
]);
```

### 4. Assertion Retries

Use retry logic for assertions that check dynamic content:

```typescript
// ✅ Assertion with retries (useful for async content)
await this.expectWithRetry(
  async () => {
    const element = await this.findElement([
      this.getByTestId('welcome-message'),
      this.getByText(/welcome/i),
    ]);
    expect(element).not.toBeNull();
  },
  { maxAttempts: 5, delayMs: 500 },
);
```

## Page Object Patterns

The page objects now include enhanced methods. Here's how to use them:

### LoginPage Example

```typescript
async login(username: string, password: string): Promise<void> {
  // Navigate with stability checks
  await this.goto();

  // Fill with retries and multiple fallback strategies
  await this.fillUsername(username);
  await this.fillPassword(password);

  // Click with stability checks
  await this.clickLoginButton();

  // Wait for page to stabilize
  await this.waitForPageLoad();

  // Verify success with retries
  await this.assertLoginSuccess();
}
```

### Custom Page Objects

When creating your own page objects, inherit from `BasePage` and use its utilities:

```typescript
import { BasePage } from './BasePage';

export class SearchPage extends BasePage {
  async fillSearchBox(query: string): Promise<void> {
    const searchBox = this.getByRole('searchbox');

    // Use stable fill instead of direct .fill()
    await this.stableFill(searchBox, query);
  }

  async clickSearchButton(): Promise<void> {
    const button = this.getByRole('button', { name: /search/i });

    // Use stable click
    await this.stableClick(button);

    // Wait for results with retry
    await this.expectWithRetry(
      async () => {
        const results = await this.findElement([
          this.getByTestId('search-results'),
          this.locator('article'),
        ]);
        expect(results).not.toBeNull();
      },
      { maxAttempts: 5 },
    );
  }

  async verifyNoResults(): Promise<void> {
    await this.expectWithRetry(
      async () => {
        const noResults = this.getByText(/no results|nothing found/i);
        expect(await noResults.isVisible()).toBe(true);
      },
      { maxAttempts: 3 },
    );
  }
}
```

## Timeout Configuration

Timeouts are configured in `playwright.config.ts`:

- **Test timeout**: 45s locally, 60s in CI (configurable)
- **Action timeout**: 8s (increased from 5s for resilience)
- **Navigation timeout**: 20s (increased from 15s)

Override timeouts per-test if needed:

```typescript
test.setTimeout(90_000); // Custom timeout for slow test

test('slow test', async ({ page }) => {
  // ...
});
```

## Debugging Flaky Tests

### 1. Enable Debug Output

```typescript
import { debugPageState } from '../utils/flakeHelper';

test('my test', async ({ page }) => {
  const loginPage = new LoginPage(page);

  try {
    await loginPage.login(username, password);
  } catch (e) {
    // Save debug info on failure
    await debugPageState(page, 'Login failed');
    throw e;
  }
});
```

### 2. View Execution Traces

Failed tests automatically save traces in `on-first-retry` mode. View them:

```bash
npx playwright show-trace trace.zip
```

### 3. Check Screenshots & Videos

Failed tests save videos to `test-results/`:

```
test-results/
  ├── chromium/
  │   ├── screenshots/
  │   └── video.webm
```

### 4. Run with Verbose Logging

```bash
PWDEBUG=1 npm test
# or for UI mode:
npx playwright test --ui
```

## Common Flakiness Patterns & Solutions

### Pattern 1: Element Not Ready

**Problem:** Element exists but not yet interactive (disabled, covered, etc.)

**Solution:** Use `waitForStableVisibility` and `stableClick`

```typescript
// ❌ Flaky
await button.click();

// ✅ Stable
await this.waitForStableVisibility(button);
await this.stableClick(button);
```

### Pattern 2: Slow Network

**Problem:** Elements load slowly after navigation

**Solution:** Use `waitForNetworkStable` instead of `networkidle`

```typescript
// ❌ Might timeout on slow networks
await page.waitForLoadState('networkidle');

// ✅ Uses fallback if network never fully idles
await this.waitForPageLoad();
```

### Pattern 3: Dynamic Content

**Problem:** Text/count changes as page loads

**Solution:** Use `expectWithRetry` for assertions

```typescript
// ❌ Flaky on async content
expect(await page.getByText('Loaded').count()).toBe(1);

// ✅ Retries until true
await this.expectWithRetry(
  async () => {
    expect(await page.getByText('Loaded').count()).toBe(1);
  },
  { maxAttempts: 10 },
);
```

### Pattern 4: Fragile CSS Selectors

**Problem:** CSS class names or IDs change frequently

**Solution:** Use semantic selectors (role, testid, label)

```typescript
// ❌ Flaky (class might change)
this.locator('.btn-primary.mt-2.px-4');

// ✅ Resilient
this.getByRole('button', { name: /submit/i });
```

### Pattern 5: Hidden/Off-Screen Elements

**Problem:** Element exists in DOM but not visible (off-screen, hidden, etc.)

**Solution:** Use `scrollIntoViewStable`

```typescript
// Adds element to script before interacting
await this.scrollIntoView(element);
await this.stableClick(element);
```

## Test Structure Template

Here's a recommended test structure for better stability:

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { DashboardPage } from '../../src/pages/DashboardPage';

test.describe('Authentication', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    // Setup
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
  });

  test('@smoke - User can login', async ({ page }) => {
    // Arrange
    const username = 'testuser';
    const password = 'test123';

    // Act
    await loginPage.goto();
    // ✅ Uses stable, retry-enabled methods
    await loginPage.login(username, password);

    // Assert
    // ✅ Uses expectWithRetry for dynamic content
    await dashboardPage.verifyWelcomeMessage();
  });

  test('User sees error on invalid credentials', async ({ page }) => {
    // Arrange
    const username = 'invalid@example.com';
    const password = 'wrong';

    // Act
    await loginPage.goto();
    await loginPage.login(username, password);

    // Assert
    // ✅ Retries assertion
    await loginPage.assertLoginFailure();
  });
});
```

## Performance Considerations

### When to Increase Timeouts

- **Slow CI environment**: Increase test timeout to 60-90s
- **Slow network**: Increase navigation timeout to 25-30s
- **Heavy animations**: Increase action timeout to 10s

### When NOT to Increase

- If test is fundamentally broken (use better selectors)
- If network is unreliable (fix environment, not test)
- As a band-aid for architectural issues

## Best Practices Checklist

- [ ] Use `data-testid` for elements needing stable selectors
- [ ] Use `getByRole` for semantic HTML elements
- [ ] Implement fallback selector strategies
- [ ] Use `stableClick`/`stableFill` for interactions
- [ ] Use `waitForPageLoad` instead of hard `waitForTimeout`
- [ ] Use `expectWithRetry` for dynamic content assertions
- [ ] Avoid CSS class/ID selectors when possible
- [ ] Test on slow network (DevTools > Network tab)
- [ ] Test on all supported browsers
- [ ] Use `--debug` flag for failing tests
- [ ] Keep test data independent and isolated
- [ ] Avoid test interdependencies

## Resources

- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Locator Strategy](https://playwright.dev/docs/locators)
- [Debugging](https://playwright.dev/docs/debug)
- [CI Best Practices](https://playwright.dev/docs/ci)
