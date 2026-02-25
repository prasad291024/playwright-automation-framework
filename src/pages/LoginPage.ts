import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ILoginPage } from '../interface/pages.interface';
import { SELECTORS_BY_TESTID, SELECTORS } from '../utils/selectors';

/**
 * Login Page Object Model
 * Handles all login-related interactions and assertions
 */
export class LoginPage extends BasePage implements ILoginPage {
  /**
   * Navigate to login page
   */
  async goto(): Promise<void> {
    await this.navigateTo('/login');
    await this.waitForPageLoad();
  }

  /**
   * Fill username/email field
   * Prefers data-testid, falls back to role-based locator
   */
  async fillUsername(username: string): Promise<void> {
    const candidates = [
      this.getByTestId(SELECTORS_BY_TESTID.login.usernameInput),
      this.getByPlaceholder('username'),
      this.getByPlaceholder('email'),
      // label-based (e.g., <label for="username">Username</label>)
      this.page.getByLabel(/username|email/i),
      // role-based textbox with label/name
      this.getByRole('textbox', { name: /username|email/i }),
      // name attribute fallbacks
      this.locator('input[name="username"], input[name="email"]'),
      // common input types
      this.locator('input[type="email"], input[type="text"]'),
    ];

    for (const c of candidates) {
      try {
        if ((await c.count()) > 0) {
          await c.fill(username, { timeout: 8000 });
          return;
        }
      } catch (e) {
        // ignore and continue to next candidate
      }
    }

    // If nothing matched, throw a helpful error
    throw new Error('Unable to find username input using any of the configured selectors');
  }

  /**
   * Fill password field
   */
  async fillPassword(password: string): Promise<void> {
    const byTestId = this.getByTestId(SELECTORS_BY_TESTID.login.passwordInput);
    if ((await byTestId.count()) > 0) {
      await byTestId.fill(password);
      return;
    }

    const byPlaceholder = this.getByPlaceholder('password').first();
    if ((await byPlaceholder.count()) > 0) {
      await byPlaceholder.fill(password);
      return;
    }

    await this.locator(SELECTORS.login.passwordInput).fill(password);
  }

  /**
   * Click login button
   * Prefers role-based locator for accessibility
   */
  async clickLoginButton(): Promise<void> {
    const byRole = this.getByRole('button', { name: /login|sign in/i });
    if ((await byRole.count()) > 0) {
      await byRole.click();
      return;
    }

    const byTestId = this.getByTestId(SELECTORS_BY_TESTID.login.submitButton);
    if ((await byTestId.count()) > 0) {
      await byTestId.click();
      return;
    }

    await this.locator(SELECTORS.login.submitButton).click();
  }

  /**
   * Complete login flow with username and password
   */
  async login(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLoginButton();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verify successful login by checking for welcome message
   */
  async assertLoginSuccess(): Promise<void> {
    await expect(this.getByText(/welcome|dashboard|logged in/i).first()).toBeVisible();
  }

  /**
   * Verify login failed by checking for error message
   */
  async assertLoginFailure(): Promise<void> {
    await expect(
      this.getByTestId(SELECTORS_BY_TESTID.login.errorMessage).or(
        this.locator(SELECTORS.login.errorMessage),
      ),
    ).toBeVisible();
  }
}
