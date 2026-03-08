# Playwright Best Practices: Flakiness-Resistant Automation

## Advanced BasePage Patterns for Robust Test Automation

This example demonstrates advanced patterns extracted from a production Playwright framework that handles flaky web applications effectively.

```typescript
import { Page, Locator, expect } from '@playwright/test';

/**
 * Advanced BasePage with Flakiness-Resistant Patterns
 *
 * This implementation showcases best practices for handling:
 * - Flaky element interactions
 * - Network instability
 * - Dynamic content loading
 * - Multiple selector strategies
 */
export abstract class BasePage {
  protected baseUrl: string;

  constructor(protected page: Page) {
    this.baseUrl = process.env.BASE_URL || 'https://your-app-url.com';
  }

  // ===== LOCATOR STRATEGIES =====

  /**
   * Get locator by data-testid (RECOMMENDED)
   * Most reliable and maintainable selector strategy
   */
  protected getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  /**
   * Get locator by ARIA role (ACCESSIBLE & RESILIENT)
   * Works well with semantic HTML and screen readers
   */
  protected getByRole(
    role: 'button' | 'link' | 'textbox' | 'heading',
    options?: { name?: string | RegExp; exact?: boolean }
  ): Locator {
    return this.page.getByRole(role, options);
  }

  /**
   * Get locator by placeholder text
   * Useful for form inputs with placeholder attributes
   */
  protected getByPlaceholder(text: string | RegExp): Locator {
    return this.page.getByPlaceholder(text);
  }

  // ===== FLAKINESS-RESISTANT INTERACTIONS =====

  /**
   * Stable Click with Retry Logic
   * Handles elements that detach/re-attach during clicks
   */
  protected async stableClick(locator: Locator, options?: { force?: boolean; timeout?: number }) {
    const { force = false, timeout = 10000 } = options || {};

    await expect(locator).toBeVisible({ timeout });

    // Retry click with exponential backoff
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        if (force) {
          await locator.click({ force: true });
        } else {
          await locator.click({ timeout: 2000 });
        }
        return; // Success
      } catch (error) {
        if (attempt === 3) throw error;

        // Wait before retry with exponential backoff
        await this.page.waitForTimeout(Math.pow(2, attempt) * 1000);
        await locator.scrollIntoViewIfNeeded();
      }
    }
  }

  /**
   * Stable Fill with Validation
   * Handles inputs that clear/reject values
   */
  protected async stableFill(locator: Locator, value: string, options?: { clear?: boolean }) {
    const { clear = true } = options || {};

    await expect(locator).toBeVisible();
    await expect(locator).toBeEnabled();

    if (clear) {
      await locator.clear();
    }

    await locator.fill(value);

    // Verify the value was actually set
    await expect(locator).toHaveValue(value);
  }

  /**
   * Resilient Type (Character-by-Character)
   * For inputs with validation, formatting, or overflow issues
   */
  protected async resilientType(locator: Locator, text: string, options?: { delay?: number }) {
    const { delay = 100 } = options || {};

    await expect(locator).toBeVisible();
    await locator.clear();

    // Type character by character with delay
    for (const char of text) {
      await locator.type(char, { delay });
    }

    // Verify final value
    await expect(locator).toHaveValue(text);
  }

  // ===== NETWORK & LOADING HANDLING =====

  /**
   * Wait for Network Stability
   * Ensures page is fully loaded before interactions
   */
  protected async waitForNetworkStability(options?: { timeout?: number }) {
    const { timeout = 15000 } = options || {};

    await this.page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Wait for Element Stable Visibility
   * Ensures element is visible AND not animating
   */
  protected async waitForStableVisibility(locator: Locator, options?: { timeout?: number }) {
    const { timeout = 10000 } = options || {};

    await expect(locator).toBeVisible({ timeout });

    // Wait for potential animations to complete
    await this.page.waitForTimeout(500);

    // Verify element is still visible (not detached during animation)
    await expect(locator).toBeVisible({ timeout: 1000 });
  }

  // ===== MULTIPLE SELECTOR FALLBACK =====

  /**
   * Find Element with Multiple Selector Strategies
   * Returns first locator that works (resilient to DOM changes)
   */
  protected async findElement(selectors: (string | Locator)[]): Promise<Locator> {
    for (const selector of selectors) {
      try {
        const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
        await expect(locator).toBeVisible({ timeout: 2000 });
        return locator;
      } catch {
        continue; // Try next selector
      }
    }
    throw new Error(`None of the selectors found: ${selectors.join(', ')}`);
  }

  // ===== ASSERTION WITH RETRY =====

  /**
   * Assertion with Retry Logic
   * Handles dynamic content that loads asynchronously
   */
  protected async expectWithRetry(
    assertion: () => Promise<void>,
    options?: { maxAttempts?: number; interval?: number }
  ) {
    const { maxAttempts = 3, interval = 1000 } = options || {};

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await assertion();
        return; // Success
      } catch (error) {
        if (attempt === maxAttempts) throw error;
        await this.page.waitForTimeout(interval);
      }
    }
  }

  // ===== NAVIGATION PATTERNS =====

  /**
   * Navigate with Stability Checks
   */
  async navigateTo(path: string): Promise<void> {
    await this.page.goto(`${this.baseUrl}${path}`);
    await this.waitForNetworkStability();
  }

  /**
   * Debug Helper for Troubleshooting
   */
  protected async debugState(reason?: string): Promise<void> {
    console.log(`🔍 Debug State: ${reason || 'Unknown'}`);
    console.log(`📍 Current URL: ${this.page.url()}`);

    // Take screenshot for visual debugging
    await this.page.screenshot({
      path: `debug-${Date.now()}.png`,
      fullPage: true
    });
  }
}
```

