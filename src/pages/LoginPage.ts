import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ILoginPage } from '../interface/pages.interface';
import { SELECTORS_BY_TESTID, SELECTORS } from '../utils/selectors';

/**
 * Login Page Object Model
 * Handles all login-related interactions and assertions
 * Uses stable, retry-enabled interaction methods
 */
export class LoginPage extends BasePage implements ILoginPage {
  /**
   * Navigate to login page with stability checks
   */
  async goto(): Promise<void> {
    await this.navigateTo('/login');
    // Ensure login form is visible before proceeding
    await this.expectWithRetry(
      async () => {
        const form = this.locator('form, [class*="login"]');
        expect(await form.count()).toBeGreaterThan(0);
      },
      { maxAttempts: 3 },
    );
  }

  /**
   * Fill username/email field with multiple fallback strategies
   * Prefers data-testid, falls back to role-based locator
   * Uses stable fill with retry logic
   */
  async fillUsername(username: string): Promise<void> {
    const candidates = [
      this.getByTestId(SELECTORS_BY_TESTID.login.usernameInput),
      this.getByPlaceholder(/username|email/i),
      // label-based (e.g., <label for="username">Username</label>)
      this.page.getByLabel(/username|email/i),
      // role-based textbox with label/name
      this.getByRole('textbox', { name: /username|email/i }),
      // name attribute fallbacks
      this.locator('input[name="username"], input[name="email"]'),
      // common input types
      this.locator('input[type="email"], input[type="text"]'),
    ];

    let lastError: Error | null = null;

    for (const candidate of candidates) {
      try {
        if ((await candidate.count()) > 0) {
          // Scroll into view if needed
          try {
            await this.scrollIntoView(candidate);
          } catch {
            // Not all locators support scrollIntoView, ignore
          }

          // Use stable fill with retry
          await this.stableFill(candidate, username);
          console.log(`✓ Username filled using candidate strategy`);
          return;
        }
      } catch (e) {
        lastError = e as Error;
        // Continue to next candidate
      }
    }

    // If nothing matched, throw a helpful error
    throw new Error(
      `Unable to find username input using any of the configured strategies. Last error: ${lastError?.message}`,
    );
  }

  /**
   * Fill password field with resilient strategies
   * Also handles auto-fill detection
   */
  async fillPassword(password: string): Promise<void> {
    const candidates = [
      this.getByTestId(SELECTORS_BY_TESTID.login.passwordInput),
      this.getByPlaceholder(/password/i),
      this.page.getByLabel(/password/i),
      this.getByRole('textbox', { name: /password/i }),
      this.locator('input[name="password"]'),
      this.locator('input[type="password"]'),
    ];

    for (const candidate of candidates) {
      try {
        if ((await candidate.count()) > 0) {
          try {
            await this.scrollIntoView(candidate);
          } catch {
            // Ignore if not scrollable
          }

          await this.stableFill(candidate, password);
          console.log(`✓ Password filled using candidate strategy`);
          return;
        }
      } catch (e) {
        // Continue to next candidate
      }
    }

    // Fallback to CSS selector (brittle but last resort)
    try {
      await this.stableFill(this.locator(SELECTORS.login.passwordInput), password);
      return;
    } catch (e) {
      throw new Error(`Unable to find password input: ${(e as Error).message}`);
    }
  }

  /**
   * Click login button with accessibility-first approach
   * Uses stable click with retry logic
   */
  async clickLoginButton(): Promise<void> {
    const candidates = [
      this.getByRole('button', { name: /login|sign in|submit/i }),
      this.getByTestId(SELECTORS_BY_TESTID.login.submitButton),
      this.locator('button[type="submit"]'),
      this.locator(SELECTORS.login.submitButton),
    ];

    for (const candidate of candidates) {
      try {
        if ((await candidate.count()) > 0) {
          try {
            await this.scrollIntoView(candidate);
          } catch {
            // Ignore if not scrollable
          }

          // Wait for button to be stable before clicking
          await this.waitForStableVisibility(candidate);
          await this.stableClick(candidate);
          console.log(`✓ Login button clicked successfully`);
          return;
        }
      } catch (e) {
        // Continue to next candidate
      }
    }

    throw new Error(`Unable to find login button using any strategy`);
  }

  /**
   * Complete login flow with enhanced stability
   * - Waits for form to be ready
   * - Fills credentials with retries
   * - Waits for navigation to complete
   * - Handles loading states
   */
  async login(username: string, password: string): Promise<void> {
    console.log(`\n🔐 Starting login flow...`);

    // Wait for login form to be stable before interacting
    await this.expectWithRetry(
      async () => {
        const usernameInput = await this.findElement([
          this.getByTestId(SELECTORS_BY_TESTID.login.usernameInput),
          this.getByPlaceholder(/username|email/i),
        ]);
        expect(usernameInput).not.toBeNull();
      },
      { maxAttempts: 4 },
    );

    // Fill credentials
    await this.fillUsername(username);
    await this.fillPassword(password);

    // Click login
    await this.clickLoginButton();

    // Wait for navigation and network to settle
    try {
      await this.page.waitForNavigation({ timeout: 10000 });
    } catch {
      console.log('No navigation occurred (might be SPA), waiting for network idle instead');
    }

    await this.waitForPageLoad();
    console.log(`✓ Login flow completed`);
  }

  /**
   * Verify successful login by checking for welcome message
   * Uses retry logic for slow page updates
   */
  async assertLoginSuccess(): Promise<void> {
    await this.expectWithRetry(
      async () => {
        const welcomeText = this.getByText(/welcome|dashboard|logged in|hello/i).first();
        expect(await welcomeText.isVisible()).toBe(true);
      },
      { maxAttempts: 5 },
    );
    console.log(`✓ Login success verified`);
  }

  /**
   * Verify login failed by checking for error message
   * Also uses retry logic
   */
  async assertLoginFailure(): Promise<void> {
    await this.expectWithRetry(
      async () => {
        const errorElement = await this.findElement([
          this.getByTestId(SELECTORS_BY_TESTID.login.errorMessage),
          this.locator(SELECTORS.login.errorMessage),
          this.getByText(/error|invalid|failed/i),
        ]);
        expect(errorElement).not.toBeNull();
      },
      { maxAttempts: 5 },
    );
    console.log(`✓ Login failure verified`);
  }
}