## Usage Examples

### Basic Flakiness-Resistant Interactions

```typescript
export class LoginPage extends BasePage {
  private get usernameInput() {
    return this.getByTestId('username');
  }

  private get passwordInput() {
    return this.getByPlaceholder(/password/i);
  }

  private get loginButton() {
    return this.getByRole('button', { name: 'Sign In' });
  }

  async login(username: string, password: string): Promise<void> {
    // Stable interactions handle flaky elements
    await this.stableFill(this.usernameInput, username);
    await this.stableFill(this.passwordInput, password);
    await this.stableClick(this.loginButton);
  }
}
```

### Multiple Selector Fallback Strategy

```typescript
export class ProductPage extends BasePage {
  private async getAddToCartButton(): Promise<Locator> {
    return this.findElement([
      this.getByTestId('add-to-cart'),           // Preferred
      this.getByRole('button', { name: 'Add to Cart' }), // Fallback
      '[data-cy="add-to-cart"]',                 // CSS fallback
      'button:has-text("Add to Cart")'           // Text fallback
    ]);
  }

  async addToCart(): Promise<void> {
    const button = await this.getAddToCartButton();
    await this.stableClick(button);
  }
}
```

### Retry Assertions for Dynamic Content

```typescript
export class DashboardPage extends BasePage {
  private get welcomeMessage() {
    return this.getByTestId('welcome-message');
  }

  async verifyWelcomeMessage(expectedText: string): Promise<void> {
    await this.expectWithRetry(
      async () => {
        await expect(this.welcomeMessage).toContainText(expectedText);
      },
      { maxAttempts: 5, interval: 500 }
    );
  }
}
```

## Key Benefits

✅ **Handles Flaky Elements**: Retry logic for clicks, fills, and assertions
✅ **Network Resilience**: Waits for stable page states
✅ **Multiple Selector Strategies**: Falls back when primary selectors fail
✅ **Animation Handling**: Waits for elements to stabilize
✅ **Debug Support**: Built-in troubleshooting helpers
✅ **Type Safety**: Full TypeScript support
✅ **Accessibility**: Prefers semantic locators (ARIA roles, test IDs)

## Best Practices Demonstrated

1. **Prefer Semantic Locators**: `getByTestId()`, `getByRole()` over CSS selectors
2. **Always Verify Interactions**: Check values after filling inputs
3. **Handle Network Delays**: Wait for network stability
4. **Use Retry Logic**: For dynamic content and animations
5. **Multiple Fallbacks**: Have backup selector strategies
6. **Debugging Support**: Include troubleshooting helpers

This pattern has proven effective in production environments with complex, dynamic web applications.